import {
  buildExecutionPlan,
  collectExecutionEvidence,
  validateMigrationRehearsal,
  analyzeRuntimeLogs,
  compareRuntimeBehavior,
  buildReadinessGate,
  buildRuntimeMigrationAssessment
} from '../runtime-migration/intelligence.js';

export class RuntimeMigrationAdapter {
  constructor({ schemaVersion='1.0' }={}) {
    this.id='runtime-migration';
    this.version=schemaVersion;
    this.transport='local';
  }

  capabilities() {
    return ['buildExecutionPlan','collectExecutionEvidence','validateMigrationRehearsal','analyzeRuntimeLogs','compareRuntimeBehavior','buildReadinessGate','buildAssessment'];
  }

  buildExecutionPlan(input){return buildExecutionPlan(input)}
  collectExecutionEvidence(input){return collectExecutionEvidence(input)}
  validateMigrationRehearsal(input){return validateMigrationRehearsal(input)}
  analyzeRuntimeLogs(input){return analyzeRuntimeLogs(input)}
  compareRuntimeBehavior(input){return compareRuntimeBehavior(input)}
  buildReadinessGate(input){return buildReadinessGate(input)}
  buildAssessment(input){return buildRuntimeMigrationAssessment(input)}
}
