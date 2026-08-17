import { lazy } from 'react';

export const Dashboard = lazy(() => import('./Pages/Dashboard'));
export const ActivityLog = lazy(() => import('./Pages/ActivityLog'));
export const Administration = lazy(() => import('./Pages/Admin/Administration'));
export const Stakeholders = lazy(() => import('./Pages/Admin/Stakeholders'));
export const SettingsIndex = lazy(() => import('./Pages/Admin/Settings/Index'));
export const SettingsWebsite = lazy(() => import('./Pages/Admin/Settings/Website'));
export const RolesIndex = lazy(() => import('./Pages/Admin/Roles/Index'));
export const AdminsIndex = lazy(() => import('./Pages/Admin/Admins/Index'));
export const AdminsShow = lazy(() => import('./Pages/Admin/Admins/Show'));
export const AdminsEdit = lazy(() => import('./Pages/Admin/Admins/Edit'));
export const DirectorsIndex = lazy(() => import('./Pages/Admin/Directors/Index'));
export const DirectorsCreate = lazy(() => import('./Pages/Admin/Directors/Create'));
export const DirectorsShow = lazy(() => import('./Pages/Admin/Directors/Show'));
export const DirectorsEdit = lazy(() => import('./Pages/Admin/Directors/Edit'));
export const SdmsIndex = lazy(() => import('./Pages/Admin/Sdms/Index'));
export const SdmsShow = lazy(() => import('./Pages/Admin/Sdms/Show'));
export const SdmsEdit = lazy(() => import('./Pages/Admin/Sdms/Edit'));
export const PanelistsIndex = lazy(() => import('./Pages/Admin/Panelists/Index'));
export const PanelistsShow = lazy(() => import('./Pages/Admin/Panelists/Show'));
export const PanelistsEdit = lazy(() => import('./Pages/Admin/Panelists/Edit'));
export const PostingRecommendationsIndex = lazy(() => import('./Pages/Admin/PostingRecommendations/Index'));
export const PostingRecommendationsCreate = lazy(() => import('./Pages/Admin/PostingRecommendations/Create'));
export const PostingRecommendationsEdit = lazy(() => import('./Pages/Admin/PostingRecommendations/Edit'));

export const ApplicantsList = lazy(() => import('./Pages/Applicants/List'));
export const ApplicantsRedirect = lazy(() => import('./Pages/Applicants/Redirect'));
export const ApplicantsCreate = lazy(() => import('./Pages/Applicants/Create'));
export const ApplicantsEdit = lazy(() => import('./Pages/Applicants/Edit'));
export const ApplicantsView = lazy(() => import('./Pages/Applicants/View'));
export const ApplicantsUploads = lazy(() => import('./Pages/Applicants/Uploads'));
export const ApplicantsProgress = lazy(() => import('./Pages/Applicants/Progress'));
export const BiodataForm = lazy(() => import('./Pages/Applicant/BiodataForm'));
export const ApplicantDashboard = lazy(() => import('./Pages/Applicant/Dashboard'));
export const ApplicantDocuments = lazy(() => import('./Pages/Applicant/Documents'));
export const ApplicantIdCard = lazy(() => import('./Pages/Applicant/IdCard'));
export const ApplicantInterview = lazy(() => import('./Pages/Applicant/Interview'));

export const InterviewsIndex = lazy(() => import('./Pages/Interviews/Index'));
export const InterviewsCreate = lazy(() => import('./Pages/Interviews/Create'));
export const InterviewsEdit = lazy(() => import('./Pages/Interviews/Edit'));
export const InterviewsManage = lazy(() => import('./Pages/Interviews/Manage'));

export const NomenclatureIndex = lazy(() => import('./Pages/Nomenclature/Index'));
export const DepartmentsIndex = lazy(() => import('./Pages/Departments/Index'));
export const RanksIndex = lazy(() => import('./Pages/Ranks/Index'));
export const QuestionsIndex = lazy(() => import('./Pages/Questions/Index'));
export const QuestionsCreate = lazy(() => import('./Pages/Questions/Create'));
export const AnalyticsIndex = lazy(() => import('./Pages/Analytics/Index'));
export const TblUsersIndex = lazy(() => import('./Pages/TblUsers/Index'));
export const TblUsersYear = lazy(() => import('./Pages/TblUsers/Year'));
export const TblUsersShow = lazy(() => import('./Pages/TblUsers/Show'));

export const SdmDashboard = lazy(() => import('./Pages/Sdm/Dashboard'));
export const SdmApplicants = lazy(() => import('./Pages/Sdm/Applicants'));
export const SdmInterviews = lazy(() => import('./Pages/Sdm/Interviews'));

export const DirectorDashboard = lazy(() => import('./Pages/Director/Dashboard'));
export const PanelistDashboard = lazy(() => import('./Pages/Panelist/Dashboard'));
export const PanelistInterviewsIndex = lazy(() => import('./Pages/Panelist/InterviewsIndex'));
export const PanelistRecommendationsIndex = lazy(() => import('./Pages/Panelist/RecommendationsIndex'));
export const PanelistInterviewManage = lazy(() => import('./Pages/Panelist/InterviewManage'));

export const PersonnelIndex = lazy(() => import('./Pages/PersonnelInWaiting/Index'));
export const PersonnelCreate = lazy(() => import('./Pages/PersonnelInWaiting/Create'));
export const PersonnelShow = lazy(() => import('./Pages/PersonnelInWaiting/Show'));
export const PersonnelEdit = lazy(() => import('./Pages/PersonnelInWaiting/Edit'));
