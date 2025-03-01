import React from 'react';
import { Link } from 'react-router-dom';
import { Guitar as Hospital } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Hospital className="h-8 w-8 mr-2" />
            <Link to="/" className="text-xl font-bold">Bed Management</Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Dashboard
            </Link>
            <Link to="/admit" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Admit Patient
            </Link>
            <Link to="/patients" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Patient List
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;