import React, { useState } from 'react';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
}

export function OTPVerification({ email, onVerify }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onVerify(otp);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        OTP Verification
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Please enter the verification code sent to <span className="font-semibold">{email}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
        >
          {loading ? (
            <svg
              className="w-5 h-5 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
              ></path>
            </svg>
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>
    </div>
  );
}