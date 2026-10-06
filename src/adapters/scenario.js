import{buildCutoverScenario,simulateCutoverScenario,replayCutoverReadiness,simulateBlastRadius,compareCutoverEnvironments,buildOperatorHandoff}from'../scenario/intelligence.js';
export class ScenarioSimulationAdapter{
 capabilities(){return['createScenario','simulateScenario','replayReadiness','simulateBlastRadius','compareEnvironments','getOperatorHandoff'];}
 createScenario(input){return buildCutoverScenario(input);}
 simulateScenario(input){return simulateCutoverScenario(input);}
 replayReadiness(input){return replayCutoverReadiness(input);}
 simulateBlastRadius(input){return simulateBlastRadius(input);}
 compareEnvironments(input){return compareCutoverEnvironments(input);}
 getOperatorHandoff(input){return buildOperatorHandoff(input);}
}
