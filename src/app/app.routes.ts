import { Routes } from '@angular/router'

import { IndexComponent } from './components/index/index.component'
import { LoginComponent } from './components/login/login.component'
import { SignUpComponent } from './components/signup/signup.component'
import { LoggedOutGuard } from './services/auth.guard'

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoggedOutGuard] },
  { path: 'cadastro', component: SignUpComponent, canActivate: [LoggedOutGuard] },
]
