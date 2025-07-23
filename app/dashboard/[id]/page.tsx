"use client";

import { useAgentDashboard } from "@/hooks/useAgentDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function MemberDashboardPage({ params }: { params: { id: string } }) {
  const {
    user,
    agent,
    loading,
    message,
    authorized,
    handleInputChange,
    handleSubmit
  } = useAgentDashboard(params.id);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!authorized) {
    // The hook handles redirection, but we can show a message while it happens.
    return <div className="flex justify-center items-center h-screen">Redirecting...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-gray-500">
            Welcome, {user?.user_metadata?.full_name || user?.email}!
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Agent Profile</CardTitle>
              <CardDescription>Manage your public agent information here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={agent.name || ''} onChange={handleInputChange} placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" name="phone_number" value={agent.phone_number || ''} onChange={handleInputChange} placeholder="Your contact phone number" />
                  </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="line_id">Line ID</Label>
                    <Input id="line_id" name="line_id" value={agent.line_id || ''} onChange={handleInputChange} placeholder="Your Line ID" />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography / About Me</Label>
                  <Textarea id="bio" name="bio" value={agent.bio || ''} onChange={handleInputChange} placeholder="Tell us about yourself" className="min-h-[120px]" />
                </div>
                <div className="flex justify-end items-center gap-4 pt-4">
                  {message && <p className="text-sm text-gray-600">{message}</p>}
                  <Button type="submit">Update Profile</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>Submit your documents to get verified.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The verification system is coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
