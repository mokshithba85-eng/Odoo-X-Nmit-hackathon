import { useEffect, useState } from 'react';
import ChatButton from '../components/ChatButton';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function CartPageContent(){
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchCart();
  }, []);

  async function fetchCart(){
    const res = await fetch(`${API}/api/cart`, { credentials: 'include' });
    if (res.ok) setCart(await res.json());
  }

  async function checkout(){
    const res = await fetch(`${API}/api/cart/checkout`, { method:'POST', credentials: 'include' });
    if (res.ok) { alert('Order created'); fetchCart(); } else alert('Error or login required');
  }

  if (!isClient) {
    return (
      <div>
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          <div className="grid gap-4">
            <div className="p-4 bg-white rounded shadow animate-pulse">
              <div className="h-16 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      <div className="grid gap-4">
        {cart.items.map(it => (
          <div key={it._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-24 h-16 bg-gradient-to-r from-purple-500 to-cyan-400 rounded flex items-center justify-center text-white font-bold">{it.productId.title}</div>
              <div>
                <div className="font-semibold">{it.productId.title}</div>
                <div className="text-sm text-gray-500">₹{it.productId.price} × {it.qty}</div>
              </div>
            </div>
            <div className="font-semibold">₹{(it.productId.price * it.qty).toFixed(2)}</div>
          </div>
        ))}
        <div className="p-4 bg-white rounded shadow">
          <div className="flex justify-between"><div className="text-sm text-gray-500">Subtotal</div><div className="font-semibold">₹{cart.subtotal?.toFixed(2)}</div></div>
          <div className="mt-4"><button onClick={checkout} className="bg-cyan-500 text-white px-4 py-2 rounded">Checkout</button></div>
        </div>
      </div>
      <ChatButton />
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartPageContent />
    </ProtectedRoute>
  );
}
