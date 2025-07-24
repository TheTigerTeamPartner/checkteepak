export type ComplaintStatus = "pending" | "received" | "in_progress" | "resolved" | "closed" | "rejected";

export interface Complaint {
  id: string; // Or number, adjust based on your DB schema
  title: string;
  status: ComplaintStatus;
  // Add all other fields from your 'complaints' table
  // e.g., created_at: string;
  // reporter_name: string;
  // assigned_agent_id: string; // If you link to agent ID
}

export interface AgentProfile {
  id: string; // Or number
  user_id: string; // Link to auth.users.id
  id_card_number: string | null;
  selfie_description: string | null;
  verification_status: "pending" | "verified" | "rejected";
  // Add other agent profile fields
}

export interface UserProfile { // Example if you have a separate user profile table
  id: string;
  email: string;
  full_name: string | null;
  role: 'agent' | 'admin' | 'user';
  // Add other user profile fields
}