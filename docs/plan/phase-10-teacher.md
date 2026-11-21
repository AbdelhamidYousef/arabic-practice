# Phase 10 — Teacher area

## Step 10.1 — teacher lessons API
- CRUD per contract; vocab replaced as a whole in one transaction; slug from title (unique); `forbidReadOnly`.
- Commit: `feat(api): add teacher lesson management`

## Step 10.2 — learners, transcripts, invites, usage API
- Per contract; ownership in every WHERE clause.
- Commit: `feat(api): add teacher views of learners, invites and ai usage`

## Step 10.3 — teacher lessons UI
- Lesson list, editor (fields + vocab rows, add/remove/reorder, Arabic inputs RTL), publish toggle;
  read-only banner and disabled controls for the demo teacher.
- Commit: `feat(web): add the teacher lesson editor`

## Step 10.4 — learners and usage UI
- Learners table, learner page (level select, mistakes by type, conversations), transcript page,
  invites (create, copy link once), usage page (calls/tokens per day, today vs caps).
- Commit: `feat(web): add teacher learner, invite and usage pages`
