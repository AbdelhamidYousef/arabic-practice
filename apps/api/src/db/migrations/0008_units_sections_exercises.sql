CREATE TYPE "public"."lesson_kind" AS ENUM('letters', 'lesson', 'review');--> statement-breakpoint
CREATE TABLE "lesson_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"type" text NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT "lesson_exercises_lesson_position_unique" UNIQUE("lesson_id","position")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level" "cefr_level" NOT NULL,
	"position" integer NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "units_code_unique" UNIQUE("code"),
	CONSTRAINT "units_level_position_unique" UNIQUE("level","position")
);
--> statement-breakpoint
ALTER TABLE "lesson_vocab" ADD COLUMN "translit" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "unit_id" uuid;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "kind" "lesson_kind" DEFAULT 'lesson' NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "grammar_note" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "culture_tip" jsonb;--> statement-breakpoint
ALTER TABLE "lesson_exercises" ADD CONSTRAINT "lesson_exercises_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lessons_unit_id_idx" ON "lessons" USING btree ("unit_id");