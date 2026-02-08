import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface AuthPageProps {
  onSignIn: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSignIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string, password?: string, confirmPassword?: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (isSignUp && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Placeholder: will connect to backend later
    console.log(isSignUp ? 'Sign up' : 'Sign in', { email, password });
    onSignIn();
  };

  const handleOAuthSignIn = (provider: string) => {
    // Placeholder: will connect to OAuth provider later
    console.log(`OAuth sign in with ${provider}`);
    onSignIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content">
              <FontAwesomeIcon icon={faStar} size="lg" />
            </div>
            <span className="text-2xl font-bold italic">Notes</span>
          </div>

          <h2 className="text-xl font-semibold text-center mb-6">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            <button 
              onClick={() => handleOAuthSignIn('google')}
              className="btn btn-outline gap-2"
            >
              <FontAwesomeIcon icon={faGoogle} size="lg" />
              Continue with Google
            </button>
            <button 
              onClick={() => handleOAuthSignIn('github')}
              className="btn btn-outline gap-2"
            >
              <FontAwesomeIcon icon={faGithub} size="lg" />
              Continue with GitHub
            </button>
          </div>

          <div className="divider text-xs">OR</div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="text-error text-xs mt-1">{errors.password}</span>}
            </div>

            {isSignUp && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <span className="text-error text-xs mt-1">{errors.confirmPassword}</span>}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full mt-2">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
              }}
              className="link link-primary"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
