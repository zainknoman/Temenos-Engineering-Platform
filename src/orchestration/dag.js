import { createRun } from '../core/contracts.js';

export const NODE_STATUS=Object.freeze(['PENDING','RUNNING','COMPLETED','FAILED','BLOCKED','WAITING_APPROVAL','SKIPPED']);
const now=()=>new Date().toISOString();

export function createDag(nodes){
  if(!Array.isArray(nodes)||!nodes.length) throw new Error('DAG requires at least one node');
  const ids=new Set();
  for(const n of nodes){
    if(!n?.id) throw new Error('DAG node id is required');
    if(ids.has(n.id)) throw new Error('Duplicate DAG node: '+n.id);
    ids.add(n.id);
  }
  for(const n of nodes) for(const dep of n.dependsOn??[]) if(!ids.has(dep)) throw new Error('Unknown dependency '+dep+' for '+n.id);
  return {version:'1.0',nodes:nodes.map(n=>({id:n.id,name:n.name??n.id,dependsOn:[...(n.dependsOn??[])],approvalGate:Boolean(n.approvalGate),status:'PENDING'}))};
}
function readyNodes(dag){return dag.nodes.filter(n=>n.status==='PENDING'&&(n.dependsOn??[]).every(id=>dag.nodes.find(d=>d.id===id)?.status==='COMPLETED'))}
function hasBlockedDependency(dag,node){return(node.dependsOn??[]).some(id=>['FAILED','BLOCKED','SKIPPED'].includes(dag.nodes.find(d=>d.id===id)?.status))}
export class DagOrchestrator{
  constructor({store=null,runner=async()=>({})}={}){this.store=store;this.runner=runner;this.runs=new Map();this.events=new Map()}
  async createRun({project,workflow,nodes}){
    const dag=createDag(nodes);
    const run=createRun({id:'orchestration:'+project.id+':'+Date.now(),projectId:project.id,workflow,status:'CREATED',currentStage:dag.nodes[0].id});
    const state={run,dag,outputs:{},gates:Object.fromEntries(dag.nodes.filter(n=>n.approvalGate).map(n=>[n.id,{status:'PENDING'}]))};
    this.runs.set(run.id,state);this.events.set(run.id,[]);this.emit(run.id,'RUN_CREATED',{workflow,nodes:dag.nodes.map(n=>n.id)});
    if(this.store){this.store.add('runs',run);await this.store.save()} return state;
  }
  emit(runId,type,payload={}){const list=this.events.get(runId)??[];const event={id:'event:'+runId+':'+list.length,runId,type,at:now(),payload};list.push(event);this.events.set(runId,list);return event}
  getState(runId){return this.runs.get(runId)??null}
  getEvents(runId){return[...(this.events.get(runId)??[])]}
  async tick(runId,context={}){
    const state=this.runs.get(runId);if(!state)throw new Error('Unknown orchestration run: '+runId);
    if(['PAUSED','WAITING_APPROVAL','COMPLETED','FAILED','CANCELLED'].includes(state.run.status))return state;
    state.run.status='RUNNING';
    const ready=readyNodes(state.dag);
    for(const node of state.dag.nodes)if(node.status==='PENDING'&&hasBlockedDependency(state.dag,node))node.status='BLOCKED';
    if(ready.some(n=>n.approvalGate&&state.gates[n.id]?.status==='PENDING')){
      state.run.status='WAITING_APPROVAL';state.run.approvalState='REQUIRED';this.emit(runId,'APPROVAL_REQUIRED',{nodes:ready.filter(n=>n.approvalGate).map(n=>n.id)});await this.persist(state);return state;
    }
    const runnable=ready.filter(n=>!n.approvalGate||state.gates[n.id]?.status==='APPROVED');
    if(!runnable.length){
      const pending=state.dag.nodes.some(n=>n.status==='PENDING');const failed=state.dag.nodes.some(n=>['FAILED','BLOCKED'].includes(n.status));
      if(failed)state.run.status='FAILED';else if(!pending){state.run.status='COMPLETED';state.run.completedAt=now()}
      await this.persist(state);return state;
    }
    state.run.currentStage=runnable[0].id;
    await Promise.all(runnable.map(async node=>{
      node.status='RUNNING';this.emit(runId,'NODE_STARTED',{nodeId:node.id});
      try{const output=await this.runner({node:{...node},context,state});state.outputs[node.id]=output??null;node.status='COMPLETED';this.emit(runId,'NODE_COMPLETED',{nodeId:node.id})}
      catch(error){node.status='FAILED';node.error=error.message;this.emit(runId,'NODE_FAILED',{nodeId:node.id,error:error.message})}
    }));
    if(state.dag.nodes.some(n=>n.status==='FAILED'))state.run.status='FAILED';
    await this.persist(state);return state;
  }
  async run(runId,context={}){let state=this.getState(runId);if(!state)throw new Error('Unknown orchestration run: '+runId);while(!['COMPLETED','FAILED','WAITING_APPROVAL','PAUSED','CANCELLED'].includes(state.run.status))state=await this.tick(runId,context);return state}
  async approveGate(runId,nodeId,approved=true){
    const state=this.runs.get(runId);if(!state||!state.gates[nodeId])throw new Error('Unknown approval gate: '+nodeId);
    state.gates[nodeId].status=approved?'APPROVED':'REJECTED';state.run.approvalState=approved?'APPROVED':'REJECTED';
    if(!approved){state.dag.nodes.find(n=>n.id===nodeId).status='BLOCKED';state.run.status='FAILED'}else state.run.status='RUNNING';
    this.emit(runId,approved?'GATE_APPROVED':'GATE_REJECTED',{nodeId});await this.persist(state);return state;
  }
  async pause(runId){const s=this.runs.get(runId);if(!s)throw new Error('Unknown orchestration run: '+runId);s.run.status='PAUSED';this.emit(runId,'RUN_PAUSED');await this.persist(s);return s}
  async resume(runId,context={}){const s=this.runs.get(runId);if(!s)throw new Error('Unknown orchestration run: '+runId);s.run.status='RUNNING';this.emit(runId,'RUN_RESUMED');return this.run(runId,context)}
  async persist(state){if(!this.store)return state;const stored=this.store.get('runs',state.run.id);if(stored)Object.assign(stored,state.run);else this.store.add('runs',state.run);await this.store.save();return state}
}
export function createUpgradeAssessmentDag(){return createDag([
  {id:'repository-inventory',name:'RepoMind inventory',dependsOn:[]},
  {id:'release-comparison',name:'Temenos-Skills release comparison',dependsOn:[]},
  {id:'correlation',name:'Release change correlation',dependsOn:['repository-inventory','release-comparison']},
  {id:'risk-and-remediation',name:'Risk and remediation analysis',dependsOn:['correlation']},
  {id:'human-review',name:'Human review gate',dependsOn:['risk-and-remediation'],approvalGate:true},
  {id:'verification-and-report',name:'Verification plan and report',dependsOn:['human-review']}
])}
