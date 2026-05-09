import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

type Step = "email" | "otp" | "password" | "success";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetLocalState = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  const handleOpenChange = async (next: boolean) => {
    if (!next && step === "password") {
      await supabase.auth.signOut();
    }
    if (!next) {
      resetLocalState();
    }
    onOpenChange(next);
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("If this email is registered, a verification code was sent.");
    setStep("otp");
  };

  const verifyOtpAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Please enter the full code from your email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "email",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setStep("password");
  };

  const submitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }
    await supabase.auth.signOut();
    setLoading(false);
    toast.success("Password has been changed successfully. Please try to log in.");
    setStep("success");
  };

  const resendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("A new code was sent if this email is registered.");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "email" && "Reset password"}
            {step === "otp" && "Enter verification code"}
            {step === "password" && "Choose a new password"}
            {step === "success" && "Password updated"}
          </DialogTitle>
          <DialogDescription>
            {step === "email" && "Enter the email address for your account. We will send a one-time code."}
            {step === "otp" && `We sent a code to ${email.trim() || "your email"}. Enter it below.`}
            {step === "password" && "Set a new password for your account."}
            {step === "success" && "Your password has been changed successfully. Please try to log in."}
          </DialogDescription>
        </DialogHeader>

        {step === "email" && (
          <form onSubmit={sendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Registered email</Label>
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                {loading ? "Sending…" : "Send code"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtpAndContinue} className="space-y-4">
            <div className="space-y-2">
              <Label>One-time code</Label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="gap-1">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={resendOtp} disabled={loading}>
                Resend code
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Verifying…" : "Verify and continue"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={submitNewPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-new">New password</Label>
              <Input
                id="forgot-new"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="forgot-confirm">Confirm new password</Label>
              <Input
                id="forgot-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                {loading ? "Updating…" : "Change password"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "success" && (
          <DialogFooter>
            <Button type="button" className="w-full" onClick={() => handleOpenChange(false)}>
              Back to sign in
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
