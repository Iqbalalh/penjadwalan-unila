import { Inter } from "next/font/google";
import '../(css)/globals.css';
import NextTopLoader from "nextjs-toploader";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Penjadwalan",
  description: "Penjadwalan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><link rel="icon" href="/hero-banner.svg" sizes="any" /></head>
      <body className={inter.className}>
        <NextTopLoader showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
