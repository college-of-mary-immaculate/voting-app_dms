import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface Candidate {
  candidate_id: number;
  election_id: number;
  firstname: string;
  lastname: string;
  alias: string;
  position_id: number;
  photo: string;
  bio: string;
}

interface Position {
  position_id: number;
  position_name: string;
  candidates: Candidate[];
}

interface Election {
  election_id: number;
  election_title: string;
  election_description: string;
  election_status: string;
  start_time: string;
  end_time: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboard implements OnInit {
  user: any = null;
  activeElection: Election | null = null;
  positions: Position[] = [];
  hasVotedPositions: number[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.user = JSON.parse(stored);
    } else {
      this.router.navigate(['/']);
      return;
    }

    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;

    this.apiService.getElections().subscribe({
      next: (elections: Election[]) => {
        this.activeElection = elections.find(e => e.election_status === 'active') || null;

        if (this.activeElection) {
          this.loadCandidates(this.activeElection.election_id);
          this.checkVoteStatus(this.activeElection.election_id);
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load elections.';
        this.isLoading = false;
      }
    });
  }

  loadCandidates(electionId: number) {
    this.apiService.getCandidatesByElection(electionId).subscribe({
      next: (candidates: Candidate[]) => {
        const grouped: { [key: number]: Position } = {};

        candidates.forEach(c => {
          if (!grouped[c.position_id]) {
            grouped[c.position_id] = {
              position_id: c.position_id,
              position_name: (c as any).position_name,
              candidates: []
            };
          }
          grouped[c.position_id].candidates.push(c);
        });

        this.positions = Object.values(grouped);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load candidates.';
        this.isLoading = false;
      }
    });
  }

  checkVoteStatus(electionId: number) {
    this.apiService.checkVoteStatus(electionId).subscribe({
      next: (res) => {
        this.hasVotedPositions = res.votedPositions;
      }
    });
  }

  hasVotedFor(position_id: number): boolean {
    return this.hasVotedPositions.includes(position_id);
  }

  goToVote() {
    this.router.navigate(['/vote']);
  }

  goToResults() {
    this.router.navigate(['/results']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
