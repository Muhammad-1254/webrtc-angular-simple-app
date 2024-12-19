import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable } from 'rxjs';

// const serverDomain = "https://webrtc-simple-server.vercel.app"
const serverDomain = 'http://localhost:3000'
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    this.socket = io(serverDomain ,{
      transports:["polling"]
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
  public on(eventName: string) {
    return new Observable((observer) => {
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
