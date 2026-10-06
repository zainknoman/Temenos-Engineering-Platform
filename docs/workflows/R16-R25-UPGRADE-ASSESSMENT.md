# Workflow — R16 → R25 Upgrade Assessment

## Objective

Identify customization risk when a bank upgrades Temenos Transact from R16 to R25.

## Inputs

- source repository
- source release R16
- target release R25
- optional bank/environment metadata

## Stages

1. **Inventory** — RepoMind identifies custom applications, routines, versions, enquiries, services, Java hooks, components and dependencies.
2. **Normalize** — convert observations into common Artifact objects.
3. **Release analysis** — Temenos-Skills supplies release-aware knowledge and relevant R16/R25 differences.
4. **Correlate** — link bank artifacts to impacted Temenos fields, APIs, classes, applications and components.
5. **Risk** — classify findings using evidence and dependency context.
6. **Remediation** — generate recommendations, not automatic production changes.
7. **Verification** — compile or otherwise verify where supported.
8. **Review** — human engineer accepts/rejects recommendations.
9. **Report** — produce technical and management views with evidence and provenance.

### Initial risk levels

- **Critical:** likely blocks migration or can cause severe failure
- **High:** substantial remediation/regression likely
- **Medium:** targeted remediation/testing required
- **Low:** limited impact or informational

The workflow becomes the foundation for controlled remediation, regression generation and eventually an upgrade factory.
