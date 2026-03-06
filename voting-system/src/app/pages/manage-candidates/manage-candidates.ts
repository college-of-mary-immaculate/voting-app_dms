import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Candidate {
  fullname: string;
  position_name: string;
  election_title: string;
  photo: string;
  bio: string;
}

@Component({
  selector: 'app-manage-candidates',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-candidates.html',
  styleUrls: ['./manage-candidates.css']
})

export class ManageCandidates {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/admin']);
  }

  //dummy data
  candidates: Candidate[] = [
    { fullname: 'Juan Dela Cruz', position_name: 'President', election_title: '2026 Election', photo: 'juandelacruz.jpg', bio: '4th year student' },
    { fullname: 'Maria Santos', position_name: 'Vice President', election_title: '2026 Election', photo: 'mariasantos.jpg', bio: 'Student council member' }
  ];
}