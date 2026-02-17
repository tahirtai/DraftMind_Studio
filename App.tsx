import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './views/Landing';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import Projects from './views/Projects';
import Editor from './views/Editor';
import Analytics from './views/Analytics';
import Settings from './views/Settings';
import ProjectDetails from './views/ProjectDetails';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Auth view="LOGIN" />} />
                    <Route path="/signup" element={<Auth view="SIGNUP" />} />

                    {/* Protected Dashboard Layout Routes */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<ProjectDetails />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Route>

                    {/* Protected Standalone Editor Route */}
                    <Route path="/editor/:docId" element={<ProtectedRoute><Editor /></ProtectedRoute>} />

                    {/* Redirects */}
                    <Route path="/editor" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;