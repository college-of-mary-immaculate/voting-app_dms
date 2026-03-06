import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Vote } from './pages/vote/vote';
import { Results } from './pages/results/results';
import { ManageCandidates } from './pages/manage-candidates/manage-candidates';
import { CandidateHistory } from './pages/candidate-history/candidate-history';

export const appRoutes: Routes = [
  { path: '', component: Login },
  { path: 'dashboard', component: UserDashboard },
  { path: 'admin', component: AdminDashboard },
  { path: 'vote', component: Vote },
  { path: 'results', component: Results },
  { path: 'manage-candidates', component: ManageCandidates },
  { path: 'candidate-history', component: CandidateHistory },
];