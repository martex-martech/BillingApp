import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/Authservice';

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
        setTimeout(() => {
          navigate('/dashboard');
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
    <div className="min-vh-100 bg-light d-flex flex-column justify-content-center py-5 px-3 position-relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(2px)',
            zIndex: 1000
          }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="mx-auto w-100" style={{ maxWidth: '28rem' }}>
        <h1 className="text-center display-5 fw-bold text-dark mb-2">Ezo Admin Sign In</h1>
        <h2 className="text-center fs-4 fw-semibold text-secondary mb-5">Login</h2>

        <div className="bg-white p-4 shadow rounded-3 border-top border-primary border-4 position-relative">
          {/* Disable all interactions when loading */}
          {isLoading && (
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 100 }} />
          )}

          {error && <div className="alert alert-danger">{error}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          {step === 'email' && (
            <form onSubmit={handleSendOTP}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label text-secondary">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${email && !isEmailValid ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  autoComplete='off'
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  disabled={isLoading}
                />
                {email && !isEmailValid && (
                  <div className="invalid-feedback">Please enter a valid email address</div>
                )}
              </div>

              <div className="mb-4 form-check">
                <input
                  type="checkbox"
                  id="terms"
                  className={`form-check-input me-2 ${!agreeToTerms && isEmailValid ? 'is-invalid' : ''}`}
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="form-check-label text-secondary">
                  I agree to the terms and conditions.<span className="text-danger">*</span>
                </label>
                {!agreeToTerms && isEmailValid && (
                  <div className="invalid-feedback d-block">You must agree to the terms</div>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-100 btn ${isFormValid ? 'btn-primary' : 'btn-secondary'}`}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Sending...
                  </>
                ) : (
                  'GET OTP'
                )}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-4 text-center">
                <h3 className="mb-3">Enter OTP Code</h3>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      className={`form-control text-center otp-input ${otp.length === index ? 'active' : ''}`}
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      id={`otp-${index}`}
                      style={{
                        width: '3rem',
                        height: '3rem',
                        fontSize: '1.5rem',
                        padding: '0.5rem',
                        border: '1px solid #ced4da',
                        borderRadius: '0.375rem'
                      }}
                      disabled={isLoading}
                    />
                  ))}
                </div>
                <p className="text-muted">Enter the 6-digit code sent to your email</p>

                <div className="mt-3">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="btn btn-link p-0"
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-muted small">
                      Resend OTP in {resendTimer} seconds
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-100 btn btn-primary py-2"
                disabled={isLoading || !isOtpValid}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Verifying...
                  </>
                ) : (
                  'VERIFY OTP'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .otp-input {
          transition: all 0.3s ease;
        }
        .otp-input:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          outline: 0;
        }
        .otp-input.active {
          border-color: #86b7fe;
        }
      `}</style>
    </div>
  );
};

export default Login;