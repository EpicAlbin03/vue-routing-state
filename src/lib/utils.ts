export class APIError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getStorageItem<T>(key: string): T | null {
  const storageItem = localStorage.getItem(key)
  if (storageItem) {
    return JSON.parse(storageItem) as T
  }
  return null
}

export function setStorageItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}
