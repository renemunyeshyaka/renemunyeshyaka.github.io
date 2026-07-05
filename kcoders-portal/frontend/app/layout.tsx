import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from 'react-hot-toast'
import ChatWidget from '@/components/shared/ChatWidget'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kcoders Portal - Software Development Services',
  description: 'Professional Software Development, DevOps & Cybersecurity Consulting',
  keywords: 'kcoders, software development, DevOps, cybersecurity, Rwanda, web development',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <AuthProvider>
          {children}
          <ChatWidget />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '8px',
                background: '#0f172a',
                color: '#f8fafc',
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
