

import { AuthProvider } from './providers/AuthProvider'
import localFont from "next/font/local";
import "./globals.css";
 
export const metadata = {
  title: '%s | Acme Dashboard',
  default: 'Instakiller',
  description: 'The official Next.js Learn Dashboard built with App Router.'
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});




export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
      {children}
        </AuthProvider>
      </body>
    </html>
  )
}
