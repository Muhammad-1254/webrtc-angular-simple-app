import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CallService } from '../../../services/call.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-stream',
  imports: [],
  templateUrl: './stream.component.html',
})
export class StreamComponent implements AfterViewInit,OnInit {
  private readonly callService = inject(CallService);



  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  async ngOnInit() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        console.log({ stream });

        this.callService.setLocalStream(stream);
        this.localVideo.nativeElement.srcObject = stream;
      } catch (error) {
        console.log('error from on init: ', error);
      }


  }
  ngAfterViewInit(): void {
    this.callService.setRemoteVideoElement(this.remoteVideo);
  }
}
