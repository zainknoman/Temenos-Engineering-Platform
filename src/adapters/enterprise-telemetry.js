export class HttpTelemetryAdapter{
  constructor({fetcher=globalThis.fetch,baseUrl='',headers={}}={}){this.fetcher=fetcher;this.baseUrl=baseUrl;this.headers=headers;}
  capabilities(){return['collectTelemetry','http','externalInfrastructure'];}
  async collectTelemetry({path='telemetry',method='GET',body=null,sourceSystem='external',projectId=null,correlationId=null}={}){
    if(!this.baseUrl||typeof this.fetcher!=='function')return{status:'NOT_CONFIGURED',records:[],sourceSystem};
    const response=await this.fetcher(new URL(path,this.baseUrl),{method,headers:{'content-type':'application/json',...this.headers},body:body==null?undefined:JSON.stringify(body)});
    if(!response.ok)throw new Error('Telemetry request failed: '+response.status);
    const payload=await response.json();
    return{status:'COLLECTED',sourceSystem,projectId,correlationId,records:Array.isArray(payload)?payload:(payload.records??[payload])};
  }
}
export class AdcTelemetryAdapter extends HttpTelemetryAdapter{capabilities(){return['collectTelemetry','adc','loadBalancer','http','externalInfrastructure'];}}
export class RuntimeTelemetryAdapter extends HttpTelemetryAdapter{capabilities(){return['collectTelemetry','runtime','http','externalInfrastructure'];}}