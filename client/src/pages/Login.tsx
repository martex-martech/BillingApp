import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/Authservice';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isOtpValid = /^\d{6}$/.test(otp);
  const isFormValid = isEmailValid && agreeToTerms;

  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify' && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, step]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please enter a valid email and agree to terms');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.sendOtp(email);
      setOtpId(response.otpId);
      setStep('verify');
      setSuccessMsg('OTP sent to your email!');
      setResendTimer(30);
      setCanResend(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpValid) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.verifyOtp(email, otp, otpId);
      if (response.success) {
        setSuccessMsg('OTP Verified! Redirecting...');
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.user.role);
        localStorage.setItem('userEmail', response.user.email);

        setTimeout(() => {
          const role = response.user.role;
          if (role === 'superadmin') {
            navigate('/superadmin/dashboard');
          } else if (role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/staff/dashboard');
          }
        }, 1000);
      } else {
        setError(response.message || 'OTP verification failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to verify OTP.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.sendOtp(email);
      setOtpId(response.otpId);
      setSuccessMsg('New OTP sent to your email!');
      setResendTimer(30);
      setCanResend(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (isLoading) return;
    const newOtp = otp.split('');
    newOtp[index] = value.replace(/\D/g, '');
    const joinedOtp = newOtp.join('').slice(0, 6);
    setOtp(joinedOtp);
    setError(null);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLoading) return;

    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light px-3 py-5">
      {isLoading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center z-3">
          <div className="spinner-border text-primary" />
        </div>
      )}

      <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '28rem', width: '100%' }}>
        <h1 className="text-center text-dark fw-bold mb-3">Ezo Admin Sign In</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {step === 'email' && (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                className={`form-control ${email && !isEmailValid ? 'is-invalid' : ''}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
              />
              {email && !isEmailValid && (
                <div className="invalid-feedback">Enter a valid email</div>
              )}
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                id="terms"
                className="form-check-input"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="terms" className="form-check-label">
                I agree to the terms and conditions.
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Sending...' : 'GET OTP'}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-3 text-center">
              <h5>Enter the 6-digit OTP sent to your email</h5>
              <div className="d-flex justify-content-center gap-2 my-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    className="form-control text-center"
                    style={{ width: '2.5rem', height: '2.5rem', fontSize: '1.2rem' }}
                    value={otp[index] || ''}
                    onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {canResend ? (
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-muted">Resend OTP in {resendTimer} sec</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={!isOtpValid || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
