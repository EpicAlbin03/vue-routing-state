export type User = {
  username: string
}

export type LoginCredentials = {
  username: string
  password: string
}

export type Student = {
  id: number
  name: string
  email: string
  grade: string
  courseId: number
}

export type StudentFormData = Omit<Student, 'id'>

export type Course = {
  id: number
  name: string
  code: string
  description: string
}
