import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Send, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import QuoteItemsList from './QuoteItemsList';

export default function QuoteSection({ interventionId, onQuoteUpdate }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, [interventionId]);

  async function fetchQuote() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .eq('intervention_id', interventionId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No quote found - this is ok
          setQuote(null);
        } else {
          throw fetchError;
        }
      } else {
        setQuote(data);
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createQuote() {
    try {
      setActionLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('quotes')
        .insert([{
          intervention_id: interventionId,
          status: 'draft',
          labor_total: 0,
          parts_total: 0,
          total: 0
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setQuote(data);
      if (onQuoteUpdate) onQuoteUpdate();
    } catch (err) {
      console.error('Error creating quote:', err);
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function updateQuoteStatus(status) {
    try {
      setActionLoading(true);
      setError(null);

      const updateData = { status };

      if (status === 'sent') {
        updateData.sent_at = new Date().toISOString();
      } else if (status === 'accepted') {
        updateData.accepted_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejected_at = new Date().toISOString();
      }

      const { data, error: updateError } = await supabase
        .from('quotes')
        .update(updateData)
        .eq('id', quote.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setQuote(data);
      if (onQuoteUpdate) onQuoteUpdate();
    } catch (err) {
      console.error('Error updating quote status:', err);
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  function getStatusBadgeColor(status) {
    const colors = {
      draft: 'gray',
      sent: 'blue',
      accepted: 'green',
      rejected: 'red'
    };
    return colors[status] || 'gray';
  }

  if (loading) {
    return (
      <Card>
        <p>Loading quote...</p>
      </Card>
    );
  }

  // No quote exists yet
  if (!quote) {
    return (
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FileText size={24} color="var(--primary)" />
          <h2 style={{ margin: 0, fontSize: '20px' }}>Quote</h2>
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>
        )}

        <p style={{ color: 'var(--gray)', marginBottom: '16px' }}>
          No quote exists for this intervention yet.
        </p>

        <Button
          onClick={createQuote}
          disabled={actionLoading}
        >
          {actionLoading ? 'Creating...' : 'Create Quote'}
        </Button>
      </Card>
    );
  }

  // Quote exists - show details
  return (
    <div>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <FileText size={24} color="var(--primary)" />
          <h2 style={{ margin: 0, fontSize: '20px' }}>Quote</h2>
          <Badge
            status={quote.status}
            style={{
              backgroundColor: `var(--${getStatusBadgeColor(quote.status)})`,
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {quote.status.toUpperCase()}
          </Badge>
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>
        )}

        {/* Totals */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: 'var(--bg)',
          borderRadius: '8px'
        }}>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--gray)', margin: '0 0 4px 0' }}>Labor Total</p>
            <p style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
              {(quote.labor_total || 0).toFixed(2)} €
            </p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--gray)', margin: '0 0 4px 0' }}>Parts Total</p>
            <p style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
              {(quote.parts_total || 0).toFixed(2)} €
            </p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--gray)', margin: '0 0 4px 0' }}>Total</p>
            <p style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--primary)' }}>
              {(quote.total || 0).toFixed(2)} €
            </p>
          </div>
        </div>

        {/* Status Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button
            variant={quote.status === 'sent' ? 'primary' : 'outline'}
            onClick={() => updateQuoteStatus('sent')}
            disabled={actionLoading || quote.status === 'accepted' || quote.status === 'rejected'}
          >
            <Send size={16} /> Mark Sent
          </Button>
          <Button
            variant={quote.status === 'accepted' ? 'primary' : 'outline'}
            onClick={() => updateQuoteStatus('accepted')}
            disabled={actionLoading || quote.status === 'rejected'}
            style={quote.status === 'accepted' ? { backgroundColor: 'var(--success)' } : {}}
          >
            <CheckCircle size={16} /> Mark Accepted
          </Button>
          <Button
            variant={quote.status === 'rejected' ? 'primary' : 'outline'}
            onClick={() => updateQuoteStatus('rejected')}
            disabled={actionLoading || quote.status === 'accepted'}
            style={quote.status === 'rejected' ? { backgroundColor: 'var(--danger)' } : {}}
          >
            <XCircle size={16} /> Mark Rejected
          </Button>
        </div>

        {/* Metadata */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--gray)' }}>
          {quote.sent_at && (
            <span>Sent: {new Date(quote.sent_at).toLocaleString()}</span>
          )}
          {quote.accepted_at && (
            <span>Accepted: {new Date(quote.accepted_at).toLocaleString()}</span>
          )}
          {quote.rejected_at && (
            <span>Rejected: {new Date(quote.rejected_at).toLocaleString()}</span>
          )}
          {quote.pdf_url && (
            <a href={quote.pdf_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
              View PDF
            </a>
          )}
        </div>

        {/* Notes */}
        {quote.notes && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: 'var(--gray)', margin: '0 0 4px 0' }}>Notes</p>
            <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{quote.notes}</p>
          </div>
        )}
      </Card>

      {/* Quote Items List */}
      <div style={{ marginTop: '20px' }}>
        <QuoteItemsList quoteId={quote.id} onItemsChange={fetchQuote} />
      </div>
    </div>
  );
}
