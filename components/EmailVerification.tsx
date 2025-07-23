"use client";

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Mail, Plus, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Email {
  id: number | string;
  value: string;
  verified: boolean;
  verificationSent: boolean;
}

interface EmailVerificationProps {
  formData: {
    contact: {
      emails: Email[];
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function EmailVerification({ formData, setFormData }: EmailVerificationProps) {
  const [isSending, setIsSending] = useState(false);

  // Function to send verification email
  const sendVerificationEmail = async (email: string, index: number) => {
    try {
      setIsSending(true);
      
      // Send verification email via Supabase
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Update email status to show verification link sent
      const updatedEmails = [...(formData.contact.emails || [])];
      updatedEmails[index].verificationSent = true;
      
      setFormData((prev: any) => ({
        ...prev,
        contact: {
          ...prev.contact,
          emails: updatedEmails,
        },
      }));

      toast({
        title: 'สำเร็จ',
        description: 'ส่งลิงก์ยืนยันอีเมลเรียบร้อยแล้ว',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถส่งลิงก์ยืนยันได้',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Label className="text-base font-medium flex items-center gap-2">
          <Mail className="w-4 h-4" />
          อีเมล
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFormData((prev: any) => ({
              ...prev,
              contact: {
                ...prev.contact,
                emails: [
                  ...(prev.contact.emails || []), 
                  { 
                    value: "", 
                    verified: false, 
                    verificationSent: false, 
                    id: Date.now() 
                  }
                ],
              },
            }));
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> เพิ่มอีเมล
        </Button>
      </div>

      {/* List of emails */}
      <div className="space-y-3">
        {(formData.contact.emails || []).map((email, index) => (
          <div key={email.id || index} className="flex items-center gap-2">
            <Input
              type="email"
              value={email.value}
              onChange={(e) => {
                const updatedEmails = [...(formData.contact.emails || [])];
                updatedEmails[index].value = e.target.value;
                setFormData((prev: any) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    emails: updatedEmails,
                  },
                }));
              }}
              placeholder="อีเมล"
              className="flex-1"
            />
            {email.verified ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                ยืนยันแล้ว
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={isSending || email.verificationSent}
                onClick={() => sendVerificationEmail(email.value, index)}
              >
                {email.verificationSent ? 'ลิงก์ถูกส่งแล้ว' : 'ส่งลิงก์ยืนยัน'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 px-2"
              onClick={() => {
                const updatedEmails = (formData.contact.emails || []).filter((_, i) => i !== index);
                setFormData((prev: any) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    emails: updatedEmails,
                  },
                }));
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
