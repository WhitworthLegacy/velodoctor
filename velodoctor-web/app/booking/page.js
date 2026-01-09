'use client';

import { Calendar, MapPin, CheckCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useState } from 'react';

const STEPS = [
  { id: 1, label: 'Service' },
  { id: 2, label: 'Date' },
  { id: 3, label: 'Horaire' },
  { id: 4, label: 'Coordonnées' },
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    serviceType: '',
    date: '',
    timeSlot: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    vehicleType: '',
    message: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch available slots when date is selected
  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true);
    try {
      const response = await fetch(`/api/availability?date=${date}`);
      const data = await response.json();

      if (response.ok) {
        setAvailableSlots(data.availableSlots || []);
      } else {
        console.error('Error fetching slots:', data.error);
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // When date changes, fetch available slots
    if (field === 'date' && value) {
      fetchAvailableSlots(value);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.serviceType !== '';
      case 2:
        return formData.date !== '';
      case 3:
        return formData.timeSlot !== '';
      case 4:
        return formData.name && formData.email && formData.phone &&
               (formData.serviceType !== 'Collecte' || formData.address);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNextStep()) return;

    setLoading(true);

    try {
      // Construct ISO datetime from date + timeSlot
      const scheduledAt = `${formData.date}T${formData.timeSlot}:00+01:00`; // Brussels timezone

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: formData.serviceType,
          scheduledAt,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: formData.address || null,
          vehicleType: formData.vehicleType || null,
          message: formData.message || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
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
                Réservation confirmée !
              </h2>
              <p className="text-gray-600 mb-2">
                Votre demande de rendez-vous a été enregistrée avec succès.
              </p>
              <div className="bg-vdSurface rounded-lg p-4 my-6 text-left">
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Service:</strong> {formData.serviceType}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Date:</strong> {new Date(formData.date).toLocaleDateString('fr-BE')}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Horaire:</strong> {formData.timeSlot}
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-8">
                Nous vous enverrons une confirmation par email à <strong>{formData.email}</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button href="/" variant="primary" size="md">
                  Retour à l'accueil
                </Button>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(1);
                    setFormData({
                      serviceType: '',
                      date: '',
                      timeSlot: '',
                      name: '',
                      email: '',
                      phone: '',
                      address: '',
                      vehicleType: '',
                      message: '',
                    });
                  }}
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
            Réserver une intervention
          </h1>
          <p className="text-lg text-gray-600">
            Choisissez votre créneau en quelques étapes
          </p>
        </div>
      </Section>

      {/* Progress Stepper */}
      <Section spacing="sm" background="white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition ${
                      currentStep >= step.id
                        ? 'bg-vdPrimary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep >= step.id ? 'text-vdDark' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition ${
                      currentStep > step.id ? 'bg-vdPrimary' : 'bg-gray-200'
                    }`}
                    style={{ marginBottom: '2rem' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Form Content */}
      <Section spacing="default" background="white">
        <div className="max-w-2xl mx-auto">
          <Card padding="lg">
            {/* STEP 1: Service Type */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-vdDark mb-4">
                  Type de service
                </h2>
                <p className="text-gray-600 mb-6">
                  Comment souhaitez-vous procéder ?
                </p>
                <div className="space-y-3">
                  <label
                    className={`block border-2 rounded-xl p-4 cursor-pointer transition ${
                      formData.serviceType === 'Collecte'
                        ? 'border-vdPrimary bg-vdPrimary/5'
                        : 'border-vdBorder hover:border-vdPrimary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value="Collecte"
                      checked={formData.serviceType === 'Collecte'}
                      onChange={(e) => handleChange('serviceType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-vdDark mb-1">
                          Collecte à domicile
                        </div>
                        <div className="text-sm text-gray-600">
                          Nous venons chercher votre vélo/trottinette chez vous, le réparons à l'atelier, puis le ramenons.
                        </div>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`block border-2 rounded-xl p-4 cursor-pointer transition ${
                      formData.serviceType === 'Dépôt atelier'
                        ? 'border-vdPrimary bg-vdPrimary/5'
                        : 'border-vdBorder hover:border-vdPrimary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value="Dépôt atelier"
                      checked={formData.serviceType === 'Dépôt atelier'}
                      onChange={(e) => handleChange('serviceType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-vdDark mb-1">
                          Dépôt à l'atelier
                        </div>
                        <div className="text-sm text-gray-600">
                          Vous déposez votre vélo/trottinette directement à notre atelier.
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: Date Selection */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-vdDark mb-4">
                  Choisissez une date
                </h2>
                <p className="text-gray-600 mb-6">
                  Sélectionnez le jour souhaité pour l'intervention
                </p>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary text-lg"
                />
              </div>
            )}

            {/* STEP 3: Time Slot Selection */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-vdDark mb-4">
                  Choisissez un horaire
                </h2>
                <p className="text-gray-600 mb-6">
                  Créneaux disponibles le <strong>{new Date(formData.date).toLocaleDateString('fr-BE')}</strong>
                </p>

                {loadingSlots ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-vdPrimary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 mt-3">Chargement des disponibilités...</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">
                      Aucun créneau disponible pour cette date. Veuillez choisir une autre date.
                    </p>
                    <Button variant="secondary" size="sm" onClick={() => setCurrentStep(2)} className="mt-4">
                      Changer de date
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleChange('timeSlot', slot)}
                        className={`px-4 py-3 rounded-xl font-medium transition border-2 ${
                          formData.timeSlot === slot
                            ? 'border-vdPrimary bg-vdPrimary text-white'
                            : 'border-vdBorder bg-white text-vdDark hover:border-vdPrimary'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Contact Details */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-vdDark mb-4">
                  Vos coordonnées
                </h2>
                <p className="text-gray-600 mb-6">
                  Pour finaliser votre réservation
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                        placeholder="jean@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                        placeholder="+32 XXX XX XX XX"
                      />
                    </div>
                  </div>

                  {formData.serviceType === 'Collecte' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse de collecte *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                        placeholder="Rue, numéro, code postal, ville"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de véhicule (optionnel)
                    </label>
                    <select
                      value={formData.vehicleType}
                      onChange={(e) => handleChange('vehicleType', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="Vélo électrique">Vélo électrique</option>
                      <option value="Vélo classique">Vélo classique</option>
                      <option value="Trottinette électrique">Trottinette électrique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (optionnel)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-vdBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-vdPrimary"
                      placeholder="Décrivez le problème..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-vdBorder">
              <Button
                variant="ghost"
                size="md"
                onClick={handleBack}
                disabled={currentStep === 1}
                icon={<ChevronLeft size={20} />}
              >
                Retour
              </Button>

              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  disabled={!canProceedToNextStep()}
                  icon={<ChevronRight size={20} />}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  disabled={!canProceedToNextStep() || loading}
                  icon={<CheckCircle size={20} />}
                >
                  {loading ? 'Envoi...' : 'Confirmer'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
