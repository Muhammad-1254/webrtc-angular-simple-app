import { UserService } from '../../services/user.service';
import { SocketService } from '../../services/socket.service';
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';



@Component({
  selector:"app-add-user",
  imports:[FormsModule],
  templateUrl:"./login.component.html",
})

export class LoginComponent {
inputValue = signal<string>('');
private socketService = inject(SocketService);
private userService = inject(UserService);
private router = inject(Router);





addUser() {
  if(this.inputValue().length===0){
    return
  }
  this.socketService.emit('user-join', this.inputValue());
  // this.isCurrentUserJoined.set(true);
  this.userService.setUser({username: this.inputValue().trim()});
  this.inputValue.set('');
this.router.navigate(['/call'])

}



}
