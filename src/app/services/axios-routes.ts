import { Injectable } from '@angular/core'

import axios from './axios-config' // Importe o axiosInstance
import { Task, TaskDetails, UserInterface } from './user.interface'

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

  async signUp(data: Partial<UserInterface>): Promise<UserInterface> {
    try {
      const response = await axios.post('accounts/', data)
      return response.data
    } catch (error: unknown) {
      throw new Error('Erro de cadastro')
    }
  }

  async getLogin(): Promise<UserInterface> {
    try {
      const response = await axios.get('accounts/check/')
      return response.data
    } catch (error: unknown) {
      throw new Error('Erro de autenticação')
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const response = await axios.get('tasks/')
      return response.data
    } catch (error: unknown) {
      throw new Error('Erro de autenticação')
    }
  }

  async createTask(data: Partial<TaskDetails>) {
    try {
      const response = await axios.post('tasks/', data)
      return response.data
    } catch (error: unknown) {
      throw new Error('Erro de autenticação')
    }
  }

  async patchTask(id: number, data: Partial<Task>): Promise<Task> {
    try {
      const response = await axios.patch(`tasks/${id}/`, data)
      return response.data
    } catch (error: unknown) {
      throw new Error('Erro de autenticação')
    }
  }

  async deleteTask(id: number) {
    try {
      const response = await axios.delete(`tasks/${id}/`)
      return response.data
    } catch (error: unknown) {
      throw new Error('Erro de autenticação')
    }
  }
}
