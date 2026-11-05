import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto shadow-soft-pink">
          <Heart className="w-8 h-8 fill-brand-200" />
        </div>
        <div>
          <h1 className="text-6xl font-extrabold text-brand-600">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">Page Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The page you are looking for might have been moved, removed, or is temporarily unavailable.
          </p>
        </div>
        <div className="pt-2 flex justify-center space-x-3">
          <Link
            to="/"
            className="gradient-pink-btn px-6 py-3 rounded-2xl font-bold text-xs shadow-soft-pink flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
