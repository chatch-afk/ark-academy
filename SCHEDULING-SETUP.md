# Scheduling Setup — 3 Brands, 1 Calendar (Cal.com)

This is the plan for branded booking links for **ARK Academy**, **Para Transform**, and
**Untamed Marriage** that all feed a **single calendar** on your end. Each brand gets its
own branded page; Cal.com checks your one calendar so no two brands can double-book the
same slot, and every booking lands on that calendar automatically.

The website side is already built:

| File | Brand | What it is |
|------|-------|------------|
| `schedule.html` | ARK Academy | Branded page with the Cal.com scheduler embedded |
| `book-template.html` | Para Transform / Untamed Marriage | Copy-paste template for the other brands' sites |

You only need to (1) set up Cal.com once and (2) paste your real Cal.com handle into the
config block of each page.

---

## Part 1 — Cal.com account (one-time, ~15 min)

1. **Create one account** at https://cal.com (the *same* account powers all three brands).
2. **Connect your single calendar** — this is the only step that differs by provider:
   - **Google Workspace:** Settings → *Apps* / *Calendars* → **Connect Google Calendar** → sign in → allow.
   - **Microsoft 365:** Settings → *Calendars* → **Connect Outlook/Office 365 Calendar** → sign in → allow.
   - Make sure this connected calendar is set as both the **"check for conflicts"** and the
     **"add bookings to"** calendar. That's what makes all brands share one calendar.
3. **Set your availability** (e.g. Mon–Fri 9–5). You can create multiple schedules later if
   a brand needs different hours.

## Part 2 — One team per brand (gives each its own branded link)

For **each** brand (ARK Academy, Para Transform, Untamed Marriage):

1. **Create a Team** (Teams → *New*). Name it for the brand. This gives you a clean URL:
   `cal.com/ark-academy`, `cal.com/para-transform`, `cal.com/untamed-marriage`.
2. In the team's **Appearance/Branding**, set the **logo**, **brand color**, and bio for
   that brand.
3. Add yourself as the team member so bookings flow to your connected calendar.
4. **Create the event types** for that brand (e.g. *Discovery Call · 60 min*,
   *Quick Intro · 15 min*). These show up at `cal.com/<team>/<event>`.

> **Note on plans:** custom branding + custom domains are part of Cal.com's **Teams/Org**
> paid tier (the free tier works but shows Cal.com branding and uses `cal.com/...` URLs).
> Confirm current pricing at https://cal.com/pricing — it's modest per month.

## Part 3 — Branded URLs on your own domains (optional, recommended)

To make links read as your brand instead of `cal.com/...`:

- Easiest: link to a page on your own site (e.g. `arkacademy.com/schedule.html`) which embeds
  Cal.com — **this is already what `schedule.html` does.**
- Fuller: on the Organization tier, map a subdomain like `book.arkacademy.com` directly to the
  Cal.com team page.

---

## Part 4 — Wire each page to Cal.com (2 lines per page)

### ARK Academy — `schedule.html`
Open the file, find the `CAL` config block near the bottom, and set:

```js
const CAL = {
  calLink: 'ark-academy',        // ← your real Cal.com team handle (or 'ark-academy/discovery-call')
  brandColor: '#A98A5E',         // already ARK gold
  namespace: 'arkacademy'
};
```

### Para Transform & Untamed Marriage — from `book-template.html`
1. Copy `book-template.html` into that brand's site (rename to `schedule.html` or similar).
2. Search the file for `[EDIT]` and update: title, colors (`:root`), nav logo, page copy, footer.
3. Set its `CAL` block:

```js
const CAL = {
  calLink: 'para-transform',     // or 'untamed-marriage'
  brandColor: '#C96E4A',         // that brand's accent
  namespace: 'paratransform'     // any unique string
};
```

That's it. `calLink` pointing at the **team handle** shows all of that brand's event types;
pointing at `team/event` jumps straight into one meeting.

---

## How "all feeds to 1 calendar" works

```
 ARK Academy page ─┐
 Para Transform  ─┼─►  Cal.com (your 1 connected calendar)
 Untamed Marriage ─┘       │
                           ├─ reads busy/free  → no cross-brand double-booking
                           └─ writes the event → shows on your calendar + sends invites
```

Because all three teams share the same connected calendar, a booking on any brand instantly
removes that time from the other two.

---

## Quick test checklist

- [ ] Open `schedule.html` — the scheduler loads inside your branded page.
- [ ] Book a test slot on ARK Academy → it appears on your calendar + you get an invite.
- [ ] Open another brand's page → that same time slot is no longer offered.
- [ ] Confirm reminder/confirmation emails look right (set sender name per team in Cal.com).

## If the embed doesn't load
The pages have a built-in fallback: if Cal.com is blocked (e.g. an ad-blocker), visitors see
an **"Open booking page"** button that links straight to your Cal.com page, so you never lose
a booking.
