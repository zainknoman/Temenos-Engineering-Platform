import { buildRegressionTestPack, comparePrePostBehavior, buildRegressionEvidence, buildRegressionAssessment } from '../regression/intelligence.js';

export class RegressionAdapter {
  constructor({ platformName = 'Temenos-Engineering-Platform', schemaVersion = '1.0' } = {}) {
    this.id = 'regression';
    this.version = schemaVersion;
    this.platformName = platformName;
    this.schemaVersion = schemaVersion;
    this.transport = 'local';
    this.capabilities = ['buildTestPack', 'comparePrePostBehavior', 'buildEvidence', 'buildAssessment'];
  }

  buildTestPack(input) { return buildRegressionTestPack(input); }
  comparePrePostBehavior(input) { return comparePrePostBehavior(input); }
  buildEvidence(input) { return buildRegressionEvidence(input); }
  buildAssessment(input) { return buildRegressionAssessment(input); }
}
