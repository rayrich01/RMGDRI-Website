import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-white">
{/* Google Tag Manager (noscript) */}
<noscript dangerouslySetInnerHTML={{ __html: `
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WTW9XQCX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>
` }} />
{/* End Google Tag Manager (noscript) */}
{/* Google Tag Manager */}
<script dangerouslySetInnerHTML={{ __html: `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-WTW9XQCX');
` }} />
{/* End Google Tag Manager */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
