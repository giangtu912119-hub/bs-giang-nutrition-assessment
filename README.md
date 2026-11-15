# BS Giang Nutrition Assessment Digital Tool

Prototype V0.1 — web application for pediatric nutrition assessment (0–5 years).

## Current scope
- Responsive dashboard shell
- Patient profile input (demo only)
- Anthropometry input (demo only)
- Arithmetic BMI preview (not a clinical interpretation)
- No server persistence, authentication, WHO Z-score calculation, AI recommendations, or PDF generation yet

## Run locally
Requirements: Node.js 20+

```bash
npm install
npm run dev
```

## Clinical safety
This prototype is not for clinical decision-making. Do not enter identifiable patient data. WHO growth calculations and clinical rules must be implemented and validated against official WHO reference data before clinical use.

## Planned modules
1. Authentication and role-based access
2. Patient and assessment database
3. WHO Child Growth Standards engine (0–5 years)
4. Dietary and lifestyle assessment
5. Clinician-reviewed assessment and counseling
6. Separate clinician and parent PDF reports
7. Audit logging, backups, and privacy controls
