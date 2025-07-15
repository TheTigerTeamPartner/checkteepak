import { supabase } from "./supabase"
import type { Agent, Report } from "@/types"

// Agents
export async function getAgents(filters?: {
  search?: string
  status?: string
  limit?: number
  offset?: number
}) {
  try {
    let query = supabase.from("agents").select("*").order("created_at", { ascending: false })

    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`)
    }

    if (filters?.status) {
      query = query.eq("verification_status", filters.status)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getAgentById(id: string) {
  try {
    const { data, error } = await supabase.from("agents").select("*").eq("id", id).single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function createAgent(agent: Omit<Agent, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase.from("agents").insert([agent]).select().single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateAgent(id: string, updates: Partial<Agent>) {
  try {
    const { data, error } = await supabase.from("agents").update(updates).eq("id", id).select().single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Properties
export async function getProperties(filters?: {
  search?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  limit?: number
  offset?: number
}) {
  try {
    let query = supabase
      .from("properties")
      .select(`
        *,
        agent:agents(*)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.type) {
      query = query.eq("property_type", filters.type)
    }

    if (filters?.minPrice) {
      query = query.gte("price", filters.minPrice)
    }

    if (filters?.maxPrice) {
      query = query.lte("price", filters.maxPrice)
    }

    if (filters?.location) {
      query = query.ilike("location", `%${filters.location}%`)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getPropertyById(id: string) {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        agent:agents(*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Reports
export async function getReports(filters?: {
  status?: string
  type?: string
  limit?: number
  offset?: number
}) {
  try {
    let query = supabase
      .from("reports")
      .select(`
        *,
        reporter:users(*),
        agent:agents(*),
        property:properties(*)
      `)
      .order("created_at", { ascending: false })

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.type) {
      query = query.eq("report_type", filters.type)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function createReport(report: Omit<Report, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase
      .from("reports")
      .insert([{ ...report, status: "pending" }])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateReport(id: string, updates: Partial<Report>) {
  try {
    const { data, error } = await supabase.from("reports").update(updates).eq("id", id).select().single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}


// Statistics
export async function getStatistics() {
  try {
    const [
      { count: totalAgents },
      { count: verifiedAgents },
      { count: totalProperties },
      { count: totalReports },
      { count: pendingReports },
    ] = await Promise.all([
      supabase.from("agents").select("*", { count: "exact", head: true }),
      supabase.from("agents").select("*", { count: "exact", head: true }).eq("verification_status", "verified"),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("reports").select("*", { count: "exact", head: true }),
      supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ])

    return {
      data: {
        totalAgents: totalAgents || 0,
        verifiedAgents: verifiedAgents || 0,
        totalProperties: totalProperties || 0,
        totalReports: totalReports || 0,
        pendingReports: pendingReports || 0,
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error }
  }
}