import {buildAdcTopology,buildCompatibilityGate,buildSessionSafetyGate,buildMigrationCheckpoints,buildTrafficSwitchPlan,buildRollbackPlan,buildAdcReadinessGate,buildAdcZeroDowntimeAssessment} from '../adc-zero-downtime/intelligence.js';
export class AdcZeroDowntimeAdapter{
 capabilities(){return ['buildTopology','buildCompatibilityGate','buildSessionSafetyGate','buildMigrationCheckpoints','buildTrafficSwitchPlan','buildRollbackPlan','buildReadinessGate','buildAssessment'];}
 buildTopology(input){return buildAdcTopology(input)} buildCompatibilityGate(input){return buildCompatibilityGate(input)} buildSessionSafetyGate(input){return buildSessionSafetyGate(input)}
 buildMigrationCheckpoints(input){return buildMigrationCheckpoints(input)} buildTrafficSwitchPlan(input){return buildTrafficSwitchPlan(input)} buildRollbackPlan(input){return buildRollbackPlan(input)}
 buildReadinessGate(input){return buildAdcReadinessGate(input)} buildAssessment(input){return buildAdcZeroDowntimeAssessment(input)}
}