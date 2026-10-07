const REQUIRED_DISCOVERY_FIELDS=Object.freeze(['id','version','transport','capabilities']);

function required(value,name){if(value===undefined||value===null||value==='')throw new Error(name+' is required');return value}

export function createAdapterConfig(input={}){
 return{id:required(input.id,'adapter.id'),provider:input.provider??input.id,enabled:input.enabled??true,requiredCapabilities:[...(input.requiredCapabilities??[])],settings:{...(input.settings??{})}};
}

export function discoverAdapter(adapter){
 if(!adapter?.id)throw new Error('Adapter id is required');
 const capabilities=typeof adapter.capabilities==='function'?adapter.capabilities():adapter.capabilities??[];
 const result={id:adapter.id,version:adapter.version??'unknown',transport:adapter.transport??'unknown',capabilities:[...capabilities]};
 for(const field of REQUIRED_DISCOVERY_FIELDS)if(result[field]===undefined||result[field]===null)throw new Error('Adapter discovery field is missing: '+field);
 return result;
}

export function validateAdapterCapabilities(adapter,requiredCapabilities=[]){
 const discovered=discoverAdapter(adapter);
 const requiredList=[...requiredCapabilities];
 const missing=requiredList.filter(capability=>!discovered.capabilities.includes(capability));
 return{valid:missing.length===0,required:requiredList,missing,capabilities:discovered.capabilities};
}

export async function checkAdapterReadiness(adapter,{requiredCapabilities=[]}={}){
 const discovery=discoverAdapter(adapter);
 const capabilityCheck=validateAdapterCapabilities(adapter,requiredCapabilities);
 if(!capabilityCheck.valid)return{status:'FAILED',discovery,capabilityCheck,checks:[{name:'capabilities',status:'FAILED'}]};
 if(typeof adapter.healthCheck!=='function')return{status:'UNVERIFIED',discovery,capabilityCheck,checks:[{name:'health',status:'UNVERIFIED',reason:'Adapter does not expose healthCheck().'}]};
 try{
  const health=await adapter.healthCheck();
  const status=health?.status??'READY';
  return{status,discovery,capabilityCheck,checks:[{name:'health',status,details:health}]};
 }catch(error){
  return{status:'FAILED',discovery,capabilityCheck,checks:[{name:'health',status:'FAILED',error:error.message}]};
 }
}

export function validateRepoMindInput(input){
 const errors=[];
 if(!input||typeof input!=='object')errors.push('RepoMind input must be an object');
 if(!Array.isArray(input?.files))errors.push('RepoMind input must contain a files array');
 for(const[index,file]of(input?.files??[]).entries())if(!file?.path)errors.push('RepoMind file['+index+'].path is required');
 for(const[index,edge]of(input?.imports??[]).entries()){
  if(!edge?.from&&!edge?.path)errors.push('RepoMind import['+index+'] source is required');
  if(!edge?.to&&!edge?.module)errors.push('RepoMind import['+index+'] target is required');
 }
 return{valid:errors.length===0,errors};
}

export async function onboardRepoMind({adapter,input,projectId,release,requiredCapabilities=['getRepositoryProfile','listArtifacts','getDependencies','analyzeImpact']}){
 const inputCheck=validateRepoMindInput(input);
 if(!inputCheck.valid)return{status:'FAILED',inputCheck,readiness:null,normalized:null};
 const capabilityCheck=validateAdapterCapabilities(adapter,requiredCapabilities);
 if(!capabilityCheck.valid)return{status:'FAILED',inputCheck,readiness:null,capabilityCheck,normalized:null};
 adapter.loadIndex(input);
 const readiness=await checkAdapterReadiness(adapter,{requiredCapabilities});
 if(readiness.status!=='READY')return{status:readiness.status,inputCheck,capabilityCheck,readiness,profile:null,normalized:null};
 const normalized=adapter.normalize(projectId,release);
 return{status:'READY',inputCheck,capabilityCheck,readiness,profile:adapter.getRepositoryProfile(),normalized};
}

export async function onboardTemenosSkills({adapter,requiredCapabilities=['lookupField','searchRules','compareReleases','verifyArtifact'],release='R25',healthCheck=true}={}){
 const capabilityCheck=validateAdapterCapabilities(adapter,requiredCapabilities);
 if(!capabilityCheck.valid)return{status:'FAILED',capabilityCheck,readiness:null};
 const readiness=healthCheck?await checkAdapterReadiness(adapter,{requiredCapabilities}):{status:'UNVERIFIED',discovery:discoverAdapter(adapter),capabilityCheck,checks:[]};
 return{status:readiness.status,capabilityCheck,readiness};
}
