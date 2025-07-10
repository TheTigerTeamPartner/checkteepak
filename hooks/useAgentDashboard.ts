"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Define the interface for the agent profile
interface AgentProfile {
  id?: string;
  name: string;
  phone_number: string;
  line_id: string;
  bio: string;
}

export function useAgentDashboard(userId: string) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [agent, setAgent] = useState<Partial<AgentProfile>>({
    name: '',
    phone_number: '',
    line_id: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const fetchUserDataAndAuthorize = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      if (user.id !== userId) {
        console.error("Access Denied: You can only view your own dashboard.");
        router.push(`/dashboard/${user.id}`);
        return;
      }

      setAuthorized(true);
      setUser(user);

      try {
        // Assuming the API endpoint is set up to fetch agent by user_id
        const response = await fetch(`/api/agents?userId=${user.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            console.log('No agent profile found, user can create one.');
          } else {
            throw new Error('Failed to fetch agent profile');
          }
        } else {
          const result = await response.json();
          if (result.data) {
            setAgent(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching agent profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndAuthorize();
  }, [supabase, userId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!user) {
      setMessage('You must be logged in to update your profile.');
      return;
    }

    try {
      const method = agent.id ? 'PUT' : 'POST';
      const response = await fetch('/api/agents', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...agent, user_id: user.id }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        if (result.data) {
          setAgent(result.data);
        }
      } else {
        setMessage(`Error: ${result.error || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      setMessage('An error occurred while submitting the form.');
      console.error('Submit error:', error);
    }
  };

  return {
    user,
    agent,
    loading,
    message,
    authorized,
    handleInputChange,
    handleSubmit,
    setAgent
  };
}
