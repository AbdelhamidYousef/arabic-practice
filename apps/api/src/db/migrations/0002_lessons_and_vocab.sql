CREATE TYPE "public"."lesson_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "lesson_vocab" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"arabic" text NOT NULL,
	"arabic_plain" text NOT NULL,
	"english" text NOT NULL,
	"note" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_vocab_lesson_plain_unique" UNIQUE("lesson_id","arabic_plain")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"level" "cefr_level" NOT NULL,
	"topic" text NOT NULL,
	"summary" text NOT NULL,
	"goals" text[] DEFAULT '{}' NOT NULL,
	"grammar_focus" text DEFAULT '' NOT NULL,
	"scenario" text NOT NULL,
	"opening_line" text NOT NULL,
	"status" "lesson_status" DEFAULT 'draft' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lessons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "lesson_vocab" ADD CONSTRAINT "lesson_vocab_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lesson_vocab_lesson_position_idx" ON "lesson_vocab" USING btree ("lesson_id","position");--> statement-breakpoint
CREATE INDEX "lessons_teacher_status_level_position_idx" ON "lessons" USING btree ("teacher_id","status","level","position");--> statement-breakpoint
-- hand-written (drizzle-kit does not model triggers): keep this line if the migration is regenerated.
CREATE TRIGGER lessons_set_updated_at BEFORE UPDATE ON "lessons" FOR EACH ROW EXECUTE FUNCTION set_updated_at();
