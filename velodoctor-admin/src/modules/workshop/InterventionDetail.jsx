import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { ArrowLeft, Wrench } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import QuoteSection from './QuoteSection';

export default function InterventionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intervention, setIntervention] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIntervention();
  }, [id]);

  async function fetchIntervention() {
    try {
      setLoading(true);
      setError(null);

      const payload = await apiFetch(`/api/admin/interventions/${id}`);
      setIntervention(payload.intervention || null);
    } catch (err) {
      console.error('Error fetching intervention:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading intervention...</p>
      </div>
    );
  }

  if (error || !intervention) {
    return (
      <div style={{ padding: '20px' }}>
        <Button variant="outline" onClick={() => navigate('/workshop')}>
          <ArrowLeft size={16} /> Back to Workshop
        </Button>
        <p style={{ color: 'var(--danger)', marginTop: '20px' }}>
          {error || 'Intervention not found'}
        </p>
      </div>
    );
  }

  const vehicle = intervention.vehicles;
  const client = vehicle?.clients;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <Button variant="outline" onClick={() => navigate('/workshop')}>
          <ArrowLeft size={16} /> Back to Workshop
        </Button>
      </div>

      {/* Intervention Info */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Wrench size={24} color="var(--primary)" />
          <h2 style={{ margin: 0, fontSize: '24px' }}>Intervention Details</h2>
          <Badge status={intervention.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {/* Client Info */}
          {client && (
            <div>
              <h3 style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>Client</h3>
              <p style={{ margin: '4px 0', fontWeight: '600' }}>{client.full_name}</p>
              {client.phone && <p style={{ margin: '4px 0', fontSize: '14px' }}>{client.phone}</p>}
              {client.email && <p style={{ margin: '4px 0', fontSize: '14px' }}>{client.email}</p>}
            </div>
          )}

          {/* Vehicle Info */}
          {vehicle && (
            <div>
              <h3 style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>Vehicle</h3>
              <p style={{ margin: '4px 0', fontWeight: '600' }}>
                {vehicle.brand} {vehicle.model}
              </p>
              {vehicle.type && <p style={{ margin: '4px 0', fontSize: '14px' }}>Type: {vehicle.type}</p>}
              {vehicle.license_plate && <p style={{ margin: '4px 0', fontSize: '14px' }}>License: {vehicle.license_plate}</p>}
              {vehicle.vin && <p style={{ margin: '4px 0', fontSize: '14px' }}>VIN: {vehicle.vin}</p>}
            </div>
          )}

          {/* Diagnosis */}
          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>Diagnosis</h3>
            <p style={{ margin: '4px 0', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
              {intervention.diagnosis_note || 'No diagnosis note yet'}
            </p>
          </div>

          {/* Quote Amount */}
          {intervention.quote_amount && (
            <div>
              <h3 style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '8px' }}>Quote Amount</h3>
              <p style={{ margin: '4px 0', fontWeight: '600', fontSize: '18px', color: 'var(--primary)' }}>
                {intervention.quote_amount.toFixed(2)} €
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Quote Section */}
      <div style={{ marginTop: '24px' }}>
        <QuoteSection interventionId={intervention.id} onQuoteUpdate={fetchIntervention} />
      </div>
    </div>
  );
}
