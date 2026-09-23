/** Backend /api/system/* payloads (implemented endpoints). */
export interface SystemHealth {
  status: string
  /** "NOT_CONFIGURED" | "UP" | "DOWN" */
  database: string
}

export interface SystemVersion {
  name: string
  version: string
  buildTime: string | null
  javaVersion: string
  springBootVersion: string
}
