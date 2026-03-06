import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface CandidateHistoryItem {
  fullname: string;
  position_name: string;
  election_title: string;
  votes: number;
}

@Component({
  selector: 'app-candidate-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-history.html',
  styleUrls: ['./candidate-history.css'] 
})
export class CandidateHistory {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/admin']);
  }

  //dummy data
  candidateHistory: CandidateHistoryItem[] = [
    { fullname: 'Juan Dela Cruz', position_name: 'President', election_title: '2026 Election', votes: 120 },
    { fullname: 'Maria Santos', position_name: 'Vice President', election_title: '2026 Election', votes: 95 }
  ];
}