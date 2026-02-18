"use client";

import { useState, useEffect, useCallback } from "react";
import { Complaint, ComplaintStatus, AgentProfile, UserProfile } from "@/types/complaint"; // Adjust based on your types file path

interface User {
  id: string;
  role: 'agent' | 'admin' | 'user';
  user_metadata?: {
    full_name?: string;
  };
  email?: string;
}

export const useAgentDashboard = (agentId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const fetchComplaints = useCallback(async () => {
    try {
      if (!agentId) {
        throw new Error("Agent ID is required to fetch complaints.");
      }

      const response = await fetch(`/api/agent/${agentId}/complaints`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch complaints");
      }

      const data: Complaint[] = await response.json();
      setComplaints(data);
      setMessage(null);
    } catch (error: any) {
      console.error("Error fetching complaints:", error);
      setMessage(error.message || "Failed to load complaints.");
      setComplaints([]);
    }
  }, [agentId]);

  const updateComplaintStatus = useCallback(async (
    complaintId: string,
    newStatus: ComplaintStatus
  ) => {
    try {
      setMessage(null);

      const response = await fetch(`/api/complaints/${complaintId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update complaint status on backend");
      }

      await fetchComplaints();
      setMessage("Status updated successfully!");
    } catch (error: any) {
      console.error("Error updating complaint status:", error);
      setMessage(error.message || "Error updating status.");
      await fetchComplaints();
      throw error;
    }
  }, [fetchComplaints]);

  // Placeholder for profile input changes (you need to implement this based on your form)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Example: setAgent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Placeholder for profile submission (you need to implement this via API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Profile submission logic not implemented.");
  };

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      // **REPLACE WITH ACTUAL API CALLS TO FETCH USER AND AGENT PROFILE DATA**
      // Example: const userResponse = await fetch('/api/auth/me');
      // Example: const agentProfileResponse = await fetch(`/api/agent/profile/${agentId}`);

      // MOCK DATA (REMOVE THIS WHEN IMPLEMENTING REAL API CALLS)
      const fetchedUser: User = { id: agentId, role: 'agent', email: 'agent@example.com', user_metadata: { full_name: 'Mock Agent' } };
      const fetchedAgent: AgentProfile = {
          id: agentId,
          user_id: agentId,
          id_card_number: '1234567890123',
          selfie_description: 'Mock selfie description',
          verification_status: 'pending',
      };
      // END MOCK DATA

      setUser(fetchedUser);
      setAgent(fetchedAgent);

      if (fetchedUser && fetchedUser.id === agentId && fetchedUser.role === 'agent') {
        setAuthorized(true);
        await fetchComplaints();
      } else {
        setAuthorized(false);
        setMessage("Unauthorized access.");
      }
    } catch (error: any) {
      console.error("Error initializing dashboard:", error);
      setMessage(error.message || "Failed to initialize dashboard data.");
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [agentId, fetchComplaints]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    user,
    agent,
    loading,
        message,
    authorized,
    handleInputChange,
    handleSubmit,
    updateComplaintStatus,
    complaints,
    fetchUserData,
  };
};