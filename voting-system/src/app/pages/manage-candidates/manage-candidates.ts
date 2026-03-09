import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface Candidate {
  candidate_id?: number;
  firstname: string;
  lastname: string;
  alias: string;
  position_id: number;
  position_name?: string;
  election_id: number;
  election_title?: string;
  photo: string;
  bio: string;
}

@Component({
  selector: 'app-manage-candidates',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manage-candidates.html',
  styleUrls: ['./manage-candidates.css']
})
export class ManageCandidates implements OnInit {
  candidates: Candidate[] = [];
  positions: any[] = [];
  elections: any[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  // Modal
  showModal = false;
  isEditing = false;
  currentCandidate: Candidate = this.emptyCandidate();

  // Delete confirmation
  showDeleteModal = false;
  candidateToDelete: Candidate | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadCandidates(); // ← this now handles positions too
    this.loadElections();
  }

  emptyCandidate(): Candidate {
    return {
      firstname: '',
      lastname: '',
      alias: '',
      position_id: 0,
      election_id: 0,
      photo: '',
      bio: ''
    };
  }

  loadCandidates() {
    this.isLoading = true;
    this.apiService.getCandidates().subscribe({
      next: (data) => {
        console.log('candidates data:', data);
        this.candidates = data;

        const seen = new Set();
        this.positions = data
          .filter((c: any) => {
            if (seen.has(c.position_id)) return false;
            seen.add(c.position_id);
            return true;
          })
          .map((c: any) => ({ position_id: c.position_id, position_name: c.position_name }));

        this.isLoading = false; 
        this.cdr.detectChanges();

      },
      error: () => {
        this.errorMessage = 'Failed to load candidates.';
        this.isLoading = false;
      }
    });
  }

  loadElections() {
    this.apiService.getElections().subscribe({
      next: (data) => { this.elections = data; }
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.currentCandidate = this.emptyCandidate();
    this.showModal = true;
  }

  openEditModal(candidate: Candidate) {
    this.isEditing = true;
    this.currentCandidate = { ...candidate };
    this.showModal = true;
  }

  saveCandidate() {
    if (this.isEditing && this.currentCandidate.candidate_id) {
      this.apiService.updateCandidate(this.currentCandidate.candidate_id, this.currentCandidate).subscribe({
        next: () => {
          this.successMessage = 'Candidate updated!';
          this.showModal = false;
          this.loadCandidates();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => { this.errorMessage = 'Failed to update candidate.'; }
      });
    } else {
      this.apiService.addCandidate(this.currentCandidate).subscribe({
        next: () => {
          this.successMessage = 'Candidate added!';
          this.showModal = false;
          this.loadCandidates();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => { this.errorMessage = 'Failed to add candidate.'; }
      });
    }
  }

  confirmDelete(candidate: Candidate) {
    this.candidateToDelete = candidate;
    this.showDeleteModal = true;
  }

  deleteCandidate() {
    if (!this.candidateToDelete?.candidate_id) return;
    this.apiService.deleteCandidate(this.candidateToDelete.candidate_id).subscribe({
      next: () => {
        this.successMessage = 'Candidate deleted!';
        this.showDeleteModal = false;
        this.candidateToDelete = null;
        this.loadCandidates();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => { this.errorMessage = 'Failed to delete candidate.'; }
    });
  }

  closeModal() {
    this.showModal = false;
    this.currentCandidate = this.emptyCandidate();
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
