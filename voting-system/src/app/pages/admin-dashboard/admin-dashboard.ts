import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {
  user: any = null;

  constructor(private router: Router) {
    const stored = localStorage.getItem('user');
    if (stored) this.user = JSON.parse(stored);
  }

  goToManageCandidates() { this.router.navigate(['/manage-candidates']); }
  goToCandidateHistory() { this.router.navigate(['/candidate-history']); }
  goToManageElections() { this.router.navigate(['/manage-elections']); }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}