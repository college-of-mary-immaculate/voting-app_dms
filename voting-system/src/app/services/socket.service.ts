import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('/', {
      path: '/socket.io',
      transports: ['websocket']
    });
  }

  joinElection(election_id: number) {
    this.socket.emit('join_election', election_id);
  }

  leaveElection(election_id: number) {
    this.socket.emit('leave_election', election_id);
  }

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