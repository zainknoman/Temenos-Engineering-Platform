import { buildT24ToolsDashboard, exportT24ToolsReport } from '../surfaces/t24tools.js';
import { buildRuntimeMigrationSurface } from '../surfaces/runtime-migration.js';

export class T24ToolsAdapter {
  constructor({ platformName = 'Temenos-Engineering-Platform', schemaVersion = '1.0' } = {}) {
    this.platformName = platformName;
    this.schemaVersion = schemaVersion;
  }

  capabilities() {
    return ['getUpgradeDashboard', 'getArtifactRiskList', 'getEvidence', 'getRemediationChecklist', 'getRegressionStatus', 'getRuntimeMigrationStatus', 'exportReport'];
  }

  getUpgradeDashboard(input) {
    return buildT24ToolsDashboard(input);
  }

  getArtifactRiskList(input) {
    return this.getUpgradeDashboard(input).riskList;
  }

  getEvidence(input) {
    return this.getUpgradeDashboard(input).evidence;
  }

  getRemediationChecklist(input) {
    return this.getUpgradeDashboard(input).checklist;
  }

  getRegressionStatus(input) {
    return this.getUpgradeDashboard(input).regression;
  }

  getRuntimeMigrationStatus(input) {
    return buildRuntimeMigrationSurface(input);
  }

  exportReport(input) {
    return exportT24ToolsReport(this.getUpgradeDashboard(input));
  }
}
