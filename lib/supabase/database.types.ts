// Types du schéma (supabase/migrations). À tenir à jour à chaque migration.

export type Access = "free" | "audit" | "monthly" | "manual";
export type Frequency = "weekly" | "monthly" | "quarterly" | "yearly";
export type ChargeStatus = "to_review" | "keep" | "to_cancel" | "cancelled" | "ignored";
export type AnalysisSource = "pdf" | "csv" | "ofx";

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  postal_address: string | null;
  access: Access;
  access_until: string | null;
  stripe_customer_id: string | null;
  created_at: string;
};

type Analysis = {
  id: string;
  user_id: string;
  source: AnalysisSource;
  period_start: string | null;
  period_end: string | null;
  transactions_count: number;
  detected_count: number;
  created_at: string;
};

type Charge = {
  id: string;
  user_id: string;
  merchant_key: string;
  label: string;
  raw_label: string;
  amount_cents: number;
  frequency: Frequency;
  annual_cents: number;
  occurrences: number;
  first_seen: string;
  last_seen: string;
  status: ChargeStatus;
  customer_ref: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

type StripeEvent = { id: string; type: string; processed_at: string };

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        Profile,
        Partial<Profile> & { id: string },
        Partial<Omit<Profile, "id">>
      >;
      analyses: Table<
        Analysis,
        Omit<Analysis, "id" | "created_at"> & Partial<Pick<Analysis, "id" | "created_at">>,
        Partial<Analysis>
      >;
      charges: Table<
        Charge,
        Omit<Charge, "id" | "annual_cents" | "created_at" | "updated_at" | "status" | "cancelled_at" | "customer_ref" | "occurrences"> &
          Partial<Pick<Charge, "status" | "customer_ref" | "occurrences">>,
        Partial<Omit<Charge, "id" | "annual_cents">>
      >;
      stripe_events: Table<StripeEvent, Omit<StripeEvent, "processed_at">, Partial<StripeEvent>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = Profile;
export type ChargeRow = Charge;
export type AnalysisRow = Analysis;
