import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PredictionRecord {
  id?: string;
  image_name: string;
  predicted_grade: string;
  confidence: number;
  detection_data?: unknown;
  created_at?: string;
}

export async function savePrediction(record: PredictionRecord) {
  const { data, error } = await supabase
    .from('prediction_history')
    .insert(record)
    .select()
    .maybeSingle();
  if (error) console.error('Save prediction error:', error);
  return data;
}

export async function fetchHistory(limit = 20) {
  const { data, error } = await supabase
    .from('prediction_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) console.error('Fetch history error:', error);
  return data || [];
}
