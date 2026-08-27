import { useEffect } from 'react';
import { useLocation } from 'react-router';

const DEFAULT_BASE_URL = 'https://gsportstrade.com';
const DEFAULT_IMAGE = `${DEFAULT_BASE_URL}/og-banner.jpg`;
const SITE_NAME = 'Global Sports Trade';

/**
 * Universal SEO component that updates document head meta tags,
 * canonical links, Open Graph, Twitter Cards, and JSON-LD structured data.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  twitterCard = 'summary_large_image',
  noindex = false,
  jsonLd,
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title
      ? title.includes(SITE_NAME)
        ? title
        : `${title} | ${SITE_NAME}`
      : `${SITE_NAME} | AI-Powered Sports Predictions & Analytics`;

    document.title = formattedTitle;

    // Helper to create or update meta tags
    const setMetaTag = (attributeName, attributeValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to create or update link tags (e.g. canonical)
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    const defaultDescription =
      "Daily AI-analyzed sports predictions and fixture analytics with 94%+ safety threshold. High-confidence picks, tactical data, and independent statistical models.";
    const metaDescription = description || defaultDescription;

    setMetaTag('name', 'description', metaDescription);
    setMetaTag(
      'name',
      'keywords',
      keywords ||
        'AI sports predictions, football analytics, match predictions, betting tips AI, soccer analytics, sports forecasting, GST predictions'
    );
    setMetaTag('name', 'author', SITE_NAME);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 3. Canonical URL
    const fullCanonicalUrl = canonical || `${DEFAULT_BASE_URL}${pathname === '/' ? '' : pathname}`;
    setLinkTag('canonical', fullCanonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:url', fullCanonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:image:secure_url', ogImage);
    setMetaTag('property', 'og:image:type', 'image/jpeg');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', metaDescription);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    let scriptElement = document.getElementById('dynamic-json-ld');
    if (jsonLd) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = 'dynamic-json-ld';
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(jsonLd);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Cleanup custom JSON-LD script on unmount
      const existingScript = document.getElementById('dynamic-json-ld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, keywords, canonical, ogType, ogImage, twitterCard, noindex, jsonLd, pathname]);

  return null;
}

