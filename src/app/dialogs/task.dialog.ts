import { Component, Inject, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { z, ZodError, ZodType } from 'zod'

import { AxiosRoutes } from '../services/axios-routes'
import { Task, TaskDetails } from '../services/user.interface'

const TaskSchema: ZodType<TaskDetails> = z.object({
  title: z.string(),
  description: z.string(),
})

@Component({
  selector: 'app-task-dialog',
  templateUrl: 'task.dialog.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule],
})
export class TaskDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private axiosRoute: AxiosRoutes,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
  ) {}

  fb = inject(FormBuilder)

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
  })

  async saveTask(): Promise<void> {
    try {
      const data = TaskSchema.parse(this.taskForm.value)

      if (this.data) {
        const res = await this.axiosRoute.patchTask(this.data.id, data)
        console.log('Resposta do registro:', res)
      } else {
        const res = await this.axiosRoute.createTask(data)
        console.log('Resposta do registro:', res)
      }

      this.dialogRef.close()
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.error('Erro de validação:', error.errors)
      } else {
        console.error('Erro:', error)
      }
    }
  }
}
