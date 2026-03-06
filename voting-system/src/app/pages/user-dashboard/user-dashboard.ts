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
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboard {
  
  constructor(private router: Router) {}

  //(for display only)
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

  //this is display only
  selectedVotes: { [position_id: number]: number } = {};

  //go to voting page
  goToVote() {
    this.router.navigate(['/vote']);
  }

  //go to results page
  goToResults() {
    this.router.navigate(['/results']);
  }
}