# Scheduling Setup — 3 Brands, 12 Events, 1 Calendar (Cal.com + Microsoft 365)

**Goal:** branded booking links for **ARK Academy**, **Para Transform**, and **Untamed
Marriage**, each offering the same 4 meetings, with **every booking landing on one calendar —
`chatch@arkfinancial.com` (Microsoft 365 / Outlook)**. Because all three share that one
connected calendar, no two brands can ever double-book the same slot.

The website side is already built:

| File | Brand | What it is |
|------|-------|------------|
| `schedule.html` | ARK Academy | Branded page with the Cal.com scheduler embedded (in this repo) |
| `book-template.html` | Para Transform / Untamed Marriage | Copy-paste template for the other brands' sites |

You do the Cal.com setup once (below), paste each brand's handle into the page config, done.

---

## The 12 event types (4 per brand)

| Service | Duration | Suggested slug | Audience |
|---|---|---|---|
| Quick Intro | 15 min | `quick-intro` | First-touch / fit check |
| Call | 30 min | `call` | General conversation |
| Client Call | 60 min | `client-call` | Existing clients |
| Discovery Call | 60 min | `discovery-call` | Prospects (deeper) |

Create these **4 under each team** (12 total). The two 60-min events are distinguished by
name + description; that's fine.

---

## Part 1 — Cal.com account + connect your ONE calendar (~5 min)

1. Create one account at https://cal.com (this single account powers all three brands).
2. **Connect Microsoft 365:** Settings → **Calendars** → **Connect** → **Office 365 Calendar**
   → sign in as `chatch@arkfinancial.com` → allow.
3. Set that calendar as both:
   - **"Check for conflicts"** (so your real Outlook events block availability), and
   - **"Add to calendar"** (so new bookings appear on `chatch@arkfinancial.com`).
   This is what makes all three brands feed your one ARK calendar.
4. Set your default availability (e.g. Mon–Fri 9–5). You can vary it per brand later.
5. (Recommended) Connect your video tool — **Microsoft Teams** or Zoom — under
   *Apps*, so each booking auto-creates a meeting link.

## Part 2 — One team per brand (gives each its own branded link) — ~5 min

For **each** brand, repeat:

1. **Teams → New team.** Name + slug:
   - ARK Academy → `ark-academy` → `cal.com/team/ark-academy`
   - Para Transform → `para-transform` → `cal.com/team/para-transform`
   - Untamed Marriage → `untamed-marriage` → `cal.com/team/untamed-marriage`
2. **Branding** (team → Appearance): upload that brand's **logo**, set its **brand color**,
   and write the team bio.
3. Make sure **you** are the team member, so bookings flow to your connected calendar.
4. **Add the 4 event types** (from the table above). For each: set duration, a short
   description, buffers if you want (e.g. 10-min after), and location = Microsoft Teams.

> Repeat for all 3 teams → 12 event types total.

## Part 3 — Plan / branding notes (read once)

- **Per-brand logo + color in the booker + removing "Cal.com" branding** = Cal.com's
  **Teams** plan. Confirm current price at https://cal.com/pricing (you're a single user, so
  it's one seat).
- **Branded URL on your own domain** is already handled for free by the embed: visitors land
  on `arkacademy.com/schedule.html` (your domain, your wrapper). A *native* Cal subdomain like
  `book.arkacademy.com` requires the **Organizations** tier — only get that if you specifically
  want it; the embed makes it unnecessary.

---

## Part 4 — Wire each page to Cal.com (2 lines per page)

### ARK Academy — `schedule.html` (this repo)
Find the `CAL` config block near the bottom and set `calLink` to your real team handle:

```js
const CAL = {
  calLink: 'team/ark-academy',   // shows all 4 ARK events; or 'team/ark-academy/discovery-call' for one
  brandColor: '#A98A5E',         // ARK gold (already set)
  namespace: 'arkacademy'
};
```

### Para Transform & Untamed Marriage — from `book-template.html`
1. Copy `book-template.html` into that brand's site (rename to `schedule.html`).
2. Search for `[EDIT]` and update title, colors, logo, copy, footer.
3. Set its `CAL` block, e.g.:

```js
const CAL = {
  calLink: 'team/para-transform',   // or 'team/untamed-marriage'
  brandColor: '#C96E4A',            // that brand's accent
  namespace: 'paratransform'        // any unique string
};
```

> Note: a team booking page is usually `cal.com/team/<slug>`, so the embed `calLink` is
> `team/<slug>`. If your account shows the team at `cal.com/<slug>` instead, drop the
> `team/` prefix. Either way, the page's built-in fallback link will confirm the right URL.

---

## How "all feeds to 1 calendar" works

```
 ARK Academy   (4 events) ─┐
 Para Transform(4 events) ─┼─►  Cal.com  ──►  chatch@arkfinancial.com (Outlook)
 Untamed Marriage (4)     ─┘        │
                                    ├─ reads busy/free  → no cross-brand double-booking
                                    └─ writes the event → shows on your ARK calendar + invites
```

## Quick test checklist
- [ ] Open `schedule.html` — the ARK scheduler loads inside your branded page, showing 4 events.
- [ ] Book a test slot → it appears on `chatch@arkfinancial.com` and you get an invite.
- [ ] Open another brand's page → that same time is no longer offered (shared calendar works).
- [ ] Confirm the Teams/Zoom link is attached and reminder emails look right.

## If the embed is ever blocked
Each page has a built-in fallback: if Cal.com can't load (e.g. an ad-blocker), visitors see an
**"Open booking"** button linking straight to your Cal.com page — so you never lose a booking.
