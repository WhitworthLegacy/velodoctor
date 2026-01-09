'use client';

import { Calendar, MapPin, Wrench, CheckCircle } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useState } from 'react';

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    vehicleType: '',
    address: '',
    date: '',
    time: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to Supabase/backend
    console.log('Booking request:', formData);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white">
        <Section spacing="lg" background="white">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center" padding="lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-vdDark mb-4">
                Demande envoyée !
              </h2>
              <p className="text-gray-600 mb-8">
                Nous avons bien reçu votre demande de réservation. Un membre de notre équipe vous contactera dans les plus brefs délais pour confirmer votre rendez-vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button href="/" variant="primary" size="md">
                  Retour à l'accueil
                </Button>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="secondary"
                  size="md"
                >
                  Nouvelle réservation
                </Button>
              </div>
            </Card>
          </div>
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <Calendar className="w-12 h-12 text-vdPrimary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-4">
            Réserver une réparation
          </h1>
          <p className="text-lg text-gray-600">
            Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement pour confirmer votre rendez-vous.
          </p>
        </div>
      </Section>

      {/* Booking Form */}
      <Section spacing="default" background="white">
        <div className="max-w-3xl mx-auto">
          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Personal Info */}
              <div>
                <h2 className="text-xl font-bold text-vdDark mb-4">
                  Vos coordonnées
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                      placeholder="jean@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                      placeholder="+32 XXX XX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <h2 className="text-xl font-bold text-vdDark mb-4">
                  Type de service
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service souhaité *
                    </label>
                    <select
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                    >
                      <option value="">Sélectionnez un service</option>
                      <option value="revision">Révision complète</option>
                      <option value="diagnostic">Diagnostic électrique</option>
                      <option value="crevaison">Réparation crevaison</option>
                      <option value="freins">Entretien freins</option>
                      <option value="urgence">Dépannage d'urgence</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de véhicule *
                    </label>
                    <select
                      name="vehicleType"
                      required
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="velo-electrique">Vélo électrique</option>
                      <option value="velo-classique">Vélo classique</option>
                      <option value="trottinette">Trottinette électrique</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Schedule */}
              <div>
                <h2 className="text-xl font-bold text-vdDark mb-4">
                  Lieu et date
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse d'intervention *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                      placeholder="Rue, numéro, code postal, ville"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nous nous déplaçons à Bruxelles et alentours
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date souhaitée *
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Créneau horaire *
                      </label>
                      <select
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                      >
                        <option value="">Sélectionnez</option>
                        <option value="matin">Matin (9h-12h)</option>
                        <option value="midi">Midi (12h-14h)</option>
                        <option value="apres-midi">Après-midi (14h-17h)</option>
                        <option value="soir">Soir (17h-19h)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                  placeholder="Décrivez le problème ou toute information utile..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={<Calendar size={20} />}
                >
                  Envoyer ma demande
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Nous vous recontacterons sous 24h pour confirmer le rendez-vous
                </p>
              </div>
            </form>
          </Card>
        </div>
      </Section>

    </main>
  );
}
