import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import api from '../api';
import toast from 'react-hot-toast';

const statusColors = {
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings/my').then(({ data }) => setBookings(data));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      const { data } = await api.patch(`/bookings/${id}/cancel`);
      setBookings((prev) => prev.map((b) => b.id === id ? data : b));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  if (bookings.length === 0) return (
    <div className="text-center py-20 text-gray-400">No bookings yet.</div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex gap-4 p-5">
              <img src={b.roomImageUrl || 'https://placehold.co/120x80?text=Room'}
                alt={b.roomName} className="w-24 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{b.roomName}</p>
                    <p className="text-xs text-gray-400">Room {b.roomNumber}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>📅 {format(new Date(b.checkIn), 'MMM d')} → {format(new Date(b.checkOut), 'MMM d, yyyy')}</span>
                  <span>👥 {b.guests} guest{b.guests > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-lg">${b.totalPrice}</span>
                  {b.status === 'CONFIRMED' && (
                    <button onClick={() => handleCancel(b.id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg transition">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
            {b.specialRequests && (
              <div className="border-t border-stone-100 px-5 py-2 text-xs text-gray-400">
                Note: {b.specialRequests}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
