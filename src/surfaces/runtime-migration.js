import { buildRuntimeMigrationAssessment } from '../runtime-migration/intelligence.js';

export function buildRuntimeMigrationSurface({project,assessment=null,executionPlan=null,evidence=[]}) {
  return {
    schemaVersion:'1.0',
    surface:'T24Tools',
    type:'RUNTIME_MIGRATION_COCKPIT',
    project:{id:project.id,name:project.name,sourceRelease:project.sourceRelease,targetRelease:project.targetRelease},
    executionPlan:executionPlan?{type:executionPlan.type,status:executionPlan.status,stages:executionPlan.stages,affectedApplications:executionPlan.affectedApplications}:null,
    assessment:assessment?buildRuntimeMigrationAssessment({project,executionPlan:executionPlan??{type:'EXECUTION_PLAN'},evidence,...assessment}):null,
    evidence:evidence.map(e=>({id:e.id,sourceSystem:e.sourceSystem,sourceType:e.sourceType,sourceReference:e.sourceReference,release:e.release,excerpt:e.excerpt,collectedAt:e.collectedAt}))
  };
}
