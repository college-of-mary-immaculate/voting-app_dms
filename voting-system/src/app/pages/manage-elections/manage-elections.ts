import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface Election {
  election_id: number;
  election_title: string;
  election_description: string;
  election_status: string;
  start_time: string;
  end_time: string;
}

@Component({
  selector: 'app-manage-elections',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-elections.html',
  styleUrls: ['./manage-elections.css']
})
export class ManageElections implements OnInit {
  elections: Election[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  selectedElection: Election | null = null;

  form = {
    election_title: '',
    election_description: '',
    start_time: '',
    end_time: ''
  };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.loadElections();
  }

  loadElections() {
    this.isLoading = true;
    this.apiService.getElections().subscribe({
      next: (data: Election[]) => {
        this.elections = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load elections.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.form = { election_title: '', election_description: '', start_time: '', end_time: '' };
    this.showModal = true;
  }

  openEditModal(election: Election) {
    this.isEditing = true;
    this.selectedElection = election;
    this.form = {
      election_title: election.election_title,
      election_description: election.election_description,
      start_time: this.toDatetimeLocal(election.start_time),
      end_time: this.toDatetimeLocal(election.end_time)
    };
    this.showModal = true;
  }

  openDeleteModal(election: Election) {
    this.selectedElection = election;
    this.showDeleteModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.showDeleteModal = false;
    this.selectedElection = null;
  }

  saveElection() {
    if (!this.form.election_title || !this.form.start_time || !this.form.end_time) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.isEditing && this.selectedElection) {
      this.apiService.updateElection(this.selectedElection.election_id, this.form).subscribe({
        next: () => {
          this.successMessage = 'Election updated!';
          this.closeModal();
          this.loadElections();
        },
        error: () => { this.errorMessage = 'Failed to update election.'; }
      });
    } else {
      this.apiService.createElection(this.form).subscribe({
        next: () => {
          this.successMessage = 'Election created!';
          this.closeModal();
          this.loadElections();
        },
        error: () => { this.errorMessage = 'Failed to create election.'; }
      });
    }
  }

  confirmDelete() {
    if (!this.selectedElection) return;
    this.apiService.deleteElection(this.selectedElection.election_id).subscribe({
      next: () => {
        this.successMessage = 'Election deleted.';
        this.closeModal();
        this.loadElections();
      },
      error: () => { this.errorMessage = 'Failed to delete election.'; }
    });
  }

  changeStatus(election: Election, status: string) {
    this.apiService.updateElectionStatus(election.election_id, status).subscribe({
      next: () => {
        this.successMessage = `Status changed to "${status}"`;
        this.loadElections();
      },
      error: () => { this.errorMessage = 'Failed to update status.'; }
    });
  }

  toDatetimeLocal(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}