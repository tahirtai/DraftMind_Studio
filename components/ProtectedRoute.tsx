import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoadingScreen: React.FC = () => (
    <div className="h-screen w-full bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 animate-pulse">
                <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <p className="text-text-secondary text-sm">Loading...</p>
        </div>
    </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading, profile } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Wait for profile to load before rendering (prevents flash for soft-deleted users)
    if (!profile) {
        return <LoadingScreen />;
    }

    // Block soft-deleted users — redirect to recovery page
    if (profile.deleted_at || profile.status === 'deleted') {
        return <Navigate to="/account-recovery" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
