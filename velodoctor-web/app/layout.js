import { Poppins } from "next/font/google";
import "./globals.css";

// Configuration de la police Poppins (Charte VeloDoctor)
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: "VeloDoctor - Vous roulez, on répare",
  description: "Service de réparation mobile expert pour vélos et trottinettes électriques. Nous venons à vous.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}