import { Phone, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';

export const metadata = {
  title: "Contact - Nous joindre | VeloDoctor",
  description: "Contactez VeloDoctor pour toute question sur nos services de réparation mobile de vélos et trottinettes électriques à Bruxelles.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <Mail className="w-12 h-12 text-vdPrimary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-4">
            Nous contacter
          </h1>
          <p className="text-lg text-gray-600">
            Une question ? Besoin d'un devis ? Notre équipe est à votre écoute.
          </p>
        </div>
      </Section>

      {/* Contact Methods */}
      <Section spacing="default" background="white">
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          {/* Phone */}
          <Card className="text-center" hover={true}>
            <div className="w-12 h-12 bg-vdPrimary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-vdPrimary" />
            </div>
            <h3 className="font-bold text-vdDark mb-2">Téléphone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Appelez-nous directement
            </p>
            <a
              href="tel:+32XXXXXXXXX"
              className="text-vdPrimary hover:text-vdPrimary/80 font-semibold transition"
            >
              +32 XXX XX XX XX
            </a>
          </Card>

          {/* WhatsApp */}
          <Card className="text-center" hover={true}>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-vdDark mb-2">WhatsApp</h3>
            <p className="text-sm text-gray-600 mb-4">
              Message instantané
            </p>
            <a
              href="https://wa.me/32XXXXXXXXX"
              className="text-green-600 hover:text-green-500 font-semibold transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir WhatsApp
            </a>
          </Card>

          {/* Email */}
          <Card className="text-center" hover={true}>
            <div className="w-12 h-12 bg-vdAccent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-vdAccent" />
            </div>
            <h3 className="font-bold text-vdDark mb-2">Email</h3>
            <p className="text-sm text-gray-600 mb-4">
              Écrivez-nous
            </p>
            <a
              href="mailto:contact@velodoctor.be"
              className="text-vdAccent hover:text-vdAccent/80 font-semibold transition"
            >
              contact@velodoctor.be
            </a>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* Hours */}
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-vdPrimary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-vdPrimary" />
              </div>
              <div>
                <h3 className="font-bold text-vdDark mb-3">Horaires</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Lundi - Vendredi</span>
                    <span>9h00 - 19h00</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Samedi</span>
                    <span>10h00 - 17h00</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Dimanche</span>
                    <span>Sur rendez-vous</span>
                  </div>
                </div>
                <p className="text-xs text-vdPrimary mt-3">
                  Dépannage d'urgence : 7j/7
                </p>
              </div>
            </div>
          </Card>

          {/* Service Area */}
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-vdAccent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-vdAccent" />
              </div>
              <div>
                <h3 className="font-bold text-vdDark mb-3">Zone d'intervention</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Bruxelles-Capitale</strong>
                  </p>
                  <p className="text-gray-500">
                    Toutes les 19 communes + périphérie
                  </p>
                  <p className="mt-3">
                    Service mobile à domicile, au bureau, ou n'importe où dans la zone.
                  </p>
                </div>
                <Button href="/zones" variant="ghost" size="sm" className="mt-3 text-vdPrimary">
                  Vérifier ma zone →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* FAQ Quick Links */}
      <Section spacing="default" background="surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-vdDark text-center mb-8">
            Questions fréquentes
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="group" hover={true}>
              <h3 className="font-semibold text-vdDark mb-2 group-hover:text-vdPrimary transition">
                Le diagnostic est-il vraiment gratuit ?
              </h3>
              <p className="text-sm text-gray-600">
                Oui, si vous acceptez notre devis de réparation. Sinon 15€.
              </p>
            </Card>

            <Card className="group" hover={true}>
              <h3 className="font-semibold text-vdDark mb-2 group-hover:text-vdPrimary transition">
                Quels moyens de paiement ?
              </h3>
              <p className="text-sm text-gray-600">
                Espèces, carte bancaire, virement. Paiement après réparation.
              </p>
            </Card>

            <Card className="group" hover={true}>
              <h3 className="font-semibold text-vdDark mb-2 group-hover:text-vdPrimary transition">
                Combien de temps dure une intervention ?
              </h3>
              <p className="text-sm text-gray-600">
                La plupart des réparations: moins d'1 heure.
              </p>
            </Card>

            <Card className="group" hover={true}>
              <h3 className="font-semibold text-vdDark mb-2 group-hover:text-vdPrimary transition">
                Proposez-vous une garantie ?
              </h3>
              <p className="text-sm text-gray-600">
                Oui, 6 mois sur toutes nos réparations.
              </p>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button href="/#faq" variant="secondary" size="md">
              Voir toutes les questions
            </Button>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section spacing="default" background="white">
        <div className="max-w-3xl mx-auto">
          <Card className="text-center border-2 border-vdPrimary bg-vdSurface" padding="lg">
            <h2 className="text-2xl font-bold text-vdDark mb-4">
              Prêt à réserver ?
            </h2>
            <p className="text-gray-600 mb-6">
              Réservez votre créneau en ligne en quelques clics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/booking" variant="primary" size="lg">
                Réserver maintenant
              </Button>
              <Button
                href="https://wa.me/32XXXXXXXXX"
                variant="secondary"
                size="lg"
                icon={<MessageCircle size={20} />}
              >
                WhatsApp
              </Button>
            </div>
          </Card>
        </div>
      </Section>

    </main>
  );
}
