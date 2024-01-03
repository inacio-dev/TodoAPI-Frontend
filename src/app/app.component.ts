import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'

import { AuthService } from './services/auth.service'
import { AxiosRoutes } from './services/axios-routes'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)

  constructor(private axiosRoute: AxiosRoutes) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.axiosRoute
        .checkLogin()
        .then((res) => {
          this.authService.currentUserSig.set(res)
        })
        .catch(() => {
          this.authService.currentUserSig.set(null)
          throw new Error()
        })
    } catch (error: unknown) {
      console.error(error)
      this.router.navigateByUrl('/login')
    }
  }
}
