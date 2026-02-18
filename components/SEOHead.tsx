import { useEffect } from 'react';

interface SEOHeadProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
}

/**
 * Sets document title, meta description, and OG tags via DOM manipulation.
 * No extra dependencies — works with Vite SSR-free setup.
 */
const SEOHead: React.FC<SEOHeadProps> = ({ title, description, canonical, ogImage }) => {
    useEffect(() => {
        const baseUrl = 'https://draft-mind-studio.vercel.app';
        const image = ogImage || `${baseUrl}/logo.png`;

        document.title = title;

        const setMeta = (attr: string, key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('name', 'description', description);
        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:image', image);
        setMeta('property', 'og:url', canonical || baseUrl);
        setMeta('property', 'og:type', 'website');
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', title);
        setMeta('name', 'twitter:description', description);
        setMeta('name', 'twitter:image', image);

        // Canonical link
        if (canonical) {
            let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }
            link.setAttribute('href', canonical);
        }

        return () => {
            document.title = 'DraftMind | AI-Powered Writing Workspace for Creators';
        };
    }, [title, description, canonical, ogImage]);

    return null;
};

export default SEOHead;
