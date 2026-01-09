import { Wrench, ShoppingBag, Truck, Clock, ShieldCheck, Zap, CheckCircle, MapPin } from 'lucide-react';
import Button from '@/components/Button';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Container from '@/components/Container';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-dark via-dark-lighter to-primary overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <Container className="relative z-10 py-16 md:py-24 lg:py-32">
          <div className="flex flex-col items-center text-center">

            {/* Logo Icon */}
            <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mb-8 shadow-2xl transform hover:scale-110 transition-transform">
              <Zap className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight">
              VELODOCTOR
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl font-semibold text-primary-light mb-6 tracking-wide">
              You Ride, We Repair
            </p>

            {/* Subheading */}
            <p className="max-w-2xl text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Expert mobile repair service for bikes and e-scooters.
              We come to you, so you can keep moving.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
              <Button
                href="/services"
                variant="primary"
                size="lg"
                icon={<Wrench size={22} />}
              >
                Book a Repair
              </Button>

              <Button
                href="/shop"
                variant="secondary"
                size="lg"
                icon={<ShoppingBag size={22} />}
                className="bg-white hover:bg-white border-white text-dark hover:text-dark hover:shadow-xl"
              >
                Shop Parts
              </Button>
            </div>

          </div>
        </Container>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 md:h-20">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <Section spacing="lg" background="white">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Get your bike or e-scooter fixed in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <StepCard
            number="1"
            icon={<MapPin className="w-8 h-8" />}
            title="Book Online"
            description="Schedule a repair at your preferred location and time. We come to your home, office, or anywhere convenient."
          />
          <StepCard
            number="2"
            icon={<Wrench className="w-8 h-8" />}
            title="We Fix It"
            description="Our certified technician arrives with all necessary tools and parts to diagnose and repair your vehicle on the spot."
          />
          <StepCard
            number="3"
            icon={<CheckCircle className="w-8 h-8" />}
            title="Ride Again"
            description="Quality guaranteed. Get back on the road with a fully functional bike or e-scooter, backed by our warranty."
          />
        </div>
      </Section>

      {/* VALUE PROPOSITIONS */}
      <Section spacing="lg" background="lighter">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Why Choose VeloDoctor
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            The trusted choice for urban riders and delivery professionals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ValueCard
            icon={<Truck className="w-10 h-10 text-primary" />}
            title="Mobile Service"
            description="No need to transport your bike. We bring the workshop to you, saving you time and hassle."
          />
          <ValueCard
            icon={<ShieldCheck className="w-10 h-10 text-accent" />}
            title="Expert Repairs"
            description="Certified technicians trained on all bike and e-scooter models. Professional service you can trust."
          />
          <ValueCard
            icon={<Clock className="w-10 h-10 text-primary" />}
            title="Fast Turnaround"
            description="Most repairs completed same-day. Get back on the road quickly with minimal downtime."
          />
        </div>
      </Section>

      {/* CTA SECTION */}
      <Section spacing="lg" background="white">
        <Card className="text-center bg-gradient-to-br from-primary to-primary-dark border-none" padding="lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Rolling?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Book your mobile repair service today and experience the convenience of VeloDoctor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/services"
                variant="primary"
                size="lg"
                icon={<Wrench size={22} />}
              >
                Schedule Repair
              </Button>
              <Button
                href="/shop"
                variant="ghost"
                size="lg"
                icon={<ShoppingBag size={22} />}
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Browse Shop
              </Button>
            </div>
          </div>
        </Card>
      </Section>

      {/* FOOTER */}
      <footer className="bg-dark text-gray-400 py-12">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-lg">VeloDoctor</span>
            </div>

            <div className="text-center md:text-left">
              <p className="text-sm">© 2026 VeloDoctor. All rights reserved.</p>
              <p className="text-xs text-gray-500 mt-1">You Ride, We Repair</p>
            </div>

            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </Container>
      </footer>

    </main>
  );
}

// Step Card Component for "How It Works"
function StepCard({ number, icon, title, description }) {
  return (
    <div className="relative">
      <Card className="text-center h-full" hover={true}>
        {/* Step Number Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">{number}</span>
        </div>

        {/* Icon */}
        <div className="bg-primary/10 text-primary p-4 rounded-2xl inline-flex mb-6 mt-4">
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-dark mb-3">{title}</h3>
        <p className="text-muted leading-relaxed">{description}</p>
      </Card>
    </div>
  );
}

// Value Card Component
function ValueCard({ icon, title, description }) {
  return (
    <Card className="text-center h-full group" hover={true}>
      <div className="bg-background-light p-5 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-dark mb-3">{title}</h3>
      <p className="text-muted leading-relaxed">{description}</p>
    </Card>
  );
}