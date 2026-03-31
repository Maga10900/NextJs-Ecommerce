"use client";

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (val: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!val) return 'Email is required.';
    if (!emailRegex.test(val)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Password is required.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  const handleBlur = (field: 'email' | 'password') => {
    const err = field === 'email' ? validateEmail(email) : validatePassword(password);
    setFieldErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check for all field errors
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    
    if (eErr || pErr) {
      setFieldErrors({ email: eErr, password: pErr });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error('Invalid email or password.');
      }

      const data = await res.json();
      // Store token
      localStorage.setItem('access_token', data.access_token);

      // Redirect based on role
      try {
        const profileRes = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          localStorage.setItem('current_user_id', String(profile.id));
          
          if (profile.role === 'admin') {
            router.push('/admin/products');
          } else {
            router.push('/home');
          }
        } else {
          router.push('/home');
        }
      } catch {
        router.push('/home');
      }
      
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen overflow-hidden flex flex-col lg:flex-row bg-[#FAFAFA] relative">
      
      {/* Left Column - Form (scrollable internally, never taller than viewport) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col px-8 sm:px-12 lg:px-16 xl:px-24 py-8 lg:py-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="shrink-0 mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#093A3E]">The Digital Curator</h1>
        </div>

        {/* Main Form Content */}
        <div className="max-w-md w-full mx-auto flex flex-col flex-grow justify-center">
          <h2 className="text-4xl font-bold text-[#093A3E] mb-3">Welcome back</h2>
          <p className="text-[#618D80] mb-8 text-base">
            Please enter your details to access your collection.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                }}
                onBlur={() => handleBlur('email')}
                className={`w-full bg-[#A7EBD5]/40 text-[#0B5141] placeholder-[#4f7f6f] px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all ${
                  fieldErrors.email ? 'ring-2 ring-red-400 bg-red-50/10' : ''
                }`}
                placeholder="Email address"
                required
              />
              {fieldErrors.email && (
                <p className="mt-1.5 ml-1 text-xs font-bold text-red-500 animate-fade-in">{fieldErrors.email}</p>
              )}
            </div>
            
            <div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                onBlur={() => handleBlur('password')}
                className={`w-full bg-[#A7EBD5]/40 text-[#0B5141] placeholder-[#4f7f6f] px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all ${
                  fieldErrors.password ? 'ring-2 ring-red-400 bg-red-50/10' : ''
                }`}
                placeholder="Password"
                required
                minLength={8}
              />
              {fieldErrors.password && (
                <p className="mt-1.5 ml-1 text-xs font-bold text-red-500 animate-fade-in">{fieldErrors.password}</p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" className="custom-checkbox" />
                <span className="text-sm font-medium text-[#618D80] group-hover:text-[#0B5141] transition-colors">Remember me</span>
              </label>
              
              <Link href="#" className="text-sm font-medium text-[#7D5A46] hover:text-[#5E4233] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[#0B5141] text-white py-4 rounded-xl font-medium shadow-lg hover:bg-[#084033] hover-lift transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs tracking-wider text-gray-400 font-medium uppercase">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center space-x-3 bg-[#EAEBF5] text-[#2c2d43] py-4 rounded-xl font-medium shadow-sm hover:bg-[#d8d9e6] hover-lift transition-all"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" className="opacity-90">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" fill="#4285f4"/>
                <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C12.19,19.27 15.19,19.27 18.69,13.83" fill="#34a853"/>
                <path d="M12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C12.1,2 16.56,2 19,4.72" fill="#ea4335"/>
                <path d="M5,12C5,7.9 8.2,4.73 12.2,4.73C12.2,4.73 8.2,4.73 5,12" fill="#fbbc05"/>
              </g>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="mt-7 text-center text-sm">
            <span className="text-[#618D80]">Don&apos;t have an account? </span>
            <Link href="/register" className="font-semibold text-[#0B5141] hover:underline">
              Create account
            </Link>
          </div>
        </div>

      </div>

      {/* Right Column — fills exactly the full screen height */}
      <div className="hidden lg:flex w-1/2 h-full gradient-bg items-center justify-center p-10 overflow-hidden">
        
        {/* Main Card */}
        <div className="relative w-full max-w-[400px] xl:max-w-[460px] bg-white rounded-[2rem] shadow-2xl overflow-visible hover-lift z-10 p-2 pb-0 flex flex-col" style={{height: 'min(580px, calc(100vh - 5rem))'}}>
          
          {/* Inner image container — grows to fill available height */}
          <div className="relative w-full min-h-0 flex-grow rounded-t-[1.75rem] rounded-b-xl overflow-hidden bg-[#5f7470]">
            <img
              src="/assets/image.png"
              alt="Model demonstrating modern style"
              className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply"
            />
            <div className="absolute top-8 right-8 text-right text-white/80 font-serif leading-tight">
              <p className="text-xl">L a i c [ e l r o i t |</p>
              <p className="text-xl mt-1">] o n l i G a v a n I</p>
              <p className="text-xl mt-1">s a f e i g n o l e</p>
              <p className="text-xl mt-1">s g d / e a t w o r k</p>
            </div>
          </div>

          {/* Text underneath the image */}
          <div className="pt-5 pb-6 px-6 sm:px-8 bg-white rounded-b-[1.75rem] shrink-0">
            <span className="inline-block bg-[#D2FAEF] text-[#0B5141] text-[10px] xl:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Curated Collection
            </span>
            <h2 className="text-2xl xl:text-3xl font-bold text-[#093A3E] leading-tight mb-3">
              Articulating the future of<br/>personal style.
            </h2>
            <div className="w-full h-px bg-gray-100 flex items-center">
              <span className="text-[10px] xl:text-xs text-slate-400 pl-4 bg-white -ml-4 rounded-r-md">Joined the curation this week</span>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}
