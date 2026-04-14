import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          🏨 <span className="text-yellow-400">LuxStay</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link to="/" className="text-gray-300 hover:text-white transition">Rooms</Link>
          {user && <Link to="/bookings" className="text-gray-300 hover:text-white transition">My Bookings</Link>}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition">Admin</Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs">{user.name}</span>
              <button onClick={logout} className="text-gray-400 hover:text-red-400 transition">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="bg-yellow-500 text-gray-900 px-4 py-1.5 rounded-lg font-semibold hover:bg-yellow-400 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
