import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import ApiPage from './lib/ApiPage';
import { PageProvider } from './lib/inertia';

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

import Dashboard from './Pages/Dashboard';
import Administration from './Pages/Admin/Administration';
import Stakeholders from './Pages/Admin/Stakeholders';
import SettingsIndex from './Pages/Admin/Settings/Index';
import RolesIndex from './Pages/Admin/Roles/Index';
import AdminsIndex from './Pages/Admin/Admins/Index';
import AdminsShow from './Pages/Admin/Admins/Show';
import AdminsEdit from './Pages/Admin/Admins/Edit';
import DirectorsIndex from './Pages/Admin/Directors/Index';
import DirectorsCreate from './Pages/Admin/Directors/Create';
import DirectorsShow from './Pages/Admin/Directors/Show';
import DirectorsEdit from './Pages/Admin/Directors/Edit';
import SdmsIndex from './Pages/Admin/Sdms/Index';
import SdmsShow from './Pages/Admin/Sdms/Show';
import SdmsEdit from './Pages/Admin/Sdms/Edit';
import PanelistsIndex from './Pages/Admin/Panelists/Index';
import PanelistsShow from './Pages/Admin/Panelists/Show';
import PanelistsEdit from './Pages/Admin/Panelists/Edit';
import PostingRecommendationsIndex from './Pages/Admin/PostingRecommendations/Index';
import PostingRecommendationsCreate from './Pages/Admin/PostingRecommendations/Create';
import PostingRecommendationsEdit from './Pages/Admin/PostingRecommendations/Edit';

import ApplicantsIndex from './Pages/Applicants/Index';
import ApplicantsCreate from './Pages/Applicants/Create';
import ApplicantsEdit from './Pages/Applicants/Edit';
import ApplicantsView from './Pages/Applicants/View';
import ApplicantsUploads from './Pages/Applicants/Uploads';
import ApplicantsProgress from './Pages/Applicants/Progress';
import BiodataForm from './Pages/Applicant/BiodataForm';

import InterviewsIndex from './Pages/Interviews/Index';
import InterviewsCreate from './Pages/Interviews/Create';
import InterviewsEdit from './Pages/Interviews/Edit';
import InterviewsManage from './Pages/Interviews/Manage';

import NomenclatureIndex from './Pages/Nomenclature/Index';
import DepartmentsIndex from './Pages/Departments/Index';
import RanksIndex from './Pages/Ranks/Index';
import QuestionsIndex from './Pages/Questions/Index';
import QuestionsCreate from './Pages/Questions/Create';
import AnalyticsIndex from './Pages/Analytics/Index';
import TblUsersIndex from './Pages/TblUsers/Index';
import TblUsersYear from './Pages/TblUsers/Year';
import TblUsersShow from './Pages/TblUsers/Show';

import SdmDashboard from './Pages/Sdm/Dashboard';
import SdmApplicants from './Pages/Sdm/Applicants';
import SdmInterviews from './Pages/Sdm/Interviews';

import DirectorDashboard from './Pages/Director/Dashboard';
import PanelistDashboard from './Pages/Panelist/Dashboard';
import PanelistInterviewsIndex from './Pages/Panelist/InterviewsIndex';
import PanelistRecommendationsIndex from './Pages/Panelist/RecommendationsIndex';
import PanelistInterviewManage from './Pages/Panelist/InterviewManage';

import PersonnelIndex from './Pages/PersonnelInWaiting/Index';
import PersonnelCreate from './Pages/PersonnelInWaiting/Create';
import PersonnelShow from './Pages/PersonnelInWaiting/Show';
import PersonnelEdit from './Pages/PersonnelInWaiting/Edit';

function LoginRoute() {
  const { role } = useParams();
  return (
    <PageProvider value={{ appName: import.meta.env.VITE_APP_NAME || 'MSNC Recruitment' }}>
      <Login role={role} />
    </PageProvider>
  );
}

export default function App() {
  return (
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
      <Route path="/login/:role" element={<LoginRoute />} />
      <Route path="/auth/error" element={<AuthError />} />

      {/* Applicant */}
      <Route path="/applicant" element={<ApiPage endpoint="/applicant" component={BiodataForm} />} />

      {/* Admin */}
      <Route path="/administrator" element={<ApiPage endpoint="/administrator" component={Dashboard} />} />
      <Route path="/administrator/analytics" element={<ApiPage endpoint="/administrator/analytics" component={AnalyticsIndex} />} />
      <Route path="/administrator/menu" element={<ApiPage endpoint="/administrator/menu" component={Administration} />} />
      <Route path="/administrator/stakeholders" element={<ApiPage endpoint="/administrator/stakeholders" component={Stakeholders} />} />
      <Route path="/administrator/settings" element={<ApiPage endpoint="/administrator/settings" component={SettingsIndex} />} />
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
      <Route path="/authorised/view/:id" element={<ApiPage endpoint={(p) => `/authorised/view/${p.id}`} component={ApplicantsView} />} />
      <Route path="/authorised/upload/:id/docs" element={<ApiPage endpoint={(p) => `/authorised/upload/${p.id}/docs`} component={ApplicantsUploads} />} />
      <Route path="/authorised/manage/:id" element={<ApiPage endpoint={(p) => `/authorised/manage/${p.id}`} component={InterviewsManage} />} />
      <Route path="/authorised/personnel-in-waiting" element={<ApiPage endpoint="/authorised/personnel-in-waiting" component={PersonnelIndex} />} />
      <Route path="/authorised/personnel-in-waiting/create" element={<ApiPage endpoint="/authorised/personnel-in-waiting/create" component={PersonnelCreate} />} />
      <Route path="/authorised/personnel-in-waiting/:id" element={<ApiPage endpoint={(p) => `/authorised/personnel-in-waiting/${p.id}`} component={PersonnelShow} />} />
      <Route path="/authorised/personnel-in-waiting/:id/edit" element={<ApiPage endpoint={(p) => `/authorised/personnel-in-waiting/${p.id}/edit`} component={PersonnelEdit} />} />

      {/* SDM */}
      <Route path="/sdm" element={<ApiPage endpoint="/sdm" component={SdmDashboard} />} />
      <Route path="/sdm/analytics" element={<ApiPage endpoint="/sdm/analytics" component={AnalyticsIndex} />} />
      <Route path="/sdm/applicants" element={<ApiPage endpoint="/sdm/applicants" component={SdmApplicants} />} />
      <Route path="/sdm/interviews" element={<ApiPage endpoint="/sdm/interviews" component={SdmInterviews} />} />

      {/* Director / Panelist */}
      <Route path="/director" element={<ApiPage endpoint="/director" component={DirectorDashboard} />} />
      <Route path="/panelist" element={<ApiPage endpoint="/panelist" component={PanelistDashboard} />} />
      <Route path="/panelist/interviews" element={<ApiPage endpoint="/panelist/interviews" component={PanelistInterviewsIndex} />} />
      <Route path="/panelist/recommendations" element={<ApiPage endpoint="/panelist/recommendations" component={PanelistRecommendationsIndex} />} />
      <Route path="/panelist/interview/:interviewId/manage" element={<ApiPage endpoint={(p) => `/panelist/interview/${p.interviewId}/manage`} component={PanelistInterviewManage} />} />

      <Route path="/403" element={<Error403 />} />
      <Route path="/500" element={<Error500 />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}
