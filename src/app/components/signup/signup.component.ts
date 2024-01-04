import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { z, ZodError, ZodType } from 'zod'

import { AxiosRoutes } from '../../services/axios-routes'
import { ToastModals } from '../../services/toast.modals'

const RegisterSchema: ZodType<{
  email: string
  password: string
  rpassword: string
  surname: string
  name: string
}> = z
  .object({
    email: z.string({ required_error: 'Email é obrigatório.' }).email('Insira um email válido.'),
    password: z
      .string({ required_error: 'Senha é obrigatória.' })
      .min(6, 'Senha tem mínimo de 6 caracteres.'),
    name: z.string({ required_error: 'Nome é obrigatório.' }),
    surname: z.string({ required_error: 'Sobremone é obrigatório.' }),
    rpassword: z.string({ required_error: 'Confirmação de senha é obrigatória.' }),
  })
  .refine((data) => data.password === data.rpassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['rpassword'],
  })

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [ReactiveFormsModule],
})
export class SignUpComponent {
  fb = inject(FormBuilder)
  router = inject(Router)

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rpassword: ['', [Validators.required]],
  })

  constructor(
    private axiosRoute: AxiosRoutes,
    public toast: ToastModals,
  ) {}

  async register(): Promise<void> {
    try {
      const data = RegisterSchema.parse(this.registerForm.value)

      const res = await this.axiosRoute.signUp(data)

      this.router.navigateByUrl('/login')
      console.log('Resposta do registro:', res)

      this.toast.success('Cadastro efetuado com sucesso.')
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.error('Erro de validação:', error.errors)

        error.errors.map((error) => {
          this.toast.error(error.message)
        })
      } else {
        console.error('Erro:', error)

        this.toast.error('Erro inesperado.')
      }
    }
  }
}
