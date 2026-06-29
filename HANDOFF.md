# Scheduling Project — Handoff

## Goal
A branded "Calendly replacement" for **3 brands** — ARK Academy, Para Transform,
Untamed Marriage — where each brand has its own branded booking page, but **all
bookings feed one calendar**. Engine = **Cal.com (Organization tier, white-label)**;
the booking widget is **embedded** into each brand's own site so the URL/branding
stays on-brand.

## Stack decisions (already made)
- Booking engine: **Cal.com**, Organization plan. Org domain: **ox.cal.com**
- Each brand = its own **Cal.com team**: `ark-academy`, `para-transform`, `untamed-marriage`
  (ARK confirmed live at `ox.cal.com/team/ark-academy`)
- Destination calendar: currently **@me.com (Apple/iCloud)** — connected & working.
  (Will optionally switch/add **chatch@arkfinancial.com** / Microsoft 365 once the
  tenant admin approves Cal.com's OAuth consent — that approval is still PENDING.)
- Pages are static HTML embedding the Cal.com inline widget, with a fallback link.

## Repo
- GitHub: `chatch-afk/ark-academy`
- Branch: `claude/calendly-replacement-951wk3` (NOT yet merged to main / live site)

## Files built (on the branch)
- `schedule.html` — ARK Academy branded "Book a Call" page. Embeds Cal.com.
  Config block near bottom (`const CAL = {...}`):
    origin:   'https://ox.cal.com'
    calLink:  'team/ark-academy'   (shows all 4 ARK events)
    brandColor: '#A98A5E'          (ARK gold)
- `book-template.html` — copy-paste template for Para Transform & Untamed Marriage's
  own sites. Has [EDIT] markers for title, colors, logo, copy, and the CAL block
  (origin/calLink/brandColor).
- `SCHEDULING-SETUP.md` — full Cal.com setup checklist (teams, events, calendar).
- `scripts/setup-cal-events.mjs` — Node 18+ script that creates all 12 event types
  via the Cal.com API. Run locally:
    CAL_API_KEY=cal_live_… node scripts/setup-cal-events.mjs        (dry run)
    CAL_API_KEY=cal_live_… LIVE=1 node scripts/setup-cal-events.mjs (apply)
  Safe to re-run (skips existing). Untested against live API — verify output.
- `index.html` — main ARK site; nav + CTA link to schedule.html.

## The 12 event types (4 per team)
| Event | Duration |
|---|---|
| Quick Intro | 15 min |
| Call | 30 min |
| Client Call | 60 min |
| Discovery Call | 60 min |

## Locations (per brand)
- ARK Academy → **Zoom** (install Zoom app in Cal.com first)
- Para Transform → **Google Meet** (connect Google account cory@paratransform.com,
  then install Google Meet app; KEEP destination calendar = @me.com)
- Untamed Marriage → **Attendee Phone Number** (you FaceTime the number; no app needed)

## STATUS — done vs remaining
DONE:
- [x] Cal.com Org account + 3 teams
- [x] @me.com calendar connected (app-specific password)
- [x] org domain ox.cal.com wired into ARK page; ARK team page loads
- [x] ARK branded page + embed built and verified loading
- [x] Para confirmed as Google Workspace (cory@paratransform.com) for Meet

REMAINING:
- [ ] Create the 12 event types (run scripts/setup-cal-events.mjs, OR manually:
      each team → Event Types → +New ×4). ~6 min manual.
- [ ] Install Zoom app (ARK) + Google Meet app (Para); set the 3 locations.
- [ ] Test booking on ARK → confirm it lands on @me.com + slot disappears.
- [ ] Get Para + Untamed brand colors (hex) + one-line taglines → fill book-template
      copies for those two sites.
- [ ] Merge branch to main so arkacademy.com/schedule.html goes live.
- [ ] (Later) When M365 admin approves, connect Office 365 in Cal.com and decide
      whether to switch destination calendar to chatch@arkfinancial.com.

## Open inputs needed
- Para Transform: accent color + tagline
- Untamed Marriage: accent color + tagline

## SECURITY
- A Cal.com API key (cal_live_…) was shared earlier in chat. **Rotate it**
  (Cal.com → Settings → Developer → API Keys → revoke + regenerate). Do NOT paste
  the key into documents or commit it — supply it only as the CAL_API_KEY env var
  when running the script.
- The "Create OAuth Client" screen in Cal.com is NOT needed (that's for the
  Platform/managed-users product) — ignore it.

## How "3 brands → 1 calendar" works
All 3 teams share the one connected calendar (@me.com). Cal.com reads its busy/free
to prevent cross-brand double-booking, and writes each new booking to it. The
branded pages just embed each team's booking page.
