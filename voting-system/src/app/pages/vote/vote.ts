import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface Candidate {
  candidate_id: number;
  election_id: number;
  fullname: string;
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
export class Vote {
  constructor(private router: Router) {}

  positions: Position[] = [
    {
      position_id: 1,
      position_name: "President",
      candidates: [
        { candidate_id: 1, election_id: 1, fullname: "Juan Dela Cruz", position_id: 1, photo: "juandelacruz.jpg", bio: "Senior student, 4th year" },
        { candidate_id: 2, election_id: 1, fullname: "Maria Santos", position_id: 1, photo: "mariasantos.jpg", bio: "Student council member" }
      ]
    },
    {
      position_id: 2,
      position_name: "Vice President",
      candidates: [
        { candidate_id: 3, election_id: 1, fullname: "Pedro Reyes", position_id: 2, photo: "pedroreyes.jpg", bio: "Active in community service" },
        { candidate_id: 4, election_id: 1, fullname: "Ana Lopez", position_id: 2, photo: "analopez.jpg", bio: "Excellent in academics" }
      ]
    }
  ];

  selectedVotes: { [position_id: number]: number } = {};

  //modal
  showConfirmModal = false;
  showVotedModal = false;
  currentCandidate: Candidate | null = null;
  currentPosition: Position | null = null;

  openVoteModal(position: Position, candidate: Candidate) {
    if (!this.selectedVotes[position.position_id]) {
      this.currentCandidate = candidate;
      this.currentPosition = position;
      this.showConfirmModal = true;
    }
  }

  confirmVote() {
    if (this.currentPosition && this.currentCandidate) {
      this.selectedVotes[this.currentPosition.position_id] = this.currentCandidate.candidate_id;
      this.showConfirmModal = false;
      this.showVotedModal = true;
    }
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