import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
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
  fb = inject(FormBuilder)

  tasks: Task[] = []
  showDeleteTask: number | null = null

  fileForm = this.fb.nonNullable.group({
    file: ['', Validators.required],
  }) as FormGroup & { value: { file: File } }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0]
      this.fileForm.patchValue({
        file: file,
      })

      inputElement.value = ''
      this.importTask()
    }
  }

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

  async exportTask() {
    try {
      const response = await this.axiosRoute.exportTask()

      const blob = new Blob([s2ab(atob(response))])

      const href = window.URL.createObjectURL(blob)

      const anchorElement = document.createElement('a')

      anchorElement.href = href
      anchorElement.download = 'tasks.xlsx'

      document.body.appendChild(anchorElement)
      anchorElement.click()

      document.body.removeChild(anchorElement)
      window.URL.revokeObjectURL(href)
    } catch (error: unknown) {
      console.log(error)
    }
  }

  async importTask() {
    try {
      const formData = new FormData()

      const fileSourceValue = this.fileForm.get('file')?.value

      if (fileSourceValue !== null && fileSourceValue !== undefined) {
        formData.append('file', fileSourceValue)
      }

      await this.axiosRoute.importTask(formData)

      this.fileForm.patchValue({
        file: '',
      })

      await this.getListTask()
    } catch (error: unknown) {
      console.log(error)
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

function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}
