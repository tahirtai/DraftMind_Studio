export enum AppView {
    LANDING = 'LANDING',
    LOGIN = 'LOGIN',
    SIGNUP = 'SIGNUP',
    DASHBOARD = 'DASHBOARD',
    PROJECTS = 'PROJECTS',
    EDITOR = 'EDITOR',
    ANALYTICS = 'ANALYTICS',
    SETTINGS = 'SETTINGS',
    BILLING = 'BILLING',
}

export interface User {
    name: string;
    email: string;
    avatarUrl: string;
    plan: 'Pro' | 'Team' | 'Free';
}

export interface Project {
    id: string;
    title: string;
    description: string;
    status: 'Draft' | 'Review' | 'Final' | 'Idea' | 'Published' | 'Archived';
    lastEdited: string;
    author: {
        name: string;
        avatar: string;
    };
    type: 'blog' | 'email' | 'social' | 'landing' | 'video';
}