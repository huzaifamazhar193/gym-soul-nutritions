import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import NavbarWrapper from '@/components/NavbarWrapper'
import FooterWrapper from '@/components/FooterWrapper'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Gym Soul Nutritions - Premium Supplements Pakistan',
  description: 'Pakistan ka best gym supplement store. Whey Protein, Creatine, Pre-Workout aur bahut kuch. Fast delivery, best prices.',
  keywords: 'whey protein, creatine, bcaa, pre workout, gym supplements pakistan',
  openGraph: {
    title: 'Gym Soul Nutritions',
    description: 'Premium Gym Supplements at Best Prices',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <CartProvider>
            <NavbarWrapper />
            <main className="min-h-screen">{children}</main>
            <FooterWrapper />
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: 'toast-custom',
                duration: 2500,
                style: {
                  background: '#18181b',
                  color: '#fff',
                  border: '1px solid #3f3f46',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
