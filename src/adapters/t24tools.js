import { buildT24ToolsDashboard, exportT24ToolsReport } from '../surfaces/t24tools.js';

export class T24ToolsAdapter {
  constructor({ platformName = 'Temenos-Engineering-Platform', schemaVersion = '1.0' } = {}) {
    this.platformName = platformName;
    this.schemaVersion = schemaVersion;
  }

  capabilities() {
    return ['getUpgradeDashboard', 'getArtifactRiskList', 'getEvidence', 'getRemediationChecklist', 'exportReport'];
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

  exportReport(input) {
    return exportT24ToolsReport(this.getUpgradeDashboard(input));
  }
}
