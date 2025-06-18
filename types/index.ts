export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  user_type: "user" | "admin"
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  full_name: string
  phone: string
  email?: string
  license_number?: string
  company_name?: string
  address?: string
  verification_status: "pending" | "verified" | "rejected" | "blacklisted"
  verification_documents?: string[]
  rating?: number
  total_reviews: number
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  title: string
  description?: string
  property_type: "condo" | "house" | "apartment" | "land" | "commercial"
  price: number
  location: string
  images?: string[]
  agent_id: string
  agent?: Agent
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reporter?: User
  agent_id?: string
  agent?: Agent
  property_id?: string
  property?: Property
  report_type: "fraud" | "fake_listing" | "scam" | "other"
  description: string
  evidence_files?: string[]
  status: "pending" | "investigating" | "resolved" | "dismissed"
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  user?: User
  plan_type: "basic" | "premium" | "enterprise"
  status: "active" | "inactive" | "cancelled"
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}
