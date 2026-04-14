import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import api from '../api';
import RoomCard from '../components/RoomCard';

export default function Home() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [type, setType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [rooms, setRooms] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load all rooms on mount
  useEffect(() => {
    api.get('/rooms').then(({ data }) => setRooms(data));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.get('/rooms/available', {
        params: { checkIn, checkOut, type: type || undefined, capacity: capacity || undefined },
      });
      setRooms(data);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">Find Your Perfect Stay</h1>
          <p className="text-gray-400 mb-8">Luxury rooms, seamless booking.</p>

          <form onSubmit={handleSearch} className="bg-white text-gray-900 rounded-2xl p-4 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-gray-500 block mb-1">Check-in</label>
              <input type="date" value={checkIn} min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-gray-500 block mb-1">Check-out</label>
              <input type="date" value={checkOut} min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div className="min-w-[120px]">
              <label className="text-xs text-gray-500 block mb-1">Room Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <option value="">Any</option>
                <option value="STANDARD">Standard</option>
                <option value="DELUXE">Deluxe</option>
                <option value="SUITE">Suite</option>
              </select>
            </div>
            <div className="min-w-[100px]">
              <label className="text-xs text-gray-500 block mb-1">Guests</label>
              <input type="number" min="1" max="10" value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Any"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50 transition">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Rooms */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-6">
          {searched ? `${rooms.length} available rooms` : 'All Rooms'}
        </h2>
        {rooms.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No rooms available for selected dates.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((r) => <RoomCard key={r.id} room={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
