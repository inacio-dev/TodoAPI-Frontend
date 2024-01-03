import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { z, ZodError, ZodType } from 'zod'

import { AxiosRoutes } from '../../services/axios-routes'

const RegisterSchema: ZodType<{
  email: string
  password: string
  rpassword: string
  surname: string
  name: string
}> = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  surname: z.string(),
  rpassword: z.string(),
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

  constructor(private axiosRoute: AxiosRoutes) {}

  async register(): Promise<void> {
    try {
      const data = RegisterSchema.parse(this.registerForm.value)

      const res = await this.axiosRoute.signUp(data)

      this.router.navigateByUrl('/login')
      console.log('Resposta do registro:', res)
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.error('Erro de validação:', error.errors)
      } else {
        console.error('Erro:', error)
      }
    }
  }
}
