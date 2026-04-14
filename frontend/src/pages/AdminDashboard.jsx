import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import api from '../api';

const statusColors = {
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings/admin/stats').then(({ data }) => setStats(data));
    api.get('/bookings/admin/all').then(({ data }) => setBookings(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-yellow-500">{stats.totalBookings}</p>
            <p className="text-sm text-gray-500 mt-1">Total Bookings</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-green-600">{stats.activeBookings}</p>
            <p className="text-sm text-gray-500 mt-1">Active Bookings</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-blue-600">${Number(stats.totalRevenue).toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
          </div>
        </div>
      )}

      <h2 className="text-lg font-bold mb-4">All Bookings</h2>
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Guest</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Room</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Dates</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Total</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-stone-50 transition">
                <td className="px-4 py-3">
                  <p className="font-medium">{b.guestName}</p>
                  <p className="text-xs text-gray-400">{b.guestEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{b.roomName}</p>
                  <p className="text-xs text-gray-400">#{b.roomNumber}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {format(new Date(b.checkIn), 'MMM d')} → {format(new Date(b.checkOut), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 font-semibold">${b.totalPrice}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
