# PanelSphere - Role-Based Access Control (RBAC) Specification

## System Roles
1. `admin` (System Administrator)
2. `panel_manager` (Panel Manager / Recruitment Lead)
3. `call_center_agent` (Call Center Representative)
4. `field_executive` (Field Installation Executive)

---

## Role Permissions Matrix

| Capability | Admin | Panel Manager | Call Center Agent | Field Executive |
| :--- | :---: | :---: | :---: | :---: |
| **System & User Management** |
| Create / Edit Admin accounts | Yes | No | No | No |
| Create / Edit Panel Manager | Yes | No | No | No |
| Create / Edit Agent / Executive | Yes | Yes | No | No |
| View Users List | Yes | Yes | Yes (for assignments) | No |
| **Regions & Questionnaires** |
| Create / Edit Regions | Yes | No | No | No |
| Create / Manage Questionnaires | Yes | View only | View active | No |
| **Household Management** |
| View Household List / Search | Yes | Yes | Yes (assigned/uncontacted) | Assigned only |
| Edit Demographics (SEC, MOSR) | Yes | Yes | No | No |
| Upload Recruitment CSV | Yes | Yes | No | No |
| View Import Batches & History | Yes | Yes | No | No |
| **Call Center Workflow** |
| Record External Call Attempts | Yes | Yes | Yes | No |
| Record Appointment Decisions | Yes | Yes | Yes | No |
| Submit Questionnaire Responses | Yes | Yes | Yes | No |
| **Appointments & Visits** |
| Schedule Appointments | Yes | Yes | Yes | No |
| Assign Field Executives | Yes | Yes | Yes | No |
| Reschedule Appointments | Yes | Yes | Yes | No |
| Record Installation Outcomes | Yes | No | No | Yes (assigned only) |
| **Quality Control & Rejection** |
| Permanent Household Rejection | Yes | Yes (audited) | No | No |
| Replacement Household Matching | Yes | Yes | No | No |
| **Analytics & Auditing** |
| View Admin Dashboard | Yes | Yes | No | No |
| View Agent Dashboard | Yes | Yes | Yes (personal) | No |
| View Field Executive Dashboard | Yes | Yes | No | Yes (personal) |
| View Audit Logs | Yes | No | No | No |
| Export Reports (CSV/Excel) | Yes | Yes | No | No |

