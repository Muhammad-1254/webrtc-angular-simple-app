import { UserService } from './../../services/user.service';
import { Component, computed, inject, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { User } from '../../shared/interfaces';
import { CallService } from '../../services/call.service';
import { SocketService } from '../../services/socket.service';


// const users = [
//   {
//     id:'0',
//     username:"muhammad",
//   },
//   {
//     id:'1',
//     username:"usman",
//   },
//   {
//     id:'3',
//     username:"soomro",
//   },

// ]

@Component({
  selector: 'app-users',
  imports: [MatIconModule],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  private readonly userService = inject(UserService)
    private readonly callService = inject(CallService);
    private readonly socketService = inject(SocketService);

user = computed(()=>this.userService.getUser())

users = computed(()=>this.userService.getUsers())


async startCall(user:User){
  const pc = this.callService.getPeerConnection;
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  this.socketService.emit('offer', {
    from: this.user(),
    to: user,
    offer,
  });
}
}
