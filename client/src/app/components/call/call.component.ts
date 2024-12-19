import { UserService } from './../../services/user.service';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { StreamComponent } from './stream/stream.component';
import { CallService } from '../../services/call.service';
import { SocketService } from '../../services/socket.service';
import { UsersComponent } from '../users/users.component';

@Component({
  selector: 'app-call',

  imports: [StreamComponent, UsersComponent,],
  templateUrl: './call.component.html',
})
export class CallComponent implements OnInit {
  private readonly callService = inject(CallService);
  private readonly userService = inject(UserService);
  private readonly socketService = inject(SocketService);
  private readonly destroyRef = inject(DestroyRef);
  user = computed(() => this.userService.getUser());
  users = computed(() => this.userService.getUser());
callStatus = computed(()=>this.callService.callStatus())
  async ngOnInit() {

    const allUsersS = this.socketService.on('all-users').subscribe({
      next: (data: any) => {
        console.log('data from all Users: ', data);
        const myUser = data?.find(
          (user: any) => user.username == this.user()?.username
        );
        if (myUser) {
          this.userService.setUser(myUser);
        } else {
          console.log('user not found in allUsers');
        }
        this.userService.setUsers(data);
      },
      error: (error) => console.log('error from all-users: ', error),
    });
    const offerS = this.socketService.on('offer').subscribe({
      next: (data: any) => {
        console.log('data from offer: ', data);
        this.callService.handleOffer(data);
      },
      error: (err) => {
        console.log('error from offer: ', err);
      },
    });
    const answerS = this.socketService.on('answer').subscribe({
      next: (data: any) => {
        console.log('data form answer: ', data);
        this.callService.handlerAnswer(data);
      },
      error: (err) => {
        console.log('error from offer: ', err);
      },
    });
    const candidateS = this.socketService.on('candidate').subscribe({
      next: (data: any) => {
        console.log('data from candidate: ', data);
        this.callService.handlerCandidate(data);
      },
      error: (err) => {
        console.log('error from offer: ', err);
      },
    });
    const callStatusS = this.socketService.on('call-status')
    .subscribe(
      {next:(data:any)=>{
        this.callService.callStatus.set(data.status)
      },
    error:(err)=>{console.log("error: ",err)}}
    )
    const callEndedS = this.socketService.on('call-ended')
    .subscribe(
      {next:(data:any)=>{
        console.log("call ended from: ",data)
        const pc =this.callService.getPeerConnection
    if(pc){
      pc.close()
      this.callService.callStatus.set(undefined)
    }
      },
    error:(err)=>{console.log("error: ",err)}}
    )

    this.destroyRef.onDestroy(() => {
      offerS.unsubscribe();
      answerS.unsubscribe();
      candidateS.unsubscribe();
      allUsersS.unsubscribe();
      callStatusS.unsubscribe()
      callEndedS.unsubscribe()
    });
  }

  endCallHandler(){
    // this.socketService.emit("call-ended",{
    //   from:this.user(),
    //   to:
    // })
  }
}
