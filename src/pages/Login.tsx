import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { MailIcon, LockIcon, AlertCircleIcon } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.29h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.15 3.58-8.63Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.86-3A7.17 7.17 0 0 1 12 19.34a7.2 7.2 0 0 1-6.75-4.96h-4v3.12A12 12 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.25 14.38a7.22 7.22 0 0 1 0-4.76V6.5h-4a12 12 0 0 0 0 11l4-3.12Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.66c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.08 15.24 0 12 0A12 12 0 0 0 1.25 6.5l4 3.12A7.2 7.2 0 0 1 12 4.66Z"
    />
  </svg>
);

const GithubMarkIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.01-.02-1.98-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.04-.71.08-.69.08-.69 1.16.08 1.77 1.2 1.77 1.2 1.02 1.76 2.69 1.25 3.35.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .96-.31 3.15 1.19.92-.26 1.9-.39 2.88-.39s1.96.13 2.88.39c2.19-1.5 3.15-1.19 3.15-1.19.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.05.78 2.12 0 1.54-.01 2.78-.01 3.16 0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12.02C23.5 5.66 18.35.5 12 .5Z"
    />
  </svg>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin, githubLogin } = useAuth();
  const navigate = useNavigate();
  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Email hoặc mật khẩu không hợp lệ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      setError('');

      if (!credentialResponse.credential) {
        throw new Error('Thiếu Google credential');
      }

      await googleLogin(credentialResponse.credential);
      
      navigate('/');
    } catch (err) {
      setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Đăng nhập Google thất bại');
  };

  const handleGoogleLoginClick = () => {
    const googleRealButton = googleButtonContainerRef.current?.querySelector('[role="button"]') as HTMLElement | null;
    if (!googleRealButton) {
      setError('Google OAuth chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }
    googleRealButton.click();
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      await githubLogin();
    } catch (err) {
      setIsLoading(false);
      setError('Đăng nhập GitHub thất bại. Vui lòng thử lại.');
    }
  };

  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Hoặc{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              tạo tài khoản mới
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <AlertCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              </div>
            </div>}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Địa chỉ email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="email@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="••••••••" />
              </div>
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Hoặc đăng nhập với
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleLoginClick}
              disabled={isLoading}
              className="w-[322px] max-w-full h-10 inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#dadce0] bg-white px-3 text-[16px] font-medium text-[#3c4043] shadow-none transition-colors hover:bg-[#f8f9fa] disabled:opacity-60 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <GoogleIcon />
              <span>Đăng nhập bằng Google</span>
            </button>
            <div ref={googleButtonContainerRef} className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-[322px] max-w-full h-10 inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#dadce0] bg-white px-3 text-[16px] font-medium text-[#3c4043] shadow-none transition-colors hover:bg-[#f8f9fa] disabled:opacity-60 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <GithubMarkIcon />
              <span>Đăng nhập bằng GitHub</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
