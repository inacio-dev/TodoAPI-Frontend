export type UserInterface = {
  name: string
  surname: string
  email: string
  group: string[]
}

export type Task = {
  id: number
  title: string
  description: string
  completed: boolean
  user: number
}

export type TaskDetails = {
  title: string
  description: string
}
