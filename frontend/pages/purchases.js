import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Purchases(){
  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    fetchOrders();
  }, []);

  async function fetchOrders(){
    const res = await fetch(`${API}/api/orders/me`, { credentials: 'include' });
    if (res.ok) setOrders(await res.json());
  }

  if (!isClient) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Previous Purchases</h2>
        <div className="grid gap-4">
          <div className="p-4 bg-white rounded shadow animate-pulse">
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Previous Purchases</h2>
      <div className="grid gap-4">
        {orders.length===0 && <div className="p-4 bg-white rounded shadow">No purchases yet</div>}
        {orders.map(o => (
          <div key={o._id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between">
              <div>Order on {new Date(o.createdAt).toLocaleString()}</div>
              <div className="font-semibold">₹{o.total}</div>
            </div>
            <div className="mt-2">
              {o.items.map(it => (
                <div key={it.productId} className="flex justify-between text-sm text-gray-700">
                  <div>{it.title} × {it.qty}</div>
                  <div>₹{(it.price*it.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
