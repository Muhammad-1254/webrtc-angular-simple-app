import { Routes } from '@angular/router';
import { CallComponent } from './components/call/call.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path:"call",component:CallComponent
  },
  {
    path:'login',component:LoginComponent
  }

];
