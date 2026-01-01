import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { Home } from './home/home';
import { SkillFusionPlatform } from './skill-fusion-platform/skill-fusion-platform';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path:'Home',
    component:Home
  },
  {
    path:'SkillFusionPlatform',
    component:SkillFusionPlatform
  }
];
