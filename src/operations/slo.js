const n=v=>Number(v??0);
export function evaluateSlo({name='cutover',measurements=[],targets={availabilityMin:99.9,errorRateMax:0.1,latencyMaxMs:500}}={}){
  const rows=Array.isArray(measurements)?measurements:[],availability=rows.length?rows.filter(r=>r.healthy!==false).length/rows.length*100:100,errorRate=rows.length?rows.filter(r=>r.error).length/rows.length*100:0,latencies=rows.map(r=>n(r.latencyMs)).filter(v=>v>0),latency=latencies.length?Math.max(...latencies):0;
  const checks={availability:availability>=n(targets.availabilityMin),errorRate:errorRate<=n(targets.errorRateMax),latency:latency<=n(targets.latencyMaxMs)};
  return{schemaVersion:'1.0',name,metrics:{availability,errorRate,latencyMaxMs:latency},targets,checks,status:Object.values(checks).every(Boolean)?'PASS':'FAIL'};
}
export function buildOperationalMetrics({events=0,evidence=0,telemetry=0,failedOperations=0,slo=null}={}){return{schemaVersion:'1.0',events,evidence,telemetry,failedOperations,slo,status:slo?.status??'NOT_EVALUATED'};}