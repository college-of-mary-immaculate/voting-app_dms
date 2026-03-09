import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Vote } from './pages/vote/vote';
import { Results } from './pages/results/results';
import { ManageCandidates } from './pages/manage-candidates/manage-candidates';
import { CandidateHistory } from './pages/candidate-history/candidate-history';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const appRoutes: Routes = [
  { path: '', component: Login },

  // User routes — must be logged in
  { path: 'dashboard', component: UserDashboard, canActivate: [AuthGuard] },
  { path: 'vote', component: Vote, canActivate: [AuthGuard] },
  { path: 'results', component: Results, canActivate: [AuthGuard] },

  // Admin routes — must be logged in AND be admin
  { path: 'admin', component: AdminDashboard, canActivate: [AdminGuard] },
  { path: 'manage-candidates', component: ManageCandidates, canActivate: [AdminGuard] },
  { path: 'candidate-history', component: CandidateHistory, canActivate: [AdminGuard] },
];
