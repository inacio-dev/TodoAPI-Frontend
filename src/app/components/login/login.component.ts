import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { z, ZodError, ZodType } from 'zod'

import { AuthService } from '../../services/auth.service'
import { AxiosRoutes } from '../../services/axios-routes'

const LoginSchema: ZodType<{ email: string; password: string }> = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  fb = inject(FormBuilder)
  authService = inject(AuthService)
  router = inject(Router)

  loginForm = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  constructor(private axiosRoute: AxiosRoutes) {}

  async login(): Promise<void> {
    try {
      const data = LoginSchema.parse(this.loginForm.value)
      await this.axiosRoute.login(data.email, data.password).then((res) => {
        localStorage.setItem('access-token', res.access)
        localStorage.setItem('refresh-token', res.access)
        this.router.navigateByUrl('/')

        console.log('Resposta do login:', res)
      })
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.error('Erro de validação:', error.errors)
      } else {
        console.error('Erro:', error)
      }
    }
  }
}
