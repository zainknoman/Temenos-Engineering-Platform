export class EventBusAdapter{
  constructor({publish=null,subscribe=null}={}){this.publishHandler=publish;this.subscribeHandler=subscribe;}
  capabilities(){return['publishEvent','subscribeEvents','eventBus'];}
  async publishEvent(event){if(typeof this.publishHandler!=='function')return{status:'NOT_CONFIGURED',event};return this.publishHandler(event);}
  async subscribeEvents(request={}){if(typeof this.subscribeHandler!=='function')return{status:'NOT_CONFIGURED',request};return this.subscribeHandler(request);}
}
export class QueueTelemetryAdapter extends EventBusAdapter{
  capabilities(){return['consumeTelemetry','publishEvent','subscribeEvents','eventBus'];}
  async consumeTelemetry(request={}){const result=await this.subscribeEvents({...request,topic:request.topic??'telemetry'});return result?.status==='NOT_CONFIGURED'?result:{status:'COLLECTED',records:result?.records??result?.events??[]};}
}