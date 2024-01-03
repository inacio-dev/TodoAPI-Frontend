import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class LoggedOutGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/'])
      return false
    }
    return true
  }
}
