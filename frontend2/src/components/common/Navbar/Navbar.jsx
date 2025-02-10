import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar fixed w-full top-0 z-50">
      <div className="navbar-container container mx-auto px-6 py-4 flex items-center justify-between">
        {/* App Name - Leftmost Corner */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-all pr-5">
          AirAware
        </Link>

        {/* Navigation Links - Rightmost Corner */}
        <div className="flex items-center space-x-6">
          <Link
            to="/signup"
            className="text-gray-700 hover:text-blue-600 transition-all font-medium"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;