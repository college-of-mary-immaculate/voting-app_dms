import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  form = {
    student_id: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: '',
    year_level: 1,
    role: 'user'
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router, private apiService: ApiService) { }

  register() {
    // Basic validation
    if (!this.form.student_id || !this.form.firstname || !this.form.lastname ||
      !this.form.email || !this.form.password || !this.form.course) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.register(this.form).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = 'Email or Student ID already registered.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
