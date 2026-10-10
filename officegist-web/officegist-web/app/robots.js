import { SITE } from '@/lib/format';
export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/me', '/admin', '/sign-in', '/api/'] }], sitemap: `${SITE}/sitemap.xml` };
}
