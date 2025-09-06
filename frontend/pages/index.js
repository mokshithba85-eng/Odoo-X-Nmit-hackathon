import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import ChatButton from "../components/ChatButton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function ProductCard({ p }) {
  return (
    <div className="card p-4 group hover:scale-105 transition-transform duration-300">
      <div className="aspect-video eco-gradient flex items-center justify-center text-white font-bold rounded-md mb-3 group-hover:shadow-lg transition-shadow duration-300">
        {p.title.split(" ").slice(0, 2).join(" ")}
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary text-sm sm:text-base truncate">
            {p.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {p.category}
          </p>
          {p.description && (
            <p className="text-xs text-secondary mt-2 line-clamp-2">
              {p.description}
            </p>
          )}
        </div>
        <div className="text-right ml-2">
          <div className="font-bold text-eco-green-600 dark:text-eco-green-400 text-sm sm:text-base">
            ₹{p.price}
          </div>
          <Link 
            href={`/products/${p._id}`} 
            className="text-xs sm:text-sm text-eco-blue-600 dark:text-eco-blue-400 hover:text-eco-blue-700 dark:hover:text-eco-blue-300 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Feed() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchProducts();
    }
  }, [q, category, isClient]);

  async function fetchProducts() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const res = await fetch(`${API}/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data.products || []);
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              placeholder="Search eco-friendly products..."
              className="flex-1 border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              disabled
            />
            <select 
              className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" 
              disabled
            >
              <option value="">All categories</option>
            </select>
            <button 
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-6 py-3 font-medium transition-colors" 
              disabled
            >
              Search
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 animate-pulse border border-gray-200 dark:border-slate-700">
                <div className="aspect-video bg-gray-300 dark:bg-slate-600 rounded-md mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Eco-Friendly Products
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Shop sustainable, buy second-hand, and make a positive impact on the environment
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search eco-friendly products..."
            className="input-field flex-1"
          />
          <select
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            <option>Furniture</option>
            <option>Clothing</option>
            <option>Electronics</option>
            <option>Books</option>
            <option>Home & Kitchen</option>
            <option>Sports</option>
            <option>Toys</option>
            <option>Other</option>
          </select>
          <button
            onClick={fetchProducts}
            className="btn-primary px-6 py-3"
          >
            Search
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Floating Action Buttons */}
        <Link
          href="/products/new"
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 eco-gradient text-white flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all duration-300 z-40 hover:scale-110"
          title="Sell Product"
        >
          +
        </Link>
        
        <ChatButton />
      </main>
    </div>
  );
}
