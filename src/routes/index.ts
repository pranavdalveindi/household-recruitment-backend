import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { userRouter } from '../modules/user/user.routes';
import { regionRouter } from '../modules/region/region.routes';
import { householdRouter } from '../modules/household/household.routes';
import { householdMemberRouter } from '../modules/household-member/household-member.routes';
import { questionnaireRouter } from '../modules/questionnaire/questionnaire.routes';
import { callRouter } from '../modules/call/call.routes';
import { appointmentRouter } from '../modules/appointment/appointment.routes';
import { installationRouter } from '../modules/installation/installation.routes';
import { rejectionRouter } from '../modules/rejection/rejection.routes';
import { importRouter } from '../modules/import/import.routes';
import { reportRouter } from '../modules/report/report.routes';
import { dashboardRouter } from '../modules/dashboard/dashboard.routes';
import { noteRouter } from '../modules/note/note.routes';
import { auditRouter } from '../modules/audit/audit.routes';

export const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/users', userRouter);
rootRouter.use('/regions', regionRouter);
rootRouter.use('/households', householdRouter);
rootRouter.use('/household-members', householdMemberRouter);
rootRouter.use('/questionnaires', questionnaireRouter);
rootRouter.use('/calls', callRouter);
rootRouter.use('/appointments', appointmentRouter);
rootRouter.use('/installations', installationRouter);
rootRouter.use('/rejections', rejectionRouter);
rootRouter.use('/imports', importRouter);
rootRouter.use('/reports', reportRouter);
rootRouter.use('/dashboard', dashboardRouter);
rootRouter.use('/notes', noteRouter);
rootRouter.use('/audits', auditRouter);

