import { CreditCard, AlertCircle } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';

export const metadata = {
  title: "Paiement | VeloDoctor",
  description: "Finaliser votre commande VeloDoctor",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-4">
            Paiement
          </h1>
        </div>
      </Section>

      {/* Placeholder Message */}
      <Section spacing="lg" background="white">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center" padding="lg">
            <div className="w-16 h-16 bg-vdAccent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-vdAccent" />
            </div>

            <h2 className="text-2xl font-bold text-vdDark mb-4">
              Paiement en ligne bientôt disponible
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    Intégration Stripe en cours
                  </p>
                  <p className="text-sm text-blue-700">
                    Le paiement en ligne sera disponible prochainement. En attendant, vous pouvez passer commande par téléphone ou WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              Pour finaliser votre commande dès maintenant, contactez-nous directement :
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <span className="font-medium">Téléphone :</span>
                <a href="tel:+32XXXXXXXXX" className="text-vdPrimary hover:underline">
                  +32 XXX XX XX XX
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <span className="font-medium">WhatsApp :</span>
                <a href="https://wa.me/32XXXXXXXXX" className="text-vdPrimary hover:underline">
                  +32 XXX XX XX XX
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <span className="font-medium">Email :</span>
                <a href="mailto:contact@velodoctor.be" className="text-vdPrimary hover:underline">
                  contact@velodoctor.be
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                href="https://wa.me/32XXXXXXXXX"
                variant="primary"
                size="lg"
              >
                Commander sur WhatsApp
              </Button>
              <Button
                href="/cart"
                variant="secondary"
                size="lg"
              >
                Retour au panier
              </Button>
            </div>
          </Card>
        </div>
      </Section>

    </main>
  );
}
