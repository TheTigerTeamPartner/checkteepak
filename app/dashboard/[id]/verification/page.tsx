"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { useVerification } from '@/hooks/useVerification';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from 'next/image';

const StatusInfo = {
  pending: {
    icon: <Clock className="h-4 w-4" />,
    variant: "default" as const,
    text: "Pending Review",
    description: "Your document is awaiting review. This usually takes 1-2 business days."
  },
  approved: {
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    variant: "default" as const,
    text: "Verified",
    description: "Your identity has been successfully verified. You now have full access."
  },
  rejected: {
    icon: <XCircle className="h-4 w-4" />,
    variant: "destructive" as const,
    text: "Rejected",
    description: "Your document was not approved. Please check the reason and resubmit."
  }
};

export default function VerificationPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase]);

  const {
    documentType,
    setDocumentType,
    file,
    previewUrl,
    isLoading,
    verificationStatus,
    handleFileChange,
    handleSubmit,
  } = useVerification(user);

  const dbStatus = verificationStatus?.status;
  const statusKey = dbStatus === 'verified' ? 'approved' : dbStatus;
  const statusDetails = statusKey ? StatusInfo[statusKey as keyof typeof StatusInfo] : null;
  const isSubmissionAllowed = !dbStatus || dbStatus === 'rejected';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
          <CardDescription>
            To ensure the safety of our community, we require agents to verify their identity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statusDetails ? (
            <Alert variant={statusDetails.variant}>
              {statusDetails.icon}
              <AlertTitle>Status: {statusDetails.text}</AlertTitle>
              <AlertDescription>
                {statusDetails.description}
                {dbStatus === 'rejected' && verificationStatus.rejection_reason && (
                  <p className="mt-2 font-semibold">Reason: {verificationStatus.rejection_reason}</p>
                )}
              </AlertDescription>
            </Alert>
          ) : (
             <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>No Submission Found</AlertTitle>
                <AlertDescription>
                 Please submit your verification documents to get started.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isSubmissionAllowed && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Submit Document</CardTitle>
              <CardDescription>Please upload a clear image of your document.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select onValueChange={setDocumentType} defaultValue={documentType}>
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Select a document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national_id">National ID Card</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-file">Document File</Label>
                <Input id="document-file" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" />
              </div>
              {previewUrl && (
                <div className="mt-4">
                    <Label>Image Preview</Label>
                    <div className="relative w-full h-64 border rounded-md mt-2">
                        <Image src={previewUrl} alt="Document preview" layout="fill" objectFit="contain" />
                    </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || !file}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Verification
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
