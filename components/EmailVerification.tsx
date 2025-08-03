"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Mail, Plus, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface Email {
  id: string;
  value: string;
  verified: boolean;
  verificationSent: boolean;
}

interface EmailVerificationProps {
  emails: Email[];
  onEmailsChange: (emails: Email[]) => void;
  onEmailVerified?: (verified: boolean) => void;
}

export default function EmailVerification({ emails = [], onEmailsChange, onEmailVerified }: EmailVerificationProps) {
  const supabase = createClientComponentClient();
  const [isSending, setIsSending] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingEmailId, setVerifyingEmailId] = useState<string | null>(null);

  // Check if any email is verified
  useEffect(() => {
    const verified = emails.some(email => email.verified);
    if (onEmailVerified) {
      onEmailVerified(verified);
    }
  }, [emails, onEmailVerified]);

  // Send email verification link
  const sendVerification = async (email: string, id: string) => {
    try {
      setIsSending(true);
      setVerifyingEmailId(id);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      const updatedEmails = emails.map(e => 
        e.id === id ? { ...e, verificationSent: true } : e
      );
      onEmailsChange(updatedEmails);

      toast({
        title: 'ส่งลิงก์ยืนยันเรียบร้อย',
        description: 'กรุณาตรวจสอบอีเมลของคุณและกรอกรหัส OTP ที่ได้รับ',
      });
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถส่งลิงก์ยืนยันได้',
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Verify with OTP
  const verifyWithOtp = async (email: string) => {
    try {
      setIsSending(true);
      
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      const updatedEmails = emails.map(e => 
        e.value === email ? { ...e, verified: true } : e
      );
      onEmailsChange(updatedEmails);
      setOtp('');
      setVerifyingEmailId(null);

      toast({
        title: 'ยืนยันอีเมลสำเร็จ',
        description: 'อีเมลของคุณได้รับการยืนยันแล้ว',
      });

      if (onEmailVerified) {
        onEmailVerified(true);
      }
    } catch (error: any) {
      toast({
        title: 'ยืนยันไม่สำเร็จ',
        description: error.message || 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ',
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Add new email
  const addEmail = () => {
    const newEmail: Email = {
      id: Date.now().toString(),
      value: '',
      verified: false,
      verificationSent: false,
    };
    onEmailsChange([...emails, newEmail]);
  };

  // Remove email
  const removeEmail = (id: string) => {
    onEmailsChange(emails.filter(e => e.id !== id));
    
    // Check if any email remains verified
    const verified = emails.some(email => email.id !== id && email.verified);
    if (onEmailVerified) {
      onEmailVerified(verified);
    }
  };

  // Update email
  const updateEmail = (id: string, value: string) => {
    const updatedEmails = emails.map(e => 
      e.id === id ? { ...e, value, verified: false, verificationSent: false } : e
    );
    onEmailsChange(updatedEmails);
    
    // Check if any email remains verified
    const verified = updatedEmails.some(email => email.verified);
    if (onEmailVerified) {
      onEmailVerified(verified);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium flex items-center gap-2">
          <Mail className="w-4 h-4" />
          อีเมล
        </Label>
        <Button variant="outline" size="sm" onClick={addEmail}>
          <Plus className="w-4 h-4 mr-1" /> เพิ่มอีเมล
        </Button>
      </div>

      <div className="space-y-3">
        {emails.map((email) => (
          <div key={email.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="email"
                value={email.value}
                onChange={(e) => updateEmail(email.id, e.target.value)}
                placeholder="กรอกอีเมล"
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
                  disabled={isSending || email.verificationSent || !email.value}
                  onClick={() => sendVerification(email.value, email.id)}
                >
                  {email.verificationSent ? 'ส่งแล้ว' : 'ยืนยันอีเมล'}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 px-2"
                onClick={() => removeEmail(email.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {verifyingEmailId === email.id && email.verificationSent && !email.verified && (
              <div className="flex items-center gap-2 pl-2">
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="กรอกรหัส OTP จากอีเมล"
                  className="flex-1 max-w-xs"
                />
                <Button
                  variant="default"
                  size="sm"
                  disabled={isSending || !otp}
                  onClick={() => verifyWithOtp(email.value)}
                >
                  ยืนยัน OTP
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}