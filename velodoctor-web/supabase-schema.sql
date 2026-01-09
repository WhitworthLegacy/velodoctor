-- VeloDoctor Appointments Table Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Booking Details
  service_type TEXT NOT NULL CHECK (service_type IN ('Collecte', 'Dépôt atelier')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 90,

  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT, -- Only for "Collecte"

  -- Additional Info
  vehicle_type TEXT, -- e.g., "Vélo électrique", "Trottinette"
  message TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster availability queries
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- RLS Policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow public to read appointments for availability checking
-- (We'll filter sensitive data in the API route)
CREATE POLICY "Allow public to check availability"
  ON appointments
  FOR SELECT
  USING (true);

-- Only service role can insert appointments (handled by API route)
CREATE POLICY "Only service role can insert"
  ON appointments
  FOR INSERT
  WITH CHECK (false);

-- Only service role can update appointments
CREATE POLICY "Only service role can update"
  ON appointments
  FOR UPDATE
  USING (false);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
