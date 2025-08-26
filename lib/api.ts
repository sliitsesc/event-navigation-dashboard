import type { User, Zone, Stall, ApiResponse, CreateZoneData, CreateStallData } from "@/types"

class ApiClient {
  private baseURL = "https://human-preventing-antarctica-warner.trycloudflare.com"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const user = this.getStoredUser()
    const token = user?.accessToken

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.results[0].message || "API request failed")
    }

    return data
  }

  private getStoredUser(): User | null {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem("admin_user")
    return stored ? JSON.parse(stored) : null
  }

  // Auth
  async signIn(email: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>("/v1/auth/sign-in", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  // Zones
  async getZones(): Promise<ApiResponse<Zone>> {
    return this.request<Zone>("/v1/exhibition/zones")
  }

  async createZone(zoneData: CreateZoneData): Promise<ApiResponse<Zone>> {
    return this.request<Zone>("/v1/admin/zone", {
      method: "POST",
      body: JSON.stringify(zoneData),
    })
  }

  async updateZone(id: number, zoneData: CreateZoneData): Promise<ApiResponse<Zone>> {
    return this.request<Zone>(`/v1/admin/zone/${id}`, {
      method: "PATCH",
      body: JSON.stringify(zoneData),
    })
  }

  async deleteZone(id: number): Promise<ApiResponse<Zone>> {
    return this.request<Zone>(`/v1/admin/zone/${id}`, {
      method: "DELETE",
    })
  }

  // Stalls
  async getStalls(zoneId: number): Promise<ApiResponse<Stall>> {
    return this.request<Stall>(`/v1/exhibition/stalls/zone/${zoneId}`)
  }

  async createStall(zoneId: number, stallData: CreateStallData): Promise<ApiResponse<Stall>> {
    return this.request<Stall>(`/v1/admin/zone/${zoneId}/stall`, {
      method: "POST",
      body: JSON.stringify(stallData),
    })
  }

  async updateStall(stallId: number, stallData: CreateStallData): Promise<ApiResponse<Stall>> {
    return this.request<Stall>(`/v1/admin/stall/${stallId}`, {
      method: "PATCH",
      body: JSON.stringify(stallData),
    })
  }

  async deleteStall(stallId: number): Promise<ApiResponse<Stall>> {
    return this.request<Stall>(`/v1/admin/stall/${stallId}`, {
      method: "DELETE",
    })
  }
}

export const api = new ApiClient()
