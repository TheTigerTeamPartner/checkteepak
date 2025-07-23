"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { getVerificationStatus, uploadVerificationDocument, updateUserVerificationStatus } from '@/lib/verification';
import type { User } from '@supabase/supabase-js';

export const useVerification = (user: User | null) => {
  const { toast } = useToast();
  const router = useRouter();
  const [documentType, setDocumentType] = useState('national_id');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const fetchStatus = async () => {
        const status = await getVerificationStatus(user.id);
        setVerificationStatus(status);
      };
      fetchStatus();
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !user) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const documentUrl = await uploadVerificationDocument(user.id, file);
      await updateUserVerificationStatus(user.id, documentUrl, documentType);
      
      toast({
        title: 'Success',
        description: 'Your document has been submitted for verification.',
      });

      // Refetch status and refresh the page
      const status = await getVerificationStatus(user.id);
      setVerificationStatus(status);
      router.refresh();

    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    documentType,
    setDocumentType,
    file,
    previewUrl,
    isLoading,
    verificationStatus,
    handleFileChange,
    handleSubmit,
  };
};
