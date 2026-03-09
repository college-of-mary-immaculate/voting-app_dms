import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface CandidateHistoryItem {
  candidate_id: number;
  firstname: string;
  lastname: string;
  alias: string;
  position_name: string;
  election_title: string;
  election_status: string;
  vote_count: number;
}

@Component({
  selector: 'app-candidate-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-history.html',
  styleUrls: ['./candidate-history.css']
})
export class CandidateHistory implements OnInit {
  candidateHistory: CandidateHistoryItem[] = [];
  isLoading = true;
  errorMessage = '';
  selectedElectionId: number | null = null;
  elections: any[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.apiService.getElections().subscribe({
      next: (elections: any[]) => {
        this.elections = elections;

        const active = elections.find(e => e.election_status === 'active');
        const target = active || elections[0];

        if (target) {
          this.selectedElectionId = target.election_id;
          this.loadHistory(target.election_id);
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

  loadHistory(electionId: number) {
    this.isLoading = true;
    this.selectedElectionId = electionId;

    this.apiService.getResults(electionId).subscribe({
      next: (results: any[]) => {
        const election = this.elections.find(e => e.election_id == electionId);

        this.candidateHistory = results.map(r => ({
          candidate_id: r.candidate_id,
          firstname: r.firstname,
          lastname: r.lastname,
          alias: r.alias || '',
          position_name: r.position_name,
          election_title: election?.election_title || '',
          election_status: election?.election_status || '',
          vote_count: r.vote_count
        }));

        this.candidateHistory.sort((a, b) =>
          a.position_name.localeCompare(b.position_name) ||
          b.vote_count - a.vote_count
        );

        this.isLoading = false;
        this.cdr.detectChanges();

      },
      error: () => {
        this.errorMessage = 'Failed to load candidate history.';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
