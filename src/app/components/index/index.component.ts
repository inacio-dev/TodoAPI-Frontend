import { Component, inject, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'

import { TaskDialogComponent } from '../../dialogs/task.dialog'
import { AuthService } from '../../services/auth.service'
import { AxiosRoutes } from '../../services/axios-routes'
import { Task, TaskDetails } from '../../services/user.interface'

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  authService = inject(AuthService)

  tasks: Task[] = []
  showDeleteTask: number | null = null

  constructor(
    private axiosRoute: AxiosRoutes,
    private router: Router,
    public dialog: MatDialog,
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

  createTask() {
    this.dialog.open(TaskDialogComponent)
    this.dialog.afterAllClosed.subscribe(async () => {
      await this.getListTask()
    })
  }

  editTask(task: TaskDetails) {
    this.dialog.open(TaskDialogComponent, { data: task })
    this.dialog.afterAllClosed.subscribe(async () => {
      await this.getListTask()
    })
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
