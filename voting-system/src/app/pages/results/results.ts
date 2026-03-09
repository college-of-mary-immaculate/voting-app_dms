import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';

interface Candidate {
  candidate_id: number;
  election_id: number;
  firstname: string;
  lastname: string;
  alias: string;
  position_id: number;
  photo: string;
  bio: string;
  vote_count: number;
}

interface Position {
  position_id: number;
  position_name: string;
  candidates: Candidate[];
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './results.html',
  styleUrls: ['./results.css']
})
export class Results implements OnInit, OnDestroy {
  electionId: number | null = null;
  positions: Position[] = [];
  selectedVotes: { [position_id: number]: number } = {};
  isLoading = true;
  errorMessage = '';
  private voteSub!: Subscription;

  constructor(
    private router: Router,
    private socketService: SocketService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // Get user's voted positions from localStorage if available
    const stored = localStorage.getItem('user');
    if (!stored) {
      this.router.navigate(['/']);
      return;
    }

    // Find active election first
    this.apiService.getElections().subscribe({
      next: (elections: any[]) => {
        const active = elections.find(e => e.election_status === 'active');
        if (!active) {
          this.errorMessage = 'No active election found.';
          this.isLoading = false;
          return;
        }

        this.electionId = active.election_id;

        // Load initial results from API
        this.loadResults(active.election_id);

        // Load user's voted positions
        this.apiService.checkVoteStatus(active.election_id).subscribe({
          next: (res) => {
            res.votedPositions.forEach((pos_id: number) => {
              this.selectedVotes[pos_id] = -1;
            });
          }
        });

        // Join socket room for live updates
        this.socketService.joinElection(active.election_id);

        // Listen for live vote updates
        this.voteSub = this.socketService.onVoteUpdate().subscribe((results: any[]) => {
          this.groupResults(results, active.election_id);
        });
      },
      error: () => {
        this.errorMessage = 'Failed to load election.';
        this.isLoading = false;
      }
    });
  }

  loadResults(electionId: number) {
    this.apiService.getResults(electionId).subscribe({
      next: (results: any[]) => {
        this.groupResults(results, electionId);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load results.';
        this.isLoading = false;
      }
    });
  }

  groupResults(results: any[], electionId: number) {
    const grouped: { [key: number]: Position } = {};
    results.forEach(r => {
      if (!grouped[r.position_id]) {
        grouped[r.position_id] = {
          position_id: r.position_id,
          position_name: r.position_name,
          candidates: []
        };
      }
      grouped[r.position_id].candidates.push({
        candidate_id: r.candidate_id,
        election_id: electionId,
        firstname: r.firstname,
        lastname: r.lastname,
        alias: r.alias || '',
        position_id: r.position_id,
        photo: r.photo || '',
        bio: r.bio || '',
        vote_count: r.vote_count
      });
    });
    this.positions = Object.values(grouped);
  }

  ngOnDestroy() {
    if (this.electionId) this.socketService.leaveElection(this.electionId);
    if (this.voteSub) this.voteSub.unsubscribe();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
