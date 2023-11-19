import './globals.scss'
import NextAuthSessionProvider from './providers/SessionProvider';

export default function RootLayout({ children  }:
  { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}