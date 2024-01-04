import { Injectable } from '@angular/core'
import { HotToastService } from '@ngneat/hot-toast'

@Injectable({
  providedIn: 'root',
})
export class ToastModals {
  constructor(private toast: HotToastService) {}

  success(message: string) {
    this.toast.success(message, {
      duration: 3000,
    })
  }

  error(message: string) {
    this.toast.error(message, {
      duration: 5000,
    })
  }
}
