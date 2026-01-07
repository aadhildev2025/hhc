import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
    const siteName = 'HomeHeartCreation';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDescription = 'Handcrafted treasures that turn a house into a warm, artistic home. Discover unique wall art, planters, and personalized gifts in Sri Lanka.';
    const defaultKeywords = 'handmade gifts, home decor Sri Lanka, handcrafted art, personalized gifts, wall art, planters';
    const siteUrl = 'https://homeheartcreation.com'; // Replace with final domain if known
    const defaultImage = `${siteUrl}/og-image.png`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="author" content="HomeHeartCreation" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />

            {/* Canonical Link */}
            <link rel="canonical" href={url ? `${siteUrl}${url}` : siteUrl} />
        </Helmet>
    );
};

export default SEO;
