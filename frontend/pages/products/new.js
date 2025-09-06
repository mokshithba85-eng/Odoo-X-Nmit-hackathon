import { useState } from 'react';
import Router from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function NewProductForm(){
  const [title,setTitle]=useState('');
  const [category,setCategory]=useState('Furniture');
  const [desc,setDesc]=useState('');
  const [price,setPrice]=useState('');

  async function submit(e){
    e.preventDefault();
    const res = await fetch(`${API}/api/products`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      credentials:'include',
      body: JSON.stringify({ title, category, description: desc, price: parseFloat(price), imageUrl: '/placeholder.png' })
    });
    if (res.ok) Router.push('/my-listings');
    else {
      const data = await res.json();
      alert(data.error || 'Error');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Sell Your Eco-Friendly Product</h2>
          <p className="text-secondary">Help others discover sustainable alternatives</p>
        </div>
        <form onSubmit={submit} className="card p-8 grid gap-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Product Title</label>
            <input 
              className="input-field" 
              placeholder="e.g., Reclaimed Wood Coffee Table" 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Category</label>
            <select 
              className="input-field" 
              value={category} 
              onChange={e=>setCategory(e.target.value)}
            >
              <option>Furniture</option>
              <option>Clothing</option>
              <option>Electronics</option>
              <option>Books</option>
              <option>Home & Kitchen</option>
              <option>Sports</option>
              <option>Toys</option>
              <option>Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Description</label>
            <textarea 
              className="input-field h-24 resize-none" 
              placeholder="Describe your product's eco-friendly features, condition, and why it's sustainable..." 
              value={desc} 
              onChange={e=>setDesc(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Price (₹)</label>
            <input 
              className="input-field" 
              placeholder="0.00" 
              value={price} 
              onChange={e=>setPrice(e.target.value)} 
              type="number" 
              step="0.01" 
              min="0"
              required
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              type="submit"
              className="btn-primary flex-1"
            >
              List Your Product
            </button>
            <button 
              type="button"
              onClick={() => Router.push('/')}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewProduct() {
  return (
    <ProtectedRoute>
      <NewProductForm />
    </ProtectedRoute>
  );
}
