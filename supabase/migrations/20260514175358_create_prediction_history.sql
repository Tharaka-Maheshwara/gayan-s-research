/*
  # Create prediction history table

  1. New Tables
    - `prediction_history`
      - `id` (uuid, primary key)
      - `image_name` (text) - original file name
      - `predicted_grade` (text) - Extra Class, Class I, or Class II
      - `confidence` (numeric) - confidence percentage 0-100
      - `detection_data` (jsonb) - full API response from Roboflow
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `prediction_history` table
    - Add policy for public insert (anonymous grading sessions)
    - Add policy for public select (view history in session)

  Note: This app is a public research tool, so we allow anonymous reads/writes
  but restrict to non-destructive operations only.
*/

CREATE TABLE IF NOT EXISTS prediction_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_name text NOT NULL DEFAULT '',
  predicted_grade text NOT NULL DEFAULT '',
  confidence numeric NOT NULL DEFAULT 0,
  detection_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prediction_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert predictions"
  ON prediction_history FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read predictions"
  ON prediction_history FOR SELECT
  TO anon
  USING (true);
