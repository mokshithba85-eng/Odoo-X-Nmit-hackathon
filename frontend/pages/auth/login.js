import { useState } from 'react';
import Router from 'next/router';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Login(){
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [username, setUsername] = useState('');

  async function submit(e){
    e.preventDefault();
    const url = `${API}/api/auth/${mode === 'login' ? 'login' : 'register'}`;
    const body = mode === 'login' ? { email, password: pass } : { email, password: pass, username };
    const res = await fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body), credentials: 'include' });
    const data = await res.json();
    if (res.ok) Router.push('/');
    else alert(data.error || 'Error');
  }

  return (
    <div className="min-h-screen bg-eco-gradient-light dark:bg-eco-gradient-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-eco-green-500 to-eco-blue-500 bg-clip-text text-transparent mb-2">
            ECOFINDS
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Sustainable Marketplace</p>
        </div>
        
        <form onSubmit={submit} className="card p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-primary">
            {mode==='login' ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          
          {mode==='signup' && (
            <input 
              className="input-field mb-4" 
              placeholder="Username" 
              value={username} 
              onChange={e=>setUsername(e.target.value)} 
              required
            />
          )}
          
          <input 
            className="input-field mb-4" 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required
          />
          
          <input 
            className="input-field mb-6" 
            type="password" 
            placeholder="Password" 
            value={pass} 
            onChange={e=>setPass(e.target.value)} 
            required
          />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="btn-primary flex-1" 
              type="submit"
            >
              {mode==='login' ? 'Login' : 'Sign up'}
            </button>
            <button 
              type="button" 
              onClick={()=>setMode(mode==='login'?'signup':'login')} 
              className="btn-outline flex-1"
            >
              {mode==='login' ? 'Sign up' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
