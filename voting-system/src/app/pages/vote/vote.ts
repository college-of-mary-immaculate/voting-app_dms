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
  ballot_number: number;
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
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/']);
      return;
    }

    this.loadElectionAndCandidates();
  }

  // =========================
  // LOCAL STORAGE
  // =========================
  saveVotesToLocal() {
    localStorage.setItem('votes', JSON.stringify(this.selectedVotes));
  }

  loadVotesFromLocal() {
    const saved = localStorage.getItem('votes');
    if (saved) {
      this.selectedVotes = JSON.parse(saved);
    }
  }

  // =========================
  // LOAD DATA
  // =========================
  loadElectionAndCandidates() {
    this.apiService.getElections().subscribe({
      next: (elections: any[]) => {
        const active = elections.find(e => e.election_status === 'active');
        if (!active) {
          this.errorMessage = 'No active election.';
          this.isLoading = false;
          return;
        }

        this.activeElectionId = active.election_id;

        // Load candidates
        this.loadCandidates(active.election_id);

        // Load votes for this user
        this.loadVoteStatus(active.election_id);
      },
      error: () => {
        this.errorMessage = 'Failed to load elections.';
        this.isLoading = false;
      }
    });
  }

  loadCandidates(electionId: number) {
    this.apiService.getCandidatesByElection(electionId).subscribe({
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
  }

  loadVoteStatus(electionId: number) {
    this.apiService.checkVoteStatus(electionId).subscribe({
      next: (res: any) => {
        res.votedPositions?.forEach((pos_id: number) => {
          this.selectedVotes[pos_id] = -1;
        });
        this.saveVotesToLocal();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load vote status.';
      }
    });
  }

  hasVoted(position_id: number): boolean {
    return this.selectedVotes[position_id] !== undefined;
  }

  get allVoted(): boolean {
    return this.positions.length > 0 &&
      this.positions.every(p => this.hasVoted(p.position_id));
  }
  
  // =========================
  // VOTING
  // =========================
  openVoteModal(position: Position, candidate: Candidate) {
    if (this.hasVoted(position.position_id)) return;

    this.currentCandidate = candidate;
    this.currentPosition = position;
    this.showConfirmModal = true;
  }

  confirmVote() {
    if (!this.currentCandidate || !this.currentPosition || !this.activeElectionId) return;
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const positionId = this.currentPosition.position_id;
    const candidateId = this.currentCandidate.candidate_id;

    // Instant UI update
    this.selectedVotes[positionId] = candidateId;
    this.saveVotesToLocal();

    this.showConfirmModal = false;
    this.showVotedModal = true;

    // Send vote to server per user
    this.apiService.castVote({
      candidate_id: candidateId,
      position_id: positionId,
      election_id: this.activeElectionId
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
      },
      error: () => {
        delete this.selectedVotes[positionId];
        this.saveVotesToLocal();
        this.showVotedModal = false;
        this.isSubmitting = false;
        this.errorMessage = 'Vote failed.';
      }
    });
  }

  cancelVote() {
    this.showConfirmModal = false;
  }

  closeVotedModal() {
    this.showVotedModal = false;
  }

  goToResults() {
    this.router.navigate(['/results']);
  }
}