import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function connectSupabase() {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) throw error;
    console.log("Supabase connected ✅");
  } catch (err) {
    console.error("Supabase connection error ❌", err);
    throw err;
  }
}

/*
  ── Supabase Table Setup ──────────────────────────────────────────────────────
  Run this SQL in your Supabase project → SQL Editor to create the users table.

  CREATE TABLE users (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    username    TEXT        NOT NULL,
    email       TEXT        NOT NULL UNIQUE,
    password    TEXT        NOT NULL,
    role        TEXT        NOT NULL DEFAULT 'user'
                            CHECK (role IN ('user', 'admin')),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
  );

  ── Auto-update updated_at on every row change ───────────────────────────────
  Run this SQL in your Supabase project → SQL Editor to create the users table.

  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
  ─────────────────────────────────────────────────────────────────────────────
*/
