import {spawn} from 'node:child_process';
export class AgenticSuiteAdapter{
  constructor(options={}){
    this.id='agentic-suite';this.version=options.version??'worker-bridge-v1';this.transport=options.transport??'worker';
    this.home=options.home??process.env.AGENTIC_SUITE_HOME??null;this.command=options.command??process.env.AGENTIC_SUITE_COMMAND??null;
    this.runner=options.runner??runCommand;this.capabilities=['createWorkflow','startRun','pauseRun','resumeRun','approveGate','getRunState','getRunEvents'];this.state=new Map();
  }
  createWorkflow({runId,workflow,dag,context={}}){return{manifest:{version:'1.0',provider:'Temenos-Engineering-Platform',orchestrator:'agentic-suite',runId,workflow,dag,context,createdAt:new Date().toISOString()},transport:this.transport,home:this.home}}
  async startRun(input){const{manifest}=this.createWorkflow(input);const result=await this.invoke('start',manifest);this.state.set(manifest.runId,{...manifest,status:'RUNNING',result,events:[]});return this.state.get(manifest.runId)}
  async pauseRun(runId){return this.commandState('pause',runId)}
  async resumeRun(runId){return this.commandState('resume',runId)}
  async approveGate(runId,nodeId,approved=true){const result=await this.invoke('approve',{runId,nodeId,approved});return{runId,nodeId,approved,result}}
  getRunState(runId){return this.state.get(runId)??null}
  getRunEvents(runId){return this.state.get(runId)?.events??[]}
  async commandState(action,runId){const result=await this.invoke(action,{runId});const state=this.state.get(runId)??{runId};state.status=action==='pause'?'PAUSED':'RUNNING';state.lastCommand=result;this.state.set(runId,state);return state}
  async invoke(action,payload){if(!this.command)return{mode:'manifest-only',action,payload};return this.runner({command:this.command,args:[action],cwd:this.home??process.cwd(),payload})}
}
async function runCommand({command,args,cwd,payload}){return new Promise((resolve,reject)=>{const child=spawn(command,args,{cwd,env:{...process.env,TEMENOS_PLATFORM_PAYLOAD:JSON.stringify(payload)},shell:true,stdio:['ignore','pipe','pipe']});let stdout='',stderr='';child.stdout.on('data',d=>stdout+=d);child.stderr.on('data',d=>stderr+=d);child.on('error',reject);child.on('close',code=>code===0?resolve({code,stdout:stdout.trim(),stderr:stderr.trim()}):reject(new Error('agentic-suite command failed ('+code+'): '+stderr.trim())))})}
