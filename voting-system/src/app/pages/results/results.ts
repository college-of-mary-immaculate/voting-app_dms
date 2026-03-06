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
  votes: number;
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
export class Results {
  constructor(private router: Router) {}

  // Example data; you can replace with real vote counts from DB
  positions: Position[] = [
    {
      position_id: 1,
      position_name: "President",
      candidates: [
        { candidate_id: 1, election_id: 1, fullname: "Juan Dela Cruz", position_id: 1, photo: "juandelacruz.jpg", bio: "Senior student, 4th year", votes: 12 },
        { candidate_id: 2, election_id: 1, fullname: "Maria Santos", position_id: 1, photo: "mariasantos.jpg", bio: "Student council member", votes: 8 }
      ]
    },
    {
      position_id: 2,
      position_name: "Vice President",
      candidates: [
        { candidate_id: 3, election_id: 1, fullname: "Pedro Reyes", position_id: 2, photo: "pedroreyes.jpg", bio: "Active in community service", votes: 10 },
        { candidate_id: 4, election_id: 1, fullname: "Ana Lopez", position_id: 2, photo: "analopez.jpg", bio: "Excellent in academics", votes: 5 }
      ]
    }
  ];

  // Track user vote to highlight "Your vote"
  selectedVotes: { [position_id: number]: number } = {
    1: 1, // Example: user voted Juan Dela Cruz for President
    2: 3  // Example: user voted Pedro Reyes for VP
  };

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}