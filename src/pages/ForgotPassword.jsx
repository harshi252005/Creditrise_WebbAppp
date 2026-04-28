import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fallbackOtp, setFallbackOtp] = useState('');
  
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.forgotPassword(email);
      // Backend returns 200 even if email fails, providing otp_fallback for dev
      if (response.data.otp_fallback) {
        setFallbackOtp(response.data.otp_fallback);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "User not found or server error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.verifyOtp({ email, otp });
      setStep(3);
    } catch (err) {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword({ email, new_password: newPassword, confirm_password: confirmPassword });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0A122A]">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="bg-primary/20 p-4 rounded-2xl mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {step === 4 ? 'All Set!' : 'Reset Password'}
          </h1>
          <p className="text-slate-400 text-center">
            {step === 1 && "Enter your email to receive a recovery OTP"}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && "Create a secure new password for your account"}
            {step === 4 && "Your password has been successfully updated"}
          </p>
        </div>

        {error && (
          <div className="bg-risk/10 border border-risk/20 text-risk text-sm p-4 rounded-xl">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-primary" size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="demo@creditrise.com"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all flex items-center justify-center space-x-3"
            >
              {loading ? <RefreshCcw className="animate-spin" /> : "SEND OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Verification Code</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full px-4 py-6 bg-slate-800/50 border border-slate-700 rounded-2xl text-white text-center text-4xl font-black tracking-[0.5em] focus:outline-none focus:border-primary transition-all"
                placeholder="000000"
                required
              />
            </div>
            {fallbackOtp && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">Developer Fallback Mode</p>
                <p className="text-white font-bold italic">SMTP limit reached. Use code: <strong className="text-amber-500">{fallbackOtp}</strong></p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all"
            >
              {loading ? <RefreshCcw className="animate-spin duration-1000" /> : "VERIFY & CONTINUE"}
            </button>
            <p className="text-center text-slate-500 text-sm italic font-medium">
              Didn't get the code? <button type="button" className="text-primary font-bold hover:underline" onClick={handleSendOtp}>Resend</button>
            </p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-primary" size={20} />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-primary" size={20} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all"
            >
              {loading ? <RefreshCcw className="animate-spin" /> : "RESET PASSWORD"}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="space-y-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-secondary/20 text-secondary rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={48} />
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-xl"
            >
              PROCEED TO SIGN IN
            </button>
          </div>
        )}

        {step !== 4 && (
          <div className="text-center">
            <Link to="/login" className="text-slate-500 text-sm font-bold hover:text-white transition-colors">
              Return to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
