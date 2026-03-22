


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."prune_qb_sync_audit"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM quickbooks_sync_audit
  WHERE created_at < now() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;


ALTER FUNCTION "public"."prune_qb_sync_audit"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_qb_credentials_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_qb_credentials_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."completion_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid",
    "created_by" "uuid",
    "recipient_email" "text",
    "status" "text" DEFAULT 'generated'::"text" NOT NULL,
    "report_payload" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "sent_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "cc_emails" "text"[],
    "auto_triggered" boolean DEFAULT false NOT NULL,
    "report_html" "text",
    "email_error" "text",
    "qb_invoice_id" "text",
    "qb_invoice_number" "text",
    "invoiced_at" timestamp with time zone,
    "line_items" "jsonb" DEFAULT '[]'::"jsonb",
    "total_amount" numeric(12,2) DEFAULT 0
);


ALTER TABLE "public"."completion_reports" OWNER TO "postgres";


COMMENT ON COLUMN "public"."completion_reports"."status" IS 'Report lifecycle: generated | sent | email_failed';



CREATE TABLE IF NOT EXISTS "public"."employment_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "full_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "address" "text",
    "city" "text",
    "state" "text",
    "zip" "text",
    "is_authorized_to_work" boolean DEFAULT false NOT NULL,
    "has_transportation" boolean DEFAULT false NOT NULL,
    "has_drivers_license" boolean DEFAULT false NOT NULL,
    "consent_to_background_check" boolean DEFAULT false NOT NULL,
    "years_experience" integer DEFAULT 0,
    "experience_description" "text",
    "specialties" "jsonb" DEFAULT '[]'::"jsonb",
    "available_days" "jsonb" DEFAULT '[]'::"jsonb",
    "preferred_start_date" timestamp with time zone,
    "is_full_time" boolean DEFAULT false,
    "references" "jsonb" DEFAULT '[]'::"jsonb",
    "how_did_you_hear" "text",
    "additional_notes" "text",
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "admin_notes" "text",
    "reviewed_by" "uuid",
    "reviewed_at" timestamp with time zone,
    "admin_notified" boolean DEFAULT false,
    "confirmation_sent" boolean DEFAULT false,
    "admin_email_error" "text",
    "confirmation_email_error" "text",
    "source_ip" "text",
    "submitted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "employment_applications_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'reviewed'::"text", 'interview_scheduled'::"text", 'interviewed'::"text", 'hired'::"text", 'rejected'::"text", 'withdrawn'::"text"])))
);


ALTER TABLE "public"."employment_applications" OWNER TO "postgres";


COMMENT ON COLUMN "public"."employment_applications"."status" IS 'Hiring pipeline: new → reviewed → interview_scheduled → interviewed → hired | rejected | withdrawn';



CREATE TABLE IF NOT EXISTS "public"."financial_snapshots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "period_start" "date" NOT NULL,
    "period_end" "date" NOT NULL,
    "total_revenue" numeric(12,2) DEFAULT 0,
    "outstanding_invoices" numeric(12,2) DEFAULT 0,
    "overdue_invoices" numeric(12,2) DEFAULT 0,
    "paid_invoices" numeric(12,2) DEFAULT 0,
    "source" "text" DEFAULT 'manual'::"text" NOT NULL,
    "source_payload" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."financial_snapshots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_dispatch_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid",
    "to_phone" "text" NOT NULL,
    "body" "text" NOT NULL,
    "send_after" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'queued'::"text" NOT NULL,
    "queued_reason" "text",
    "context" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "provider_sid" "text",
    "sent_at" timestamp with time zone,
    "error_text" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "dedup_key" "text",
    "attempts" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "notification_dispatch_queue_status_check" CHECK (("status" = ANY (ARRAY['queued'::"text", 'pending'::"text", 'sent'::"text", 'failed'::"text", 'permanently_failed'::"text", 'deduped'::"text"])))
);


