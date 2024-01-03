import { Injectable } from '@angular/core'

import axios from './axios-config' // Importe o axiosInstance
import { UserInterface } from './user.interface'

@Injectable({
  providedIn: 'root',
})
export class AxiosRoutes {
  async login(email: string, password: string): Promise<{ access: string; refresh: string }> {
    try {
      const response = await axios.post('token/', { email, password })
      return response.data
    } catch (error: unknown) {
      throw new Error('Erro de login')
    }
  }

  async signUp(
    name: string,
    email: string,
    password: string,
    rpassword: string,
    surname: string,
  ): Promise<{
    name: string
    surname: string
    email: string
    group: string[]
  }> {
    try {
      const response = await axios.post('accounts/', { name, email, password, rpassword, surname })
      return response.data
    } catch (error: unknown) {
      throw new Error('Erro de cadastro')
    }
  }

  async checkLogin(): Promise<UserInterface> {
    try {
      const response = await axios.get('accounts/check/')
      return response.data
    } catch (error: unknown) {
      throw new Error('Erro de autenticação')
    }
  }
}
