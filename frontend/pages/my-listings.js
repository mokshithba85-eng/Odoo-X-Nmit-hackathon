import { useEffect, useState } from "react";
import Link from "next/link";
import ChatButton from "../components/ChatButton";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function MyListingsContent() {
  const [listings, setListings] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchListings();
  }, []);

  async function fetchListings() {
    const res = await fetch(`${API}/api/users/me/products`, {
      credentials: "include",
    });
    if (res.ok) setListings(await res.json());
    else setListings([]);
  }

  async function remove(id) {
    if (!confirm("Delete listing?")) return;
    await fetch(`${API}/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchListings();
  }

  if (!isClient) {
    return (
      <div>
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Listings</h2>
            <div className="bg-indigo-600 text-white px-3 py-2 rounded animate-pulse">
              + Add
            </div>
          </div>
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Listings</h2>
        <Link href="/products/new" className="bg-indigo-600 text-white px-3 py-2 rounded">
          + Add
        </Link>
      </div>
      <div className="grid gap-4">
        {listings.length === 0 && (
          <div className="p-4 bg-white rounded shadow">No listings yet</div>
        )}
        {listings.map((l) => (
          <div
            key={l._id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div className="flex gap-4 items-center">
              <div className="w-24 h-16 bg-gradient-to-r from-purple-500 to-cyan-400 rounded flex items-center justify-center text-white font-bold">
                {l.title.split(" ").slice(0, 2).join(" ")}
              </div>
              <div>
                <div className="font-semibold">{l.title}</div>
                <div className="text-sm text-gray-500">₹{l.price}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/products/${l._id}`} className="text-cyan-600">
                View
              </Link>
              <button
                onClick={() => remove(l._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ChatButton />
      </div>
    </div>
  );
}

export default function MyListings() {
  return (
    <ProtectedRoute>
      <MyListingsContent />
    </ProtectedRoute>
  );
}