ALTER TABLE "public"."notification_dispatch_queue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quickbooks_credentials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "realm_id" "text" NOT NULL,
    "company_name" "text",
    "access_token_encrypted" "text" NOT NULL,
    "refresh_token_encrypted" "text" NOT NULL,
    "access_token_expires_at" timestamp with time zone NOT NULL,
    "refresh_token_expires_at" timestamp with time zone NOT NULL,
    "scope" "text" DEFAULT 'com.intuit.quickbooks.accounting'::"text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "last_sync_at" timestamp with time zone,
    "last_sync_error" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."quickbooks_credentials" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quickbooks_sync_audit" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "text" NOT NULL,
    "action" "text" NOT NULL,
    "qb_id" "text",
    "request_payload" "jsonb" DEFAULT '{}'::"jsonb",
    "response_payload" "jsonb" DEFAULT '{}'::"jsonb",
    "error" "text",
    "triggered_by" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."quickbooks_sync_audit" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quickbooks_sync_mappings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entity_type" "text" NOT NULL,
    "local_id" "text" NOT NULL,
    "qb_id" "text" NOT NULL,
    "qb_sync_token" "text" DEFAULT '0'::"text" NOT NULL,
    "sync_hash" "text" DEFAULT ''::"text" NOT NULL,
    "last_synced_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."quickbooks_sync_mappings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quickbooks_sync_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid",
    "action" "text" NOT NULL,
    "payload" "jsonb" DEFAULT '{}'::"jsonb",
    "status" "text" DEFAULT 'queued'::"text" NOT NULL,
    "attempts" integer DEFAULT 0 NOT NULL,
    "max_attempts" integer DEFAULT 5 NOT NULL,
    "next_retry_at" timestamp with time zone,
    "last_error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone
);


ALTER TABLE "public"."quickbooks_sync_queue" OWNER TO "postgres";


ALTER TABLE ONLY "public"."completion_reports"
    ADD CONSTRAINT "completion_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employment_applications"
    ADD CONSTRAINT "employment_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."financial_snapshots"
    ADD CONSTRAINT "financial_snapshots_period_start_period_end_source_key" UNIQUE ("period_start", "period_end", "source");



ALTER TABLE ONLY "public"."financial_snapshots"
    ADD CONSTRAINT "financial_snapshots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_dispatch_queue"
    ADD CONSTRAINT "notification_dispatch_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quickbooks_credentials"
    ADD CONSTRAINT "quickbooks_credentials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quickbooks_credentials"
    ADD CONSTRAINT "quickbooks_credentials_realm_id_key" UNIQUE ("realm_id");



ALTER TABLE ONLY "public"."quickbooks_sync_audit"
    ADD CONSTRAINT "quickbooks_sync_audit_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quickbooks_sync_mappings"
    ADD CONSTRAINT "quickbooks_sync_mappings_entity_type_local_id_key" UNIQUE ("entity_type", "local_id");



ALTER TABLE ONLY "public"."quickbooks_sync_mappings"
    ADD CONSTRAINT "quickbooks_sync_mappings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quickbooks_sync_queue"
    ADD CONSTRAINT "quickbooks_sync_queue_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_completion_reports_job_auto_created" ON "public"."completion_reports" USING "btree" ("job_id", "auto_triggered", "created_at" DESC);



CREATE INDEX "idx_completion_reports_qb_invoice" ON "public"."completion_reports" USING "btree" ("qb_invoice_id") WHERE ("qb_invoice_id" IS NOT NULL);



CREATE INDEX "idx_completion_reports_status" ON "public"."completion_reports" USING "btree" ("status");



CREATE INDEX "idx_completion_reports_uninvoiced" ON "public"."completion_reports" USING "btree" ("created_at") WHERE (("qb_invoice_id" IS NULL) AND ("total_amount" IS NOT NULL) AND ("total_amount" > (0)::numeric));



CREATE INDEX "idx_employment_applications_email_created" ON "public"."employment_applications" USING "btree" ("email", "created_at" DESC);



CREATE INDEX "idx_employment_applications_reviewed_by" ON "public"."employment_applications" USING "btree" ("reviewed_by") WHERE ("reviewed_by" IS NOT NULL);



CREATE INDEX "idx_employment_applications_status_submitted" ON "public"."employment_applications" USING "btree" ("status", "submitted_at" DESC);



CREATE INDEX "idx_notification_dispatch_queue_dedup" ON "public"."notification_dispatch_queue" USING "btree" ("dedup_key", "created_at") WHERE ("status" = ANY (ARRAY['sent'::"text", 'queued'::"text", 'pending'::"text"]));



CREATE INDEX "idx_notification_dispatch_queue_status_send_after" ON "public"."notification_dispatch_queue" USING "btree" ("status", "send_after");



