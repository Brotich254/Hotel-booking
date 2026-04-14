import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, differenceInDays } from 'date-fns';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RoomDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    checkIn: today,
    checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    guests: 1,
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/rooms/${id}`).then(({ data }) => setRoom(data));
  }, [id]);

  const nights = differenceInDays(new Date(form.checkOut), new Date(form.checkIn));
  const total = room ? (room.pricePerNight * Math.max(nights, 0)).toFixed(2) : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (nights < 1) { toast.error('Check-out must be after check-in'); return; }
    setLoading(true);
    try {
      await api.post('/bookings', {
        roomId: room.id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        specialRequests: form.specialRequests || null,
      });
      toast.success('Booking confirmed!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!room) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img src={room.imageUrl || 'https://placehold.co/800x500?text=Room'}
            alt={room.name} className="w-full rounded-2xl object-cover aspect-video" />
          <div className="mt-6">
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{room.type}</span>
            <h1 className="text-3xl font-bold mt-2">{room.name}</h1>
            <p className="text-gray-500 mt-3">{room.description}</p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>👥 Up to {room.capacity} guests</span>
              <span>🚪 Room {room.roomNumber}</span>
            </div>
            {room.amenities && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.split(',').map((a) => (
                    <span key={a} className="text-xs bg-stone-100 text-gray-600 px-2.5 py-1 rounded-full">{a.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking form */}
        <div>
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-3xl font-bold">${room.pricePerNight}</span>
              <span className="text-gray-400 text-sm">/ night</span>
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Check-in</label>
                  <input type="date" required value={form.checkIn} min={today}
                    onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Check-out</label>
                  <input type="date" required value={form.checkOut} min={form.checkIn}
                    onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Guests</label>
                <input type="number" min="1" max={room.capacity} value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Special Requests (optional)</label>
                <textarea rows={2} value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  placeholder="Early check-in, extra pillows..."
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>

              {nights > 0 && (
                <div className="bg-stone-50 rounded-xl p-3 text-sm space-y-1">
                  <div className="flex justify-between text-gray-500">
                    <span>${room.pricePerNight} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1 mt-1">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading || nights < 1}
                className="w-full bg-yellow-500 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50 transition">
                {loading ? 'Booking...' : user ? 'Reserve Now' : 'Login to Book'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
