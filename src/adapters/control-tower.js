import {buildUpgradeControlTower,buildCutoverTimeline,evaluateGoNoGo,buildControlTowerEvidence} from '../control-tower/intelligence.js';
export class UpgradeControlTowerAdapter{
 capabilities(){return ['buildControlTower','buildCutoverTimeline','evaluateGoNoGo','buildEvidence'];}
 buildControlTower(input){return buildUpgradeControlTower(input)}
 buildCutoverTimeline(input){return buildCutoverTimeline(input)}
 evaluateGoNoGo(input){return evaluateGoNoGo(input)}
 buildEvidence(input){return buildControlTowerEvidence(input)}
}