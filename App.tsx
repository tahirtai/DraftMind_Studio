import React, { Suspense } from 'react';
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

// SEO Pages — lazy loaded for fast initial bundle
const Features = React.lazy(() => import('./views/seo/Features'));
const AIWriter = React.lazy(() => import('./views/seo/AIWriter'));
const AIWritingTool = React.lazy(() => import('./views/seo/AIWritingTool'));
const Templates = React.lazy(() => import('./views/seo/Templates'));
const UseCases = React.lazy(() => import('./views/seo/UseCases'));
const Blog = React.lazy(() => import('./views/seo/Blog'));
// Use-case pages
const ForStudents = React.lazy(() => import('./views/seo/use-cases/ForStudents'));
const ForBloggers = React.lazy(() => import('./views/seo/use-cases/ForBloggers'));
const ForMarketers = React.lazy(() => import('./views/seo/use-cases/ForMarketers'));
const ForContentCreators = React.lazy(() => import('./views/seo/use-cases/ForContentCreators'));
// Template pages
const BlogOutline = React.lazy(() => import('./views/seo/templates/BlogOutline'));
const EssayTemplate = React.lazy(() => import('./views/seo/templates/Essay'));
const LinkedInPost = React.lazy(() => import('./views/seo/templates/LinkedInPost'));
const ProductDescription = React.lazy(() => import('./views/seo/templates/ProductDescription'));
// Blog articles
const BestAIWritingTools = React.lazy(() => import('./views/seo/blog/BestAIWritingTools'));
const WriteFasterWithAI = React.lazy(() => import('./views/seo/blog/WriteFasterWithAI'));
const AIWritingPrompts = React.lazy(() => import('./views/seo/blog/AIWritingPrompts'));
const AIWritingForStudents = React.lazy(() => import('./views/seo/blog/AIWritingForStudents'));
const NotionVsAIWritingTools = React.lazy(() => import('./views/seo/blog/NotionVsAIWritingTools'));

const SEO: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Suspense fallback={<div className="min-h-screen bg-background-dark" />}>{children}</Suspense>
);

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/login" element={<Auth view="LOGIN" />} />
                        <Route path="/signup" element={<Auth view="SIGNUP" />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/update-password" element={<UpdatePassword />} />

                        {/* SEO Pages */}
                        <Route path="/features" element={<SEO><Features /></SEO>} />
                        <Route path="/ai-writer" element={<SEO><AIWriter /></SEO>} />
                        <Route path="/ai-writing-tool" element={<SEO><AIWritingTool /></SEO>} />
                        <Route path="/templates" element={<SEO><Templates /></SEO>} />
                        <Route path="/use-cases" element={<SEO><UseCases /></SEO>} />
                        <Route path="/blog" element={<SEO><Blog /></SEO>} />
                        {/* Use-case pages */}
                        <Route path="/ai-writer-for-students" element={<SEO><ForStudents /></SEO>} />
                        <Route path="/ai-writer-for-bloggers" element={<SEO><ForBloggers /></SEO>} />
                        <Route path="/ai-writer-for-marketers" element={<SEO><ForMarketers /></SEO>} />
                        <Route path="/ai-writer-for-content-creators" element={<SEO><ForContentCreators /></SEO>} />
                        {/* Template pages */}
                        <Route path="/blog-outline-template" element={<SEO><BlogOutline /></SEO>} />
                        <Route path="/essay-template" element={<SEO><EssayTemplate /></SEO>} />
                        <Route path="/linkedin-post-template" element={<SEO><LinkedInPost /></SEO>} />
                        <Route path="/product-description-template" element={<SEO><ProductDescription /></SEO>} />
                        {/* Blog articles */}
                        <Route path="/blog/best-ai-writing-tools" element={<SEO><BestAIWritingTools /></SEO>} />
                        <Route path="/blog/write-faster-with-ai" element={<SEO><WriteFasterWithAI /></SEO>} />
                        <Route path="/blog/ai-writing-prompts" element={<SEO><AIWritingPrompts /></SEO>} />
                        <Route path="/blog/ai-writing-for-students" element={<SEO><AIWritingForStudents /></SEO>} />
                        <Route path="/blog/notion-vs-ai-writing-tools" element={<SEO><NotionVsAIWritingTools /></SEO>} />

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