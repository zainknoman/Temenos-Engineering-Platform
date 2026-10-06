export class EventStreamAdapter{
 constructor({publish=null,history=[]}={}){this.publishHandler=publish;this.history=Array.isArray(history)?[...history]:[];}
 capabilities(){return['appendEvent','listEvents'];}
 appendEvent(event){const normalized={id:event?.id??'event:'+this.history.length+1,type:event?.type??'UNKNOWN',timestamp:event?.timestamp??new Date().toISOString(),payload:event?.payload??null};this.history.push(normalized);if(typeof this.publishHandler==='function')return Promise.resolve(this.publishHandler(normalized)).then(()=>normalized);return normalized;}
 listEvents(filter={}){return this.history.filter(e=>!filter.type||e.type===filter.type);}
}
