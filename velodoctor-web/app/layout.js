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
  title: "VeloDoctor - You Ride, We Repair",
  description: "Réparation de vélos et trottinettes électriques à domicile.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}