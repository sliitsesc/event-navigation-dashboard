export interface User {
  id: number
  email: string
  accessToken: string
  refreshToken: string
}

export interface Zone {
  id: number
  zoneName: string
  description?: string
  imageUrl?: string
  colorCode: string
  createdAt: string
  updatedAt: string
  stalls?: Stall[]
}

export interface Stall {
  id: number
  name: string
  description?: string
  organizer: string
  category: StallCategory
  floorNumber: number
  location: string
  image?: string
  zoneId: number
  createdAt: string
  updatedAt: string
}

export type StallCategory =
  | "OTHER"
  | "ART"
  | "AUTOMOTIVE"
  | "ENTERTAINMENT"
  | "HEALTH"
  | "FOOD"
  | "SPORTS"
  | "FASHION"
  | "TECHNOLOGY"
  | "EDUCATION"
  | "RETAIL"

export interface ApiResponse<T> {
  status: "successful" | "failed"
  message: string
  results: T[]
}

export interface CreateZoneData {
  zoneName: string
  description?: string
  imageUrl?: string
  colorCode: string
}

export interface CreateStallData {
  name: string
  description?: string
  organizer: string
  category: StallCategory
  floorNumber: number
  location: string
  image?: string
}
