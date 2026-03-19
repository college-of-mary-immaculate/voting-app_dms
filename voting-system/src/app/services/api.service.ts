import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';
  private apiKey = 'your_api_key';

  constructor(private http: HttpClient) { }

  private getHeaders(includeToken = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey
    });

    if (includeToken) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  // ---- AUTH ----
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`,
      { email, password },
      { headers: this.getHeaders() }
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`,
      userData,
      { headers: this.getHeaders() }
    );
  }

  // ---- USERS ----
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`,
      { headers: this.getHeaders(true) }
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`,
      { headers: this.getHeaders(true) }
    );
  }

  // ---- ELECTIONS ----
  getElections(): Observable<any> {
    return this.http.get(`${this.baseUrl}/elections`,
      { headers: this.getHeaders(true) }
    );
  }

  getElectionById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/elections/${id}`,
      { headers: this.getHeaders(true) }
    );
  }

  createElection(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/elections`,
      data,
      { headers: this.getHeaders(true) }
    );
  }

  updateElectionStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/elections/${id}/status`,
      { election_status: status },
      { headers: this.getHeaders(true) }
    );
  }

  updateElection(id: number, data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/elections/${id}`,
    data,
    { headers: this.getHeaders(true) }
  );
}

deleteElection(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/elections/${id}`,
    { headers: this.getHeaders(true) }
  );
}

  // ---- CANDIDATES ----
  getCandidates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidates`,
      { headers: this.getHeaders(true) }
    );
  }

  getCandidatesByElection(electionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidates/election/${electionId}`,
      { headers: this.getHeaders(true) }
    );
  }

  addCandidate(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/candidates`,
      data,
      { headers: this.getHeaders(true) }
    );
  }

  updateCandidate(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/candidates/${id}`,
      data,
      { headers: this.getHeaders(true) }
    );
  }

  deleteCandidate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/candidates/${id}`,
      { headers: this.getHeaders(true) }
    );
  }

  // ---- VOTES ----
  castVote(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/votes`,
      data,
      { headers: this.getHeaders(true) }
    );
  }

  getResults(electionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/votes/results/${electionId}`,
      { headers: this.getHeaders(true) }
    );
  }

  checkVoteStatus(electionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/votes/check/${electionId}`,
      { headers: this.getHeaders(true) }
    );
  }
}
