import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vote.html',
  styleUrls: ['./vote.css']
})

export class Vote implements OnInit {
  positions: Position[] = [];
  selectedVotes: { [position_id: number]: number } = {};
  activeElectionId: number | null = null;
  isLoading = true;
  errorMessage = '';
  isSubmitting = false;

  showConfirmModal = false;
  showVotedModal = false;
  currentCandidate: Candidate | null = null;
  currentPosition: Position | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
      return;
    }

    this.loadElectionAndCandidates();
  }

  loadElectionAndCandidates() {
    this.apiService.getElections().subscribe({
      next: (elections: any[]) => {
        const active = elections.find(e => e.election_status === 'active');
        if (!active) {
          this.errorMessage = 'No active election at the moment.';
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        this.activeElectionId = active.election_id;

        // Load candidates and already voted positions in parallel
        this.apiService.getCandidatesByElection(active.election_id).subscribe({
          next: (candidates: any[]) => {
            const grouped: { [key: number]: Position } = {};
            candidates.forEach(c => {
              if (!grouped[c.position_id]) {
                grouped[c.position_id] = {
                  position_id: c.position_id,
                  position_name: c.position_name,
                  candidates: []
                };
              }
              grouped[c.position_id].candidates.push(c);
            });
            this.positions = Object.values(grouped);
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.errorMessage = 'Failed to load candidates.';
            this.isLoading = false;
          }
        });

        // Check which positions user already voted for
        this.apiService.checkVoteStatus(active.election_id).subscribe({
          next: (res) => {
            res.votedPositions.forEach((pos_id: number) => {
              this.selectedVotes[pos_id] = -1; // -1 means already voted
            });
          }
        });
      },
      error: () => {
        this.errorMessage = 'Failed to load elections.';
        this.isLoading = false;
      }
    });
  }

  hasVoted(position_id: number): boolean {
    return !!this.selectedVotes[position_id];
  }

  openVoteModal(position: Position, candidate: Candidate) {
    if (!this.hasVoted(position.position_id)) {
      this.currentCandidate = candidate;
      this.currentPosition = position;
      this.showConfirmModal = true;
    }
  }

  confirmVote() {
    if (!this.currentPosition || !this.currentCandidate || !this.activeElectionId) return;

    this.isSubmitting = true;

    this.apiService.castVote({
      candidate_id: this.currentCandidate.candidate_id,
      position_id: this.currentPosition.position_id,
      election_id: this.activeElectionId
    }).subscribe({
      next: () => {
        this.selectedVotes[this.currentPosition!.position_id] = this.currentCandidate!.candidate_id;
        this.showConfirmModal = false;
        this.showVotedModal = true;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.showConfirmModal = false;
        if (err.status === 409) {
          this.errorMessage = 'You already voted for this position.';
        } else {
          this.errorMessage = 'Failed to cast vote. Please try again.';
        }
      }
    });
  }

  cancelVote() {
    this.showConfirmModal = false;
    this.currentCandidate = null;
    this.currentPosition = null;
  }

  closeVotedModal() {
    this.showVotedModal = false;
    this.currentCandidate = null;
    this.currentPosition = null;
  }

  goToResults() {
    this.router.navigate(['/results']);
  }
}
