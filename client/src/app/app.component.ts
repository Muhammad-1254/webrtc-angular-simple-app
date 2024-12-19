import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly socketService= inject(SocketService);
  private readonly userService = inject(UserService);
  ngOnInit() {
    const user = this.userService.getUser()
    if (!user) {
      this.router.navigate(['/login']);
    }
    else if(user?.username && !user?.id){
      this.socketService.emit("user-join",user.username)
    }


  }


}
