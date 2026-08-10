import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ApiPage from './lib/ApiPage';
import { PageProvider } from './lib/inertia';
import PageLoader from './Components/PageLoader';

import Welcome from './Pages/Welcome';
import About from './Pages/Public/About';
import Faith from './Pages/Public/Faith';
import MissionaryPosting from './Pages/Public/MissionaryPosting';
import RegistrationSuccess from './Pages/Public/RegistrationSuccess';
import Login from './Pages/Auth/Login';
import AuthError from './Pages/Errors/Auth';
import Error403 from './Pages/Errors/403';
import Error404 from './Pages/Errors/404';
import Error500 from './Pages/Errors/500';

import {
  Dashboard,
  ActivityLog,
  Administration,
  Stakeholders,
  SettingsIndex,
  SettingsWebsite,
  RolesIndex,
  AdminsIndex,
  AdminsShow,
  AdminsEdit,
  DirectorsIndex,
  DirectorsCreate,
  DirectorsShow,
  DirectorsEdit,
  SdmsIndex,
  SdmsShow,
  SdmsEdit,
  PanelistsIndex,
  PanelistsShow,
  PanelistsEdit,
  PostingRecommendationsIndex,
  PostingRecommendationsCreate,
  PostingRecommendationsEdit,
  ApplicantsIndex,
  ApplicantsCreate,
  ApplicantsEdit,
  ApplicantsView,
  ApplicantsUploads,
  ApplicantsProgress,
  BiodataForm,
  InterviewsIndex,
  InterviewsCreate,
  InterviewsEdit,
  InterviewsManage,
  NomenclatureIndex,
  DepartmentsIndex,
  RanksIndex,
  QuestionsIndex,
  QuestionsCreate,
  AnalyticsIndex,
  TblUsersIndex,
  TblUsersYear,
  TblUsersShow,
  SdmDashboard,
  SdmApplicants,
  SdmInterviews,
  DirectorDashboard,
  PanelistDashboard,
  PanelistInterviewsIndex,
  PanelistRecommendationsIndex,
  PanelistInterviewManage,
  PersonnelIndex,
  PersonnelCreate,
  PersonnelShow,
  PersonnelEdit,
} from './pages.lazy';

