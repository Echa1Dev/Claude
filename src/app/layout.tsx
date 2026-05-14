import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ECHO-7 // Systems Architect & Interactive Developer',
  description:
    'Portfolio of Alejandro Reyes — Systems Architect and Interactive Developer with 7+ years building immersive web experiences, games, and creative tools at the intersection of code, creativity, and chaos.',
  keywords: [
    'portfolio',
    'developer',
    'interactive developer',
    'systems architect',
    'TypeScript',
    'React',
    'Next.js',
    'Three.js',
    'WebGL',
    'game development',
  ],
  authors: [{ name: 'Alejandro Reyes' }],
  openGraph: {
    title: 'ECHO-7 // Systems Architect & Interactive Developer',
    description:
      'Building at the intersection of code, creativity, and chaos. Explore the mission archives.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECHO-7 // Systems Architect & Interactive Developer',
    description: 'Building at the intersection of code, creativity, and chaos.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
