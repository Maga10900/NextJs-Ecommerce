"use client";

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarObj, setAvatarObj] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; avatar?: string }>({});

  const validateName = (val: string) => {
    if (!val) return 'Full name is required.';
    if (val.length < 3) return 'Name must be at least 3 characters.';
    return '';
  };

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

  const handleBlur = (field: 'name' | 'email' | 'password') => {
    let err = '';
    if (field === 'name') err = validateName(name);
    else if (field === 'email') err = validateEmail(email);
    else if (field === 'password') err = validatePassword(password);
    
    setFieldErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    const nErr = validateName(name);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const aErr = !avatarObj ? 'Please select an avatar image.' : '';

    if (nErr || eErr || pErr || aErr) {
      setFieldErrors({ name: nErr, email: eErr, password: pErr, avatar: aErr });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload Avatar
      const formData = new FormData();
      formData.append('file', avatarObj!);

      const fileRes = await fetch('https://api.escuelajs.co/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!fileRes.ok) throw new Error('Failed to upload avatar image.');
      const fileData = await fileRes.json();
      const avatarUrl = fileData.location;

      // 2. Register Account
      const userRes = await fetch('https://api.escuelajs.co/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'customer',
          avatar: avatarUrl
        })
      });

      if (!userRes.ok) {
        throw new Error('Registration failed. Ensure your email is unique and details are correct.');
      }

      setSuccessMessage('Account created successfully! You can now sign in.');
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
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
          <h2 className="text-4xl font-bold text-[#093A3E] mb-3">Create account</h2>
          <p className="text-[#618D80] mb-8 text-base">
            Join the curation. Enter your details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                }}
                onBlur={() => handleBlur('name')}
                className={`w-full bg-[#A7EBD5]/40 text-[#0B5141] placeholder-[#4f7f6f] px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all ${
                  fieldErrors.name ? 'ring-2 ring-red-400 bg-red-50/10' : ''
                }`}
                placeholder="Full Name"
                required
                minLength={3}
              />
              {fieldErrors.name && (
                <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 animate-fade-in">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                }}
                onBlur={() => handleBlur('email')}
                className={`w-full bg-[#A7EBD5]/40 text-[#0B5141] placeholder-[#4f7f6f] px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all ${
                  fieldErrors.email ? 'ring-2 ring-red-400 bg-red-50/10' : ''
                }`}
                placeholder="Email address"
                required
              />
              {fieldErrors.email && (
                <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 animate-fade-in">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                onBlur={() => handleBlur('password')}
                className={`w-full bg-[#A7EBD5]/40 text-[#0B5141] placeholder-[#4f7f6f] px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all ${
                  fieldErrors.password ? 'ring-2 ring-red-400 bg-red-50/10' : ''
                }`}
                placeholder="Password"
                required
                minLength={8}
              />
              {fieldErrors.password && (
                <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 animate-fade-in">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatarObj(file);
                    setFieldErrors(prev => ({ ...prev, avatar: '' }));
                  }
                }}
                className={`w-full text-sm text-[#0B5141] bg-[#A7EBD5]/40 rounded-xl px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#A7EBD5] transition-all
                  file:mr-4 file:py-1.5 file:px-4 file:rounded-lg
                  file:border-0 file:text-xs file:font-bold
                  file:bg-[#0B5141] file:text-white file:cursor-pointer
                  hover:file:bg-[#084033] file:transition-colors cursor-pointer ${
                    fieldErrors.avatar ? 'ring-2 ring-red-400 bg-red-50/10' : ''
                  }`}
                required
              />
              {fieldErrors.avatar && (
                <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 animate-fade-in">{fieldErrors.avatar}</p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <div className="flex items-center pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" className="custom-checkbox" required />
                <span className="text-sm font-medium text-[#618D80] group-hover:text-[#0B5141] transition-colors">
                  I agree to the Terms &amp; Privacy Policy
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[#0B5141] text-white py-4 rounded-xl font-medium shadow-lg hover:bg-[#084033] hover-lift transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing Up...' : 'Sign Up →'}
            </button>
          </form>

          <div className="mt-7 text-center text-sm">
            <span className="text-[#618D80]">Already have an account? </span>
            <Link href="/" className="font-semibold text-[#0B5141] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column — fills exactly the full screen height */}
      <div className="hidden lg:flex w-1/2 h-full gradient-bg items-center justify-center p-10 overflow-hidden">

        {/* Main Card */}
        <div
          className="relative w-full max-w-[400px] xl:max-w-[460px] bg-white rounded-[2rem] shadow-2xl overflow-visible hover-lift z-10 p-2 pb-0 flex flex-col"
          style={{ height: 'min(580px, calc(100vh - 5rem))' }}
        >
          {/* Inner image container */}
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
              Articulating the future of<br />personal style.
            </h2>
            <div className="w-full h-px bg-gray-100 flex items-center">
              <span className="text-[10px] xl:text-xs text-slate-400 pl-4 bg-white -ml-4 rounded-r-md">Joined the curation this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#093A3E]/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="w-16 h-16 bg-[#E4FBF3] text-[#0B5141] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#093A3E] mb-2">Success</h3>
            <p className="text-sm font-medium text-[#618D80] mb-6">{successMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage('');
                router.push('/');
              }}
              className="w-full py-3 text-sm font-bold text-white bg-[#0B5141] rounded-xl hover:bg-[#084033] shadow-md transition-colors hover-lift"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
