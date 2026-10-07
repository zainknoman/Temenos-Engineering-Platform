import{createHash}from'node:crypto';
const list=v=>Array.isArray(v)?v:[];
const hash=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
export function normalizeEvidenceRecord(input={}){
 if(!input.id)throw new Error('evidence.id is required');
 if(!input.sourceSystem)throw new Error('evidence.sourceSystem is required');
 const content=input.content??input.excerpt??input.result??null;
 return{schemaVersion:'1.0',id:input.id,projectId:input.projectId??null,sourceSystem:input.sourceSystem,sourceType:input.sourceType??'UNKNOWN',sourceReference:input.sourceReference??null,release:input.release??null,environment:input.environment??null,correlationId:input.correlationId??null,contentHash:input.contentHash??hash(content),content,occurredAt:input.occurredAt??input.collectedAt??new Date().toISOString(),collectedAt:input.collectedAt??new Date().toISOString(),tags:list(input.tags),metadata:input.metadata??{}};}
export function correlateEvidence({evidence=[],projectId=null,correlationId=null}={}){
 const records=list(evidence).map(normalizeEvidenceRecord).filter(e=>(projectId==null||e.projectId===projectId)&&(correlationId==null||e.correlationId===correlationId));
 const groups={};for(const e of records){const key=e.correlationId??e.projectId??'unscoped';(groups[key]??=[]).push(e);}
 return{schemaVersion:'1.0',type:'EVIDENCE_CORRELATION',projectId,correlationId,records,groups,recordCount:records.length,sourceSystems:[...new Set(records.map(e=>e.sourceSystem))],status:records.length?'CORRELATED':'EMPTY'};}
export function buildEvidenceSnapshot({projectId,evidence=[],runId=null}={}){
 const records=list(evidence).map(normalizeEvidenceRecord).filter(e=>!projectId||e.projectId===projectId);
 const manifest=records.map(e=>({id:e.id,contentHash:e.contentHash,sourceSystem:e.sourceSystem,correlationId:e.correlationId}));
 return{schemaVersion:'1.0',type:'EVIDENCE_SNAPSHOT',projectId,runId,recordCount:records.length,manifest,snapshotHash:hash(manifest),createdAt:new Date().toISOString()};}
export function federateTelemetry({telemetry=[],sourceSystem='external',projectId=null,correlationId=null}={}){
 return list(telemetry).map((t,i)=>normalizeEvidenceRecord({id:t.id??'telemetry:'+i,projectId,sourceSystem,sourceType:'TELEMETRY',correlationId,occurredAt:t.timestamp??t.occurredAt,content:t,metadata:{metric:t.metric,status:t.status}}));}
export function buildEvidenceFederationAssessment({projectId,evidence=[],telemetry=[],runId=null}={}){
 const normalized=[...list(evidence).map(normalizeEvidenceRecord),...list(telemetry).map(normalizeEvidenceRecord)];
 const correlation=correlateEvidence({evidence:normalized,projectId});
 const snapshot=buildEvidenceSnapshot({projectId,evidence:normalized,runId});
 return{schemaVersion:'1.0',type:'EVIDENCE_FEDERATION_ASSESSMENT',projectId,runId,correlation,snapshot,safety:{evidenceOnly:true,productionExecution:false,autonomousExecution:false}};}