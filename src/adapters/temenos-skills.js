import{spawn}from'node:child_process';
import{createEvidence}from'../core/contracts.js';

export class ProviderUnavailableError extends Error{constructor(message,details={}){super(message);this.name='ProviderUnavailableError';this.category='PROVIDER_UNAVAILABLE';this.details=details}}
export class ProviderExecutionError extends Error{constructor(message,details={}){super(message);this.name='ProviderExecutionError';this.category='RUNTIME_FAILURE';this.details=details}}

export class TemenosSkillsAdapter{
 constructor(options={}){
  this.id='temenos-skills';
  this.version=options.version??'local-cli-v1';
  this.transport=options.transport??'cli';
  this.mode=options.mode??'worker';
  this.capabilities=['lookupField','searchRules','compareReleases','verifyArtifact'];
  this.skillsHome=options.skillsHome??process.env.TEMENOS_SKILLS_HOME??null;
  this.python=options.python??process.env.TEMENOS_SKILLS_PYTHON??'python';
  this.timeoutMs=options.timeoutMs??120000;
  this.runner=options.runner??((args)=>this.#runPython(args));
 }
 #runPython(args){
  if(!this.skillsHome)throw new ProviderUnavailableError('TEMENOS_SKILLS_HOME is not configured',{hint:'Set TEMENOS_SKILLS_HOME to the local Temenos-Skills repository.'});
  return new Promise((resolve,reject)=>{
   const child=spawn(this.python,['-c',args.code,...(args.argv??[])],{cwd:this.skillsHome,windowsHide:true});
   let stdout='',stderr='',done=false;
   const timer=setTimeout(()=>{if(!done){child.kill();reject(new ProviderExecutionError('Temenos-Skills command timed out',{timeoutMs:this.timeoutMs}))}},this.timeoutMs);
   child.stdout.on('data',d=>stdout+=d);child.stderr.on('data',d=>stderr+=d);
   child.on('error',e=>{clearTimeout(timer);done=true;reject(new ProviderExecutionError('Unable to start Temenos-Skills Python runtime',{cause:e.message}))});
   child.on('close',(code,signal)=>{clearTimeout(timer);done=true;if(code!==0)reject(new ProviderExecutionError('Temenos-Skills command failed',{code,signal,stderr:stderr.trim(),stdout:stdout.trim()}));else resolve(stdout.trim())});
  });
 }
 async healthCheck({release='R25'}={}){
  if(!this.skillsHome&&!this.runner)throw new ProviderUnavailableError('TEMENOS_SKILLS_HOME is not configured',{hint:'Set TEMENOS_SKILLS_HOME to the local Temenos-Skills repository.'});
  const code='import json,sys; from pipeline.releases import open_release_db; c=open_release_db(sys.argv[1]); c.execute("SELECT 1").fetchone(); c.close(); print(json.dumps({"status":"READY","release":sys.argv[1]}))';
  const out=await this.runner({code,argv:[release]});
  const result=JSON.parse(out);
  return{status:result.status??'READY',release,sourceSystem:'Temenos-Skills',transport:this.transport,mode:this.mode};
 }
 async lookupField({release='R23',application,field}){
  if(!application||!field)throw new Error('application and field are required');
  const code=`import json,sys; from pipeline.releases import open_release_db; c=open_release_db(sys.argv[1]); r=c.execute("SELECT field_name,position,java_alias,field_type,mandatory,description FROM fields WHERE app=? AND UPPER(field_name)=UPPER(?)",(sys.argv[2],sys.argv[3])).fetchone(); c.close(); print(json.dumps(dict(zip(["field_name","position","java_alias","field_type","mandatory","description"],r))) if r else print("null")`;
  const out=await this.runner({code,argv:[release,application,field]});
  const result=JSON.parse(out);
  if(!result)throw new ProviderUnavailableError(`Field ${field} was not found in ${application} for ${release}`,{release,application,field});
  return{...result,release,application,evidence:this.#evidence('FIELD_LOOKUP',release,`${application}.${field}`,result)};
 }
 async searchRules({query,topic=null,nResults=5}){
  if(!query)throw new Error('query is required');
  const code=`import json,sys; import joblib; from pathlib import Path; import chromadb; q=sys.argv[1]; topic=sys.argv[2] or None; n=int(sys.argv[3]); v=joblib.load(Path("vectordb")/"tfidf_vectorizer.joblib"); cl=chromadb.PersistentClient(path="vectordb").get_collection("t24_docs"); x=v.transform([q]).toarray().astype("float32").tolist(); r=cl.query(query_embeddings=x,n_results=n,where={"topic":topic} if topic else None); print(json.dumps([{"source":m["source"],"page":m["page"],"score":round(1-d,3),"text":d.strip()} for d,m,d in zip(r["documents"][0],r["metadatas"][0],r["distances"][0])]))`;
  const out=await this.runner({code,argv:[query,topic??'',String(nResults)]});
  return{query,topic,results:JSON.parse(out),evidence:this.#evidence('RULE_SEARCH',null,query,JSON.parse(out))};
 }
 async compareReleases({oldRelease='R23',newRelease='R25'}){
  const code=`import json,sys; from pipeline.release_diff import diff_releases; from pipeline.releases import open_release_db; a=open_release_db(sys.argv[1]); b=open_release_db(sys.argv[2]); print(json.dumps(diff_releases(a,b))); a.close(); b.close()`;
  const out=await this.runner({code,argv:[oldRelease,newRelease]});
  const result=JSON.parse(out);
  return{oldRelease,newRelease,...result,evidence:this.#evidence('RELEASE_DIFF',`${oldRelease}->${newRelease},`,`${oldRelease}->${newRelease}`,result.summary)};
 }
 async verifyArtifact({file,application=[],release='R25',noCompile=false}){
  if(!file)throw new Error('file is required');
  const code=`import json,sys; from pathlib import Path; from pipeline.artefact_fields import check_fields; from pipeline.releases import open_release_db; p=Path(sys.argv[1]); c=open_release_db(sys.argv[2]); src=p.read_text(encoding="utf-8",errors="replace"); out=[]; ok=True; apps=[x for x in sys.argv[3].split(",") if x];\nfor app in apps:\n r=check_fields(c,app,src); out.append({"app":app,"verified":r.verified,"missing":r.missing,"compiler_checked":r.compiler_checked}); ok=ok and not r.missing\nc.close(); print(json.dumps({"file":str(p),"release":sys.argv[2],"fields":out,"passed":ok}))`;
  const out=await this.runner({code,argv:[file,release,application.join(',')]});
  const result=JSON.parse(out);
  if(!noCompile)result.compile={status:'NOT_RUN',reason:'Phase 3 field verification adapter intentionally does not invoke the destructive/full compile path; use the Temenos-Skills verification CLI for compile verification.'};
  result.evidence=this.#evidence('ARTIFACT_VERIFICATION',release,file,result);
  return result;
 }
 #evidence(type,release,ref,payload){return createEvidence({id:`evidence:temenos-skills:${type}:${Date.now()}`,sourceSystem:'Temenos-Skills',sourceType:type,sourceReference:ref,release,toolVersion:this.version,excerpt:JSON.stringify(payload).slice(0,4000)})}
}
