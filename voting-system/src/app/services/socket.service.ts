import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000', {
      transports: ['websocket']
    });
  }

  // Join a specific election room
  joinElection(election_id: number) {
    this.socket.emit('join_election', election_id);
  }

  // Leave election room
  leaveElection(election_id: number) {
    this.socket.emit('leave_election', election_id);
  }

  // Listen for live vote updates
  onVoteUpdate(): Observable<any[]> {
    return new Observable((observer) => {
      this.socket.on('vote_update', (results) => {
        observer.next(results);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
