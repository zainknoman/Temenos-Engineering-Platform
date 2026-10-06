import { DagOrchestrator,createUpgradeAssessmentDag } from '../orchestration/dag.js';
import { normalizeRepoMindIndex } from '../normalizers/repomind.js';
import { correlateReleaseChanges,classifyUpgradeRisk,buildUpgradeFindings,buildUpgradeEvidence } from '../analysis/upgrade.js';
import { buildAssessmentReport } from '../reports/assessment.js';

export async function runOrchestratedUpgradeAssessment({store,project,repomindIndex,temenosSkills,approval=true}){
  const orchestrator=new DagOrchestrator({store,runner:async({node,state})=>{
    const context=state.context;
    if(node.id==='repository-inventory') return normalizeRepoMindIndex({projectId:project.id,release:project.sourceRelease,index:repomindIndex});
    if(node.id==='release-comparison') return temenosSkills.compareReleases({oldRelease:project.sourceRelease,newRelease:project.targetRelease});
    if(node.id==='correlation') return classifyUpgradeRisk(correlateReleaseChanges({artifacts:context['repository-inventory'].artifacts,releaseDiff:context['release-comparison']}));
    if(node.id==='risk-and-remediation') return buildUpgradeFindings({project,correlations:context.correlation,evidenceIds:[]});
    if(node.id==='human-review') return {approved:true};
    if(node.id==='verification-and-report') return buildAssessmentReport({project,run:state.run,releaseDiff:context['release-comparison'],correlations:context.correlation,limitations:context['repository-inventory'].limitations??[]});
    return null;
  }});
  const state=await orchestrator.createRun({project,workflow:'R16-R25-UPGRADE-ASSESSMENT',nodes:createUpgradeAssessmentDag().nodes});
  state.context={};
  const originalRun=orchestrator.runner;
  orchestrator.runner=async input=>{const output=await originalRun(input);state.context[input.node.id]=output;return output};
  const first=await orchestrator.run(state.run.id);
  if(first.run.status==='WAITING_APPROVAL'){
    if(!approval)return{orchestrator,state:first};
    await orchestrator.approveGate(first.run.id,'human-review',true);
    await orchestrator.resume(first.run.id);
  }
  const final=orchestrator.getState(state.run.id);
  for(const e of final.outputs?.['repository-inventory']?.evidence??[])store.add('evidence',e);
  for(const d of final.outputs?.['repository-inventory']?.dependencies??[])store.add('dependencies',d);
  for(const a of final.outputs?.['repository-inventory']?.artifacts??[])store.add('artifacts',a);
  for(const f of final.outputs?.['risk-and-remediation']??[])store.add('findings',f);
  if(final.outputs?.['verification-and-report'])store.add('reports',final.outputs['verification-and-report']);
  const upgradeEvidence=buildUpgradeEvidence({project,releaseDiff:final.outputs?.['release-comparison'],correlations:final.outputs?.correlation??[]});
  store.add('evidence',upgradeEvidence);await store.save();
  return{orchestrator,state:final};
}
