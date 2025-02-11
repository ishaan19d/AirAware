import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="navbar fixed w-full top-0 z-50">
      <div className="navbar-container container mx-auto px-6 py-4 flex items-center justify-between">
        {/* App Name - Leftmost Corner */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-all pr-5">
          AirAware
        </Link>    
      </div>
    </nav>
  );
}

export default Navbar;