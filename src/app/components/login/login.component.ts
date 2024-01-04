import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { z, ZodError, ZodType } from 'zod'

import { AuthService } from '../../services/auth.service'
import { AxiosRoutes } from '../../services/axios-routes'
import { ToastModals } from '../../services/toast.modals'

const LoginSchema: ZodType<{ email: string; password: string }> = z.object({
  email: z.string({ required_error: 'Email é obrigatório.' }).email('Insira um email válido.'),
  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(6, 'Senha tem mínimo de 6 caracteres.'),
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

  constructor(
    private axiosRoute: AxiosRoutes,
    public toast: ToastModals,
  ) {}

  async login(): Promise<void> {
    try {
      const data = LoginSchema.parse(this.loginForm.value)
      await this.axiosRoute.login(data.email, data.password).then((res) => {
        localStorage.setItem('access-token', res.access)
        localStorage.setItem('refresh-token', res.access)
        this.router.navigateByUrl('/')

        console.log('Resposta do login:', res)

        this.toast.success('Login efetuado com sucesso.')
      })
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.error('Erro de validação:', error.errors)

        error.errors.map((error) => {
          this.toast.error(error.message)
        })
      } else {
        console.error('Erro:', error)
      }
    }
  }
}
