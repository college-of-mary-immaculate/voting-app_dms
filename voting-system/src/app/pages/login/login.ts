import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email = '';
  password = '';
  role = 'user';

  constructor(private router: Router) {}

  login() {

    console.log("Login attempt:", this.email, this.password);

    if (this.role === 'admin') {
      this.router.navigate(['/admin']);
    } 
    else {
      this.router.navigate(['/dashboard']);
    }

  }
}