import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProductDetail(){
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (id) fetchProduct();
  }, [id]);

  async function fetchProduct(){
    const res = await fetch(`${API}/api/products/${id}`);
    if (res.ok) setProduct(await res.json());
  }

  async function addToCart(){
    const res = await fetch(`${API}/api/cart`, { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({ productId: id, qty: 1 })});
    if (res.ok) alert('Added to cart'); else alert('Login required or error');
  }

  if (!isClient) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-gray-200 rounded px-3 py-1 mb-4 w-16 h-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-300 rounded p-6 flex items-center justify-center h-80 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="p-6">Loading...</div>;
  return (
    <div className="max-w-5xl mx-auto p-6">
      <button onClick={()=>router.back()} className="bg-gray-200 rounded px-3 py-1 mb-4">Back</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-bold rounded p-6 flex items-center justify-center h-80">
          {product.title}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <div className="text-sm text-gray-500">{product.category}</div>
          <h3 className="text-xl font-semibold mt-2">₹{product.price}</h3>
          <p className="mt-4">{product.description}</p>
          <button onClick={addToCart} className="bg-cyan-500 text-white rounded px-4 py-2 mt-4">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
