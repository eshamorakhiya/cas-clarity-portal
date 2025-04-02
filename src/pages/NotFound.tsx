
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cas-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-cas-primary">404</h1>
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-6">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/domains">
          <Button className="bg-cas-primary hover:bg-cas-dark">Return to Domain Selection</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
