const ids={project:'project-value',release:'release-value',environment:'environment-value',status:'status-value',repomind:'repomind-value',skills:'skills-value',inventory:'inventory-value',blockers:'blockers-value',warnings:'warnings-value',findings:'findings-value',risk:'risk-value',remediation:'remediation-value',regression:'regression-value',migration:'migration-value',adc:'adc-value',certification:'certification-value',evidence:'evidence-value',safety:'safety-value',source:'source-value'};
const byId=id=>document.getElementById(id);
function text(id,value){const n=byId(id);if(n)n.textContent=value??'—'}
function statusClass(value){return String(value??'UNVERIFIED').toLowerCase().replaceAll('_','-')}
function renderList(id,values,empty){const n=byId(id);if(!n)return;n.replaceChildren();if(!values.length){const li=document.createElement('li');li.textContent=empty;n.append(li);return}for(const value of values){const li=document.createElement('li');li.textContent=value;n.append(li)}}
function render(report){
 text(ids.project,report.project?.name);text(ids.release,report.project?report.project.sourceRelease+' → '+report.project.targetRelease:'—');text(ids.environment,report.project?.environment);text(ids.status,report.summary?.status);text(ids.repomind,report.adapters?.repomind?.status);text(ids.skills,report.adapters?.temenosSkills?.status);
 text(ids.inventory,report.inventory?report.inventory.files+' files / '+report.inventory.dependencies+' dependencies':'Not loaded');text(ids.blockers,report.summary?.blockers?.length??0);text(ids.warnings,report.summary?.warnings?.length??0);
 const counts=report.summary?.counts??{};for(const key of ['findings','risk','remediation','regression','migration','adc','certification','evidence'])text(ids[key],counts[key]??0);
 text(ids.safety,report.safety?'Production: '+(report.safety.productionExecution?'ENABLED':'DISABLED')+' · Autonomous: '+(report.safety.autonomousExecution?'ENABLED':'DISABLED')+' · Human approval: '+(report.safety.requireHumanApproval?'REQUIRED':'NOT REQUIRED'):'—');text(ids.source,report.generatedAt?new Date(report.generatedAt).toLocaleString():'—');
 const status=byId(ids.status);if(status)status.className='status '+statusClass(report.summary?.status);for(const id of [ids.repomind,ids.skills]){const n=byId(id);if(n)n.className='pill '+statusClass(n.textContent)}
 renderList('blocker-list',report.summary?.blockers??[],'No blockers reported.');renderList('warning-list',report.summary?.warnings??[],'No warnings reported.');return report;
}
function normalizeReport(raw){
 let report=raw?.report&&typeof raw.report==='object'?raw.report:raw;
 if(!report||typeof report!=='object')throw new Error('Report JSON must contain a JSON object.');
 if(!report.project&&report.action==='inventory'&&report.inventory&&report.projectId){
   const repository=report.repository??{};
   report={
     schemaVersion:'1.0',
     generatedAt:new Date().toISOString(),
     project:{id:report.projectId,name:repository.projectName||report.projectId,status:'ACTIVE',sourceRelease:report.sourceRelease||'—',targetRelease:'—',environment:'—'},
     adapters:{repomind:{status:'READY'},temenosSkills:{status:'UNVERIFIED'}},
     inventory:{profile:repository,files:report.inventory.files,dependencies:report.inventory.dependencies,languages:report.inventory.languages,limitations:report.inventory.limitations||[]},
     summary:{status:'READY_WITH_WARNINGS',blockers:[],warnings:['Loaded from TEP inventory output; release target and assessment sections are not included.'],counts:{findings:0,risk:0,remediation:0,regression:0,migration:0,adc:0,certification:0,evidence:0}},
     safety:{productionExecution:false,autonomousExecution:false,requireHumanApproval:true}
   };
 }
 if(!report.project||typeof report.project!=='object')throw new Error('Report JSON is missing project data.');
 if(!report.summary||typeof report.summary!=='object')throw new Error('Report JSON is missing summary data.');
 if(!report.project.name||!report.project.sourceRelease||!report.project.targetRelease)throw new Error('Report JSON has incomplete project data.');
 if(!report.summary.status||!report.summary.counts||typeof report.summary.counts!=='object')throw new Error('Report JSON has incomplete summary data.');
 return report;
}
async function loadJsonFile(file){if(!file)throw new Error('No report file selected.');let raw;try{raw=JSON.parse((await file.text()).replace(/^\uFEFF/,''));}catch(error){throw new Error('Invalid JSON: '+error.message)}return render(normalizeReport(raw))}
async function loadFromUrl(url){const response=await fetch(url);if(!response.ok)throw new Error('HTTP '+response.status);return render(normalizeReport(await response.json()))}
function setMessage(message,error=false){const n=byId('message');if(n){n.textContent=message;n.dataset.error=error?'true':'false'}}
function loadDemo(){render({schemaVersion:'1.0',generatedAt:new Date().toISOString(),project:{id:'bank-r16-r25',name:'Bank R16 to R25',sourceRelease:'R16',targetRelease:'R25',environment:'sit'},adapters:{repomind:{status:'UNVERIFIED'},temenosSkills:{status:'UNVERIFIED'}},inventory:null,summary:{status:'READY_WITH_WARNINGS',blockers:[],warnings:['Load a RepoMind report to inspect the bank repository.'],counts:{findings:0,risk:0,remediation:0,regression:0,migration:0,adc:0,certification:0,evidence:0}},safety:{productionExecution:false,autonomousExecution:false,requireHumanApproval:true}});setMessage('Demo read model loaded. Choose “Load report JSON” to load a real report.') }
function initialize(){
 const fileInput=byId('report-file');
 if(fileInput)fileInput.addEventListener('change',async event=>{try{await loadJsonFile(event.target.files?.[0]);setMessage('Loaded report JSON successfully.')}catch(error){setMessage('Unable to load report JSON: '+error.message,true)}});
 byId('demo-button')?.addEventListener('click',loadDemo);
 byId('refresh-button')?.addEventListener('click',()=>{const url=new URLSearchParams(window.location.search).get('report');if(!url){setMessage('No report URL supplied. Use ?report=<url> or Load report JSON.',true);return}loadFromUrl(url).then(()=>setMessage('Loaded report from '+url)).catch(err=>setMessage('Unable to load report: '+err.message,true))});
 const url=new URLSearchParams(window.location.search).get('report');
 if(url)loadFromUrl(url).then(()=>setMessage('Loaded report from '+url)).catch(err=>setMessage('Unable to load report: '+err.message,true));
 else loadDemo();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
