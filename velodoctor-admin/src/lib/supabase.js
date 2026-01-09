import { createClient } from '@supabase/supabase-js';

// ⚠️ REMPLACE LES TEXTES CI-DESSOUS PAR TES PROPRES CLÉS SUPABASE ⚠️
// Tu les trouveras dans Settings > API sur ton dashboard Supabase.

const supabaseUrl = 'https://rixowonwzubbmkzobteb.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeG93b253enViYm1rem9idGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MjE3NDMsImV4cCI6MjA4MzI5Nzc0M30.B3bNsk4eCHqNtSk99kP0ajoMGFSDDy338sZOMbucqAg';

export const supabase = createClient(supabaseUrl, supabaseKey);