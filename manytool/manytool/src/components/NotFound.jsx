// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="text-center py-20">
    <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
    <p className="text-gray-500 mb-8">Page not found!</p>
    <Link to="/" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Go Home</Link>
  </div>
);
export default NotFound;