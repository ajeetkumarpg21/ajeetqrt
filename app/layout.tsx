import type { Metadata } from 'next'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ajeet Kumar | Quant Finance & Financial Engineering',
  description: 'MSc Financial Engineering (WorldQuant University) · M.Tech CSE (NSUT Delhi) · Python · ML · Portfolio Optimization',
  keywords: 'Ajeet Kumar, Quant Finance, Financial Engineering, Portfolio Optimization, Machine Learning, Python, Risk Analytics',
  authors: [{ name: 'Ajeet Kumar', url: 'https://ajeetkumar.vercel.app' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ajeetkumar.vercel.app',
    title: 'Ajeet Kumar | Quant Finance & Financial Engineering',
    description: 'MSc Financial Engineering · M.Tech CSE · Python · ML · Portfolio Optimization',
    siteName: 'Ajeet Kumar Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ajeet Kumar | Quant Finance & Financial Engineering',
    description: 'MSc Financial Engineering · M.Tech CSE · Python · ML · Portfolio Optimization',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ak-void text-white dark">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
