import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Rocky Mountain Great Dane Rescue',
  description: 'Saving gentle giants since 2000. Adopt, foster, or donate to help Great Danes in Colorado and surrounding states.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}
