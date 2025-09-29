import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/auth/'],
    },
    sitemap: `${process.env.NEXTAUTH_URL || 'https://ok9-saas.com'}/sitemap.xml`,
  }
}