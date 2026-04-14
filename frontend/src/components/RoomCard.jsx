import { Link } from 'react-router-dom';

const typeColors = {
  STANDARD: 'bg-blue-100 text-blue-700',
  DELUXE: 'bg-purple-100 text-purple-700',
  SUITE: 'bg-yellow-100 text-yellow-700',
};

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="aspect-video overflow-hidden bg-stone-100">
        <img
          src={room.imageUrl || 'https://placehold.co/800x500?text=Room'}
          alt={room.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[room.type] || 'bg-gray-100 text-gray-600'}`}>
            {room.type}
          </span>
          <span className="text-xs text-gray-400">Room {room.roomNumber}</span>
        </div>
        <h3 className="font-bold text-lg">{room.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{room.description}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
          <span>👥 Up to {room.capacity} guests</span>
        </div>
        {room.amenities && (
          <p className="text-xs text-gray-400 mt-1 truncate">✓ {room.amenities}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">${room.pricePerNight}</span>
            <span className="text-sm text-gray-400"> / night</span>
          </div>
          <Link to={`/rooms/${room.id}`}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition">
            View & Book
          </Link>
        </div>
      </div>
    </div>
  );
}
