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
  constructor(private router: Router) {}

  goToManageCandidates() {
    this.router.navigate(['/manage-candidates']);
  }

  goToCandidateHistory() {
    this.router.navigate(['/candidate-history']);
  }
}