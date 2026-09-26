"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { ShieldCheck, RefreshCw } from "lucide-react";

interface OtpVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerify: (otp: string) => void;
  isLoading?: boolean;
}

export function OtpVerificationModal({
  open,
  onOpenChange,
  email,
  onVerify,
  isLoading = false,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  const handleVerify = () => {
    if (isComplete) {
      onVerify(otp.join(""));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] text-center">
        <DialogHeader className="space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <DialogTitle className="text-xl">Two-Factor OTP Verification</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            We sent a 6-digit verification code to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="h-12 w-11 rounded-xl border border-input text-center text-xl font-bold font-mono bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-xs"
              />
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Tip: For testing purposes, enter any 6 digits (e.g., 123456)
          </p>
        </div>

        <div className="space-y-2">
          <Button
            type="button"
            className="w-full rounded-xl"
            variant="gradient"
            disabled={!isComplete}
            isLoading={isLoading}
            onClick={handleVerify}
          >
            Verify & Proceed to Dashboard
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-xs text-muted-foreground gap-1.5"
            onClick={() => {
              setOtp(["", "", "", "", "", ""]);
              inputRefs.current[0]?.focus();
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Resend Code</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
