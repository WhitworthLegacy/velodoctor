import { Wrench, ShoppingBag, Zap, CheckCircle, MapPin, Phone, Mail, MessageCircle, Euro, HelpCircle } from 'lucide-react';
import Button from '@/components/Button';
import Section from '@/components/Section';
import Card from '@/components/Card';
import GoogleReviews from '@/components/GoogleReviews';
import Link from 'next/link';

export const metadata = {
  title: "VeloDoctor - Jij rijdt, wij repareren",
  description: "Mobiele reparatieservice voor elektrische fietsen en steps in Brussel. Wij komen naar jou.",
};

export default function HomeNL() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <Section spacing="lg" background="white">
        <div className="w-full">
        <div className="flex flex-col items-center text-center max-w-10xl mx-auto px-4">

          {/* Small Accent Badge */}
          <div className="inline-flex items-center gap-2 bg-vdSurface border border-vdBorder rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-vdAccent" strokeWidth={2.5} />
            <span className="text-sm font-medium text-vdDark">Premium mobiele service</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-vdDark mb-4 tracking-tight">
            Mobiele reparatie van{' '}
            <span className="accent-underline">fietsen en steps</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
            Jij rijdt, wij repareren
          </p>

          {/* Subheading */}
          <p className="max-w-2xl text-base md:text-lg text-gray-600 mb-10 leading-relaxed">
            Expert reparatieservice aan huis voor elektrische fietsen en steps.
            Diagnose: <span className="line-through">45€</span> — <strong>0€ bij aanvaard offertereparatie</strong>.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl justify-center mb-8">
            <Button
              href="/nl/afspraak"
              variant="primary"
              size="lg"
              icon={<Wrench size={20} />}
            >
              Afspraak maken
            </Button>

            <Button
              href="/nl/winkel"
              variant="secondary"
              size="lg"
              icon={<ShoppingBag size={20} />}
            >
              Onderdelen kopen
            </Button>

            <Button
              href="https://wa.me/+32456951445"
              variant="ghost"
              size="lg"
              icon={<MessageCircle size={20} />}
            >
              WhatsApp
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 pt-6 border-t border-vdBorder">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>
                Diagnose: <span className="line-through">45€</span> → <strong>0€</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Bij aanvaarde reparatieofferte</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Reparatie enkel op offerte</span>
            </div>
          </div>
        </div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section spacing="default" background="surface">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
            Hoe werkt het
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Drie eenvoudige stappen om je voertuig te herstellen
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <StepCard
            number="1"
            icon={<MapPin className="w-8 h-8" />}
            title="Vraag een diagnose aan"
            description="Reserveer online voor 45€. We komen naar je thuis, kantoor of overal in Brussel."
          />
          <StepCard
            number="2"
            icon={<Wrench className="w-8 h-8" />}
            title="Ontvang je offerte"
            description="Onze gecertificeerde technicus stelt binnen 72u een transparante offerte op. Diagnose volledig terugbetaald bij aanvaarding."
          />
          <StepCard
            number="3"
            icon={<CheckCircle className="w-8 h-8" />}
            title="Reparatie in atelier"
            description="Na aanvaarding van de offerte voeren we de reparatie uit en informeren we je zodra het voertuig klaar is."
          />
        </div>
      </Section>

      {/* POPULAR SERVICES */}
      <Section spacing="default" background="white">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
            Populaire diensten
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Onze meest gevraagde interventies
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
         <ServiceCard
            title="Volledige diagnose"
            price={<span><span className="line-through">45€</span> <span className="ml-2 font-bold">0€ bij aanvaarde offerte</span></span>}
            features={["Remmen", "Versnellingen", "Banden", "Elektrisch"]}
          />

          <ServiceCard
            title="Reparatie & onderdelen"
            price="Op offerte"
            features={["Batterij", "Motor", "Controller", "Bedrading"]}
          />

          <ServiceCard
            title="Lekke band & banden"
            price="Op offerte"
            features={["Reparatie", "Vervanging", "Binnenbanden", "Nieuwe banden"]}
          />
        </div>

        <div className="text-center mt-8">
          <Button href="/nl/diensten" variant="secondary" size="md">
            Alle diensten bekijken
          </Button>
        </div>
      </Section>

      {/* PRICING TEASER */}
      <Section spacing="default" background="surface">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-vdBorder rounded-2xl p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-vdAccent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Euro className="w-6 h-6 text-vdAccent" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-vdDark mb-2">
                  Transparante tarieven
                </h2>
                <p className="text-gray-600">
                  Duidelijke offerte voor elke interventie. Geen verrassingen.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-vdDark">
                      Diagnose: <span className="line-through">45€</span> → <span className="font-bold">0€ bij aanvaarde offerte</span>
                    </p>
                    <p className="text-sm text-gray-600">Anders: diagnose gefactureerd 45€</p>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-vdDark">Offerte binnen 72u</p>
                    <p className="text-sm text-gray-600">Na de diagnose</p>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-vdDark">Geen verplaatsingskosten</p>
                  <p className="text-sm text-gray-600">In de regio Brussel</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-vdDark">Betaling na reparatie</p>
                  <p className="text-sm text-gray-600">Cash, kaart of overschrijving</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SERVICE ZONES */}
      <Section spacing="default" background="white">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-12 h-12 text-vdPrimary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-4">
            Werkgebied
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We komen in heel het <strong>Brussels Hoofdstedelijk Gewest</strong> en omliggende gemeenten.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Elsene", "Etterbeek", "Schaarbeek", "Sint-Gillis", "Ukkel", "Woluwe", "Anderlecht", "Molenbeek"].map((zone) => (
              <span key={zone} className="px-4 py-2 bg-vdSurface border border-vdBorder rounded-full text-sm font-medium text-vdDark">
                {zone}
              </span>
            ))}
            <span className="px-4 py-2 bg-vdSurface border border-vdBorder rounded-full text-sm font-medium text-gray-500">
              + 19 gemeenten
            </span>
          </div>

          <Button href="/nl/zones" variant="ghost" size="sm" className="text-vdPrimary">
            Alle zones bekijken →
          </Button>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section spacing="default" background="surface">
        <GoogleReviews />
      </Section>

      {/* BLOG */}
      <Section spacing="default" background="surface">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
            Gidsen & tips
          </h2>
          <p className="text-gray-600">
            Onze aanbevelingen voor het onderhoud van je elektrische fiets of step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/nl/blog/onderhoud-elektrische-fiets-brussel">
            <Card className="h-full group" hover={true}>
              <p className="text-xs text-gray-500 mb-2">Praktische gids</p>
              <h3 className="text-lg font-bold text-vdDark mb-2 group-hover:text-vdPrimary transition">
                Onderhoud van elektrische fietsen in Brussel
              </h3>
              <p className="text-gray-600">Batterij, remmen, banden, ketting: een eenvoudige checklist.</p>
            </Card>
          </Link>
          <Link href="/nl/blog/elektrische-step-reparatie-brussel">
            <Card className="h-full group" hover={true}>
              <p className="text-xs text-gray-500 mb-2">Praktische gids</p>
              <h3 className="text-lg font-bold text-vdDark mb-2 group-hover:text-vdPrimary transition">
                Elektrische step reparatie in Brussel
              </h3>
              <p className="text-gray-600">Veelvoorkomende defecten en onderhoudstips.</p>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Button href="/nl/blog" variant="secondary" size="md">
            Blog lezen
          </Button>
        </div>
      </Section>

      {/* FAQ */}
      <Section spacing="default" background="white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
              Veelgestelde vragen
            </h2>
            <p className="text-gray-600">Alles wat je moet weten</p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Is de diagnose echt gratis?"
              answer="Ja, als je onze reparatieofferte aanvaardt, is de diagnose gratis. Als je weigert, kost de diagnose 45€."
            />
            <FAQItem
              question="Welke betaalmiddelen accepteren jullie?"
              answer="We accepteren cash, bankkaarten en overschrijvingen. Betaling gebeurt na de reparatie."
            />
            <FAQItem
              question="Hoe lang duurt een interventie?"
              answer="De meeste reparaties worden binnen een uur uitgevoerd. Voor complexere interventies informeren we je over de termijn."
            />
            <FAQItem
              question="Wat is jullie werkgebied?"
              answer="We komen in heel het Brussels Hoofdstedelijk Gewest en omliggende gemeenten, zonder verplaatsingskosten."
            />
            <FAQItem
              question="Bieden jullie garantie?"
              answer="De diagnose kost 45€. Als je onze reparatieofferte aanvaardt, wordt de diagnose 0€ (afgetrokken/geannuleerd)."
            />
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section spacing="default" background="white">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-vdPrimary bg-vdSurface rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-vdDark mb-3">
              Klaar om weer te rijden?
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Vraag je diagnose aan voor 45€, terugbetaald bij aanvaarding van onze reparatieofferte.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button
                href="/nl/afspraak"
                variant="primary"
                size="lg"
                icon={<Wrench size={20} />}
              >
                Afspraak maken
              </Button>
              <Button
                href="tel:+32456951445"
                variant="ghost"
                size="lg"
                icon={<Phone size={20} />}
                className="border-2 border-vdBorder"
              >
                +32 456 95 14 45
              </Button>
            </div>

            {/* Contact Options */}
            <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-vdBorder">
              <a href="https://wa.me/+32456951445" className="flex items-center gap-2 text-sm text-gray-600 hover:text-vdPrimary transition">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a href="tel:+32456951445" className="flex items-center gap-2 text-sm text-gray-600 hover:text-vdPrimary transition">
                <Phone className="w-4 h-4" />
                <span>Telefoon</span>
              </a>
              <a href="mailto:trott@velodoctor.be" className="flex items-center gap-2 text-sm text-gray-600 hover:text-vdPrimary transition">
                <Mail className="w-4 h-4" />
                <span>trott@velodoctor.be</span>
              </a>
            </div>
          </div>
        </div>
      </Section>

    </main>
  );
}

// Step Card Component
function StepCard({ number, icon, title, description }) {
  return (
    <div className="relative">
      <Card className="text-center h-full" hover={true}>
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-11 h-11 bg-vdAccent rounded-full flex items-center justify-center shadow-vd-sm">
          <span className="text-white font-bold text-lg">{number}</span>
        </div>
        <div className="bg-vdPrimary/10 text-vdPrimary p-3.5 rounded-xl inline-flex mb-4 mt-4">
          {icon}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-vdDark mb-2">{title}</h3>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">{description}</p>
      </Card>
    </div>
  );
}

// Service Card Component
function ServiceCard({ icon, title, price, features }) {
  return (
    <Card className="h-full" hover={true}>
      <div className="bg-vdSurface p-3 rounded-xl inline-flex mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-vdDark mb-2">{title}</h3>
      <div className="text-vdAccent font-semibold mb-4">
        {price}
      </div>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-vdPrimary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }) {
  return (
    <div className="bg-vdSurface border border-vdBorder rounded-xl p-6">
      <div className="flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-vdDark mb-2">{question}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