function StaticShell({ children }) {
  return (
    <PageProvider value={{ appName: import.meta.env.VITE_APP_NAME || 'MSNC Recruitment' }}>
      {children}
    </PageProvider>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<ApiPage endpoint="/welcome" component={Welcome} />} />
      <Route path="/about" element={<ApiPage endpoint="/about" component={About} />} />
      <Route path="/statement-of-faith" element={<ApiPage endpoint="/statement-of-faith" component={Faith} />} />
      <Route
        path="/opportunity-to-work-in-ministry"
        element={<ApiPage endpoint="/opportunity-to-work-in-ministry" component={MissionaryPosting} />}
      />
      <Route
        path="/opportunity-to-work-in-ministry/success"
        element={<ApiPage endpoint="/opportunity-to-work-in-ministry/success" component={RegistrationSuccess} />}
      />
      <Route path="/login/:role" element={<ApiPage endpoint={(p) => `/login/${p.role}`} component={Login} />} />
      <Route path="/auth/error" element={<StaticShell><AuthError /></StaticShell>} />

      {/* Applicant */}
      <Route path="/applicant" element={<ApiPage endpoint="/applicant" component={BiodataForm} />} />

      {/* Admin */}
      <Route path="/administrator" element={<ApiPage endpoint="/administrator" component={Dashboard} />} />
      <Route path="/administrator/activity-log" element={<ApiPage endpoint="/administrator/activity-log" component={ActivityLog} />} />
      <Route path="/administrator/analytics" element={<ApiPage endpoint="/administrator/analytics" component={AnalyticsIndex} />} />
      <Route path="/administrator/menu" element={<ApiPage endpoint="/administrator/menu" component={Administration} />} />
      <Route path="/administrator/stakeholders" element={<ApiPage endpoint="/administrator/stakeholders" component={Stakeholders} />} />
      <Route path="/administrator/settings" element={<ApiPage endpoint="/administrator/settings" component={SettingsIndex} />} />
      <Route path="/administrator/settings/website" element={<ApiPage endpoint="/administrator/settings/website" component={SettingsWebsite} />} />
      <Route path="/administrator/roles" element={<ApiPage endpoint="/administrator/roles" component={RolesIndex} />} />

      <Route path="/administrator/admins" element={<ApiPage endpoint="/administrator/admins" component={AdminsIndex} />} />
      <Route path="/administrator/admins/:id" element={<ApiPage endpoint={(p) => `/administrator/admins/${p.id}`} component={AdminsShow} />} />
      <Route path="/administrator/admins/:id/edit" element={<ApiPage endpoint={(p) => `/administrator/admins/${p.id}/edit`} component={AdminsEdit} />} />

      <Route path="/administrator/directors" element={<ApiPage endpoint="/administrator/directors" component={DirectorsIndex} />} />
      <Route path="/administrator/directors/create" element={<ApiPage endpoint="/administrator/directors/create" component={DirectorsCreate} />} />
      <Route path="/administrator/directors/:id" element={<ApiPage endpoint={(p) => `/administrator/directors/${p.id}`} component={DirectorsShow} />} />
      <Route path="/administrator/directors/:id/edit" element={<ApiPage endpoint={(p) => `/administrator/directors/${p.id}/edit`} component={DirectorsEdit} />} />

      <Route path="/administrator/sdms" element={<ApiPage endpoint="/administrator/sdms" component={SdmsIndex} />} />
      <Route path="/administrator/sdms/:id" element={<ApiPage endpoint={(p) => `/administrator/sdms/${p.id}`} component={SdmsShow} />} />
      <Route path="/administrator/sdms/:id/edit" element={<ApiPage endpoint={(p) => `/administrator/sdms/${p.id}/edit`} component={SdmsEdit} />} />

      <Route path="/administrator/panelists" element={<ApiPage endpoint="/administrator/panelists" component={PanelistsIndex} />} />
      <Route path="/administrator/panelists/:id" element={<ApiPage endpoint={(p) => `/administrator/panelists/${p.id}`} component={PanelistsShow} />} />
      <Route path="/administrator/panelists/:id/edit" element={<ApiPage endpoint={(p) => `/administrator/panelists/${p.id}/edit`} component={PanelistsEdit} />} />

      <Route path="/administrator/applicants" element={<ApiPage endpoint="/administrator/applicants" component={ApplicantsIndex} />} />
      <Route path="/administrator/applicants/create" element={<ApiPage endpoint="/administrator/applicants/create" component={ApplicantsCreate} />} />
      <Route path="/administrator/applicants/edit/:id" element={<ApiPage endpoint={(p) => `/administrator/applicants/edit/${p.id}`} component={ApplicantsEdit} />} />
      <Route path="/administrator/applicants/status/:id" element={<ApiPage endpoint={(p) => `/administrator/applicants/status/${p.id}`} component={ApplicantsProgress} />} />

      <Route path="/administrator/interviews" element={<ApiPage endpoint="/administrator/interviews" component={InterviewsIndex} />} />
      <Route path="/administrator/interviews/create" element={<ApiPage endpoint="/administrator/interviews/create" component={InterviewsCreate} />} />
      <Route path="/administrator/interviews/edit/:id" element={<ApiPage endpoint={(p) => `/administrator/interviews/edit/${p.id}`} component={InterviewsEdit} />} />

      <Route path="/administrator/job-families" element={<ApiPage endpoint="/administrator/job-families" component={NomenclatureIndex} />} />
      <Route path="/administrator/departments/:id" element={<ApiPage endpoint={(p) => `/administrator/departments/${p.id}`} component={DepartmentsIndex} />} />
      <Route path="/administrator/ranks" element={<ApiPage endpoint="/administrator/ranks" component={RanksIndex} />} />
      <Route path="/administrator/questions" element={<ApiPage endpoint="/administrator/questions" component={QuestionsIndex} />} />
      <Route path="/administrator/questions/create" element={<ApiPage endpoint="/administrator/questions/create" component={QuestionsCreate} />} />

      <Route path="/administrator/posting-recommendations" element={<ApiPage endpoint="/administrator/posting-recommendations" component={PostingRecommendationsIndex} />} />
      <Route path="/administrator/posting-recommendations/create" element={<ApiPage endpoint="/administrator/posting-recommendations/create" component={PostingRecommendationsCreate} />} />
      <Route path="/administrator/posting-recommendations/edit/:id" element={<ApiPage endpoint={(p) => `/administrator/posting-recommendations/edit/${p.id}`} component={PostingRecommendationsEdit} />} />

      <Route path="/administrator/tbl-users" element={<ApiPage endpoint="/administrator/tbl-users" component={TblUsersIndex} />} />
      <Route path="/administrator/tbl-users/year/:year" element={<ApiPage endpoint={(p) => `/administrator/tbl-users/year/${p.year}`} component={TblUsersYear} />} />
      <Route path="/administrator/tbl-users/:id" element={<ApiPage endpoint={(p) => `/administrator/tbl-users/${p.id}`} component={TblUsersShow} />} />

      {/* Shared authorised */}
      <Route path="/authorised/create" element={<ApiPage endpoint="/authorised/create" component={ApplicantsCreate} />} />
      <Route path="/authorised/view/:id" element={<ApiPage endpoint={(p) => `/authorised/view/${p.id}`} component={ApplicantsView} />} />
      <Route path="/authorised/upload/:id/docs" element={<ApiPage endpoint={(p) => `/authorised/upload/${p.id}/docs`} component={ApplicantsUploads} />} />
      <Route path="/authorised/manage/:id" element={<ApiPage endpoint={(p) => `/authorised/manage/${p.id}`} component={InterviewsManage} />} />
      <Route path="/authorised/personnel-in-waiting" element={<ApiPage endpoint="/authorised/personnel-in-waiting" component={PersonnelIndex} />} />
      <Route path="/authorised/personnel-in-waiting/create" element={<ApiPage endpoint="/authorised/personnel-in-waiting/create" component={PersonnelCreate} />} />
      <Route path="/authorised/personnel-in-waiting/:id" element={<ApiPage endpoint={(p) => `/authorised/personnel-in-waiting/${p.id}`} component={PersonnelShow} />} />
      <Route path="/authorised/personnel-in-waiting/:id/edit" element={<ApiPage endpoint={(p) => `/authorised/personnel-in-waiting/${p.id}/edit`} component={PersonnelEdit} />} />

      {/* SDM */}
      <Route path="/sdm" element={<ApiPage endpoint="/sdm" component={SdmDashboard} />} />
      <Route path="/sdm/applicants" element={<ApiPage endpoint="/sdm/applicants" component={SdmApplicants} />} />
      <Route path="/sdm/applicants/create" element={<ApiPage endpoint="/sdm/applicants/create" component={ApplicantsCreate} />} />
      <Route path="/sdm/interviews" element={<ApiPage endpoint="/sdm/interviews" component={SdmInterviews} />} />

      {/* Director / Panelist */}
      <Route path="/director" element={<ApiPage endpoint="/director" component={DirectorDashboard} />} />
      <Route path="/panelist" element={<ApiPage endpoint="/panelist" component={PanelistDashboard} />} />
      <Route path="/panelist/interviews" element={<ApiPage endpoint="/panelist/interviews" component={PanelistInterviewsIndex} />} />
      <Route path="/panelist/recommendations" element={<ApiPage endpoint="/panelist/recommendations" component={PanelistRecommendationsIndex} />} />
      <Route path="/panelist/interview/:interviewId/manage" element={<ApiPage endpoint={(p) => `/panelist/interview/${p.interviewId}/manage`} component={PanelistInterviewManage} />} />

      <Route path="/403" element={<StaticShell><Error403 /></StaticShell>} />
      <Route path="/404" element={<StaticShell><Error404 /></StaticShell>} />
      <Route path="/500" element={<StaticShell><Error500 /></StaticShell>} />
      <Route path="*" element={<StaticShell><Error404 /></StaticShell>} />
    </Routes>
    </Suspense>
  );
}
