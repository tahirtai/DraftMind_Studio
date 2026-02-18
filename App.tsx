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
import Profile from './views/Profile';
import UpdatePassword from './views/UpdatePassword';
import About from './views/About';
import Billing from './views/Billing';
import Pricing from './views/Pricing';
import AuthCallback from './views/AuthCallback';

import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/pricing" element={<Pricing />} /> {/* Added public Pricing route */}
                        <Route path="/login" element={<Auth view="LOGIN" />} />
                        <Route path="/signup" element={<Auth view="SIGNUP" />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/update-password" element={<UpdatePassword />} />

                        {/* Protected Dashboard Layout Routes */}
                        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/:id" element={<ProjectDetails />} />
                            {/* Editor route moved to standalone to hide sidebar */}
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/profile" element={<Profile />} />
                            {/* Removed the old protected /pricing route */}
                            <Route path="/billing" element={<Billing />} />
                        </Route>

                        {/* Protected Standalone Editor Route */}
                        <Route path="/editor/:docId" element={<ProtectedRoute><Editor /></ProtectedRoute>} />

                        {/* Redirects */}
                        <Route path="/editor" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;