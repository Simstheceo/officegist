const API = process.env.API_URL || 'http://localhost:4000';

/** @type {import('next').NextConfig} */
export default {
  poweredByHeader: false,
  // Browser calls /api/* on this origin and Next proxies to the API. That keeps the session cookie first-party
  // and means the API's CSRF origin check sees this site's origin (set the API's APP_ORIGIN to it).
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API}/api/:path*` },
      { source: '/sitemap.xml', destination: `${API}/api/sitemap.xml` },
    ];
  },
};
