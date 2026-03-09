import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      this.router.navigate(['/']);
      return false;
    }

    const parsed = JSON.parse(user);
    if (parsed.role !== 'admin') {
      this.router.navigate(['/dashboard']); 
      return false;
    }

    return true;
  }
}
