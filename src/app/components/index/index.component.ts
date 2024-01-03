import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { AuthService } from '../../services/auth.service'
import { AxiosRoutes } from '../../services/axios-routes'
import { Task } from '../../services/user.interface'

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  authService = inject(AuthService)

  tasks: Task[] = []
  showDeleteTask: number | null = null

  constructor(
    private axiosRoute: AxiosRoutes,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const res = await this.axiosRoute.getLogin()

      this.authService.currentUserSig.set(res)

      await this.getListTask()
    } catch (error: unknown) {
      this.authService.currentUserSig.set(null)
      this.router.navigate(['/login'])
    }
  }

  async getListTask() {
    try {
      const data = await this.axiosRoute.getTasks()

      this.tasks = data
    } catch (error: unknown) {
      console.log(error)
    }
  }

  async logout() {
    this.authService.currentUserSig.set(null)
    this.router.navigate(['/login'])
  }

  async toggleTaskStatus(id: number, value: boolean) {
    try {
      const res = await this.axiosRoute.patchTask(id, { completed: value })

      this.tasks = this.tasks.map((task) => {
        return task.id === id ? res : task
      })
    } catch (error: unknown) {
      console.log(error)
    }
  }

  async deleteTask(id: number) {
    try {
      await this.axiosRoute.deleteTask(id)

      await this.getListTask()
    } catch (error: unknown) {
      console.log(error)
    }
  }

  showDelete(id: number | null) {
    this.showDeleteTask = id
  }

  taskDelete(id: number) {
    return this.showDeleteTask === id
  }
}