CREATE INDEX "idx_qb_audit_created" ON "public"."quickbooks_sync_audit" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_qb_audit_entity" ON "public"."quickbooks_sync_audit" USING "btree" ("entity_type", "entity_id");



CREATE INDEX "idx_qb_audit_errors" ON "public"."quickbooks_sync_audit" USING "btree" ("created_at" DESC) WHERE ("error" IS NOT NULL);



CREATE INDEX "idx_qb_credentials_realm_active" ON "public"."quickbooks_credentials" USING "btree" ("realm_id") WHERE ("is_active" = true);



CREATE INDEX "idx_qb_credentials_token_expiry" ON "public"."quickbooks_credentials" USING "btree" ("access_token_expires_at") WHERE ("is_active" = true);



CREATE INDEX "idx_qb_sync_mappings_entity_type" ON "public"."quickbooks_sync_mappings" USING "btree" ("entity_type");



CREATE INDEX "idx_qb_sync_mappings_qb_id" ON "public"."quickbooks_sync_mappings" USING "btree" ("entity_type", "qb_id");



CREATE INDEX "idx_qb_sync_queue_status" ON "public"."quickbooks_sync_queue" USING "btree" ("status", "next_retry_at") WHERE ("status" = ANY (ARRAY['queued'::"text", 'retrying'::"text"]));



CREATE OR REPLACE TRIGGER "trg_qb_credentials_updated_at" BEFORE UPDATE ON "public"."quickbooks_credentials" FOR EACH ROW EXECUTE FUNCTION "public"."update_qb_credentials_updated_at"();



ALTER TABLE ONLY "public"."quickbooks_credentials"
    ADD CONSTRAINT "quickbooks_credentials_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE "public"."employment_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."financial_snapshots" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public_insert_applications" ON "public"."employment_applications" FOR INSERT WITH CHECK (true);



ALTER TABLE "public"."quickbooks_credentials" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quickbooks_sync_audit" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quickbooks_sync_mappings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quickbooks_sync_queue" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "service_role_financial_snapshots" ON "public"."financial_snapshots" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "service_role_full_access" ON "public"."quickbooks_credentials" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "service_role_sync_audit" ON "public"."quickbooks_sync_audit" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "service_role_sync_mappings" ON "public"."quickbooks_sync_mappings" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "service_role_sync_queue" ON "public"."quickbooks_sync_queue" TO "service_role" USING (true) WITH CHECK (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."prune_qb_sync_audit"() TO "anon";
GRANT ALL ON FUNCTION "public"."prune_qb_sync_audit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prune_qb_sync_audit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_qb_credentials_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_qb_credentials_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_qb_credentials_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."completion_reports" TO "anon";
GRANT ALL ON TABLE "public"."completion_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."completion_reports" TO "service_role";



GRANT ALL ON TABLE "public"."employment_applications" TO "anon";
GRANT ALL ON TABLE "public"."employment_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."employment_applications" TO "service_role";



GRANT ALL ON TABLE "public"."financial_snapshots" TO "anon";
GRANT ALL ON TABLE "public"."financial_snapshots" TO "authenticated";
GRANT ALL ON TABLE "public"."financial_snapshots" TO "service_role";



GRANT ALL ON TABLE "public"."notification_dispatch_queue" TO "anon";
GRANT ALL ON TABLE "public"."notification_dispatch_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_dispatch_queue" TO "service_role";



GRANT ALL ON TABLE "public"."quickbooks_credentials" TO "anon";
GRANT ALL ON TABLE "public"."quickbooks_credentials" TO "authenticated";
GRANT ALL ON TABLE "public"."quickbooks_credentials" TO "service_role";



GRANT ALL ON TABLE "public"."quickbooks_sync_audit" TO "anon";
GRANT ALL ON TABLE "public"."quickbooks_sync_audit" TO "authenticated";
GRANT ALL ON TABLE "public"."quickbooks_sync_audit" TO "service_role";



GRANT ALL ON TABLE "public"."quickbooks_sync_mappings" TO "anon";
GRANT ALL ON TABLE "public"."quickbooks_sync_mappings" TO "authenticated";
GRANT ALL ON TABLE "public"."quickbooks_sync_mappings" TO "service_role";



GRANT ALL ON TABLE "public"."quickbooks_sync_queue" TO "anon";
GRANT ALL ON TABLE "public"."quickbooks_sync_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."quickbooks_sync_queue" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































