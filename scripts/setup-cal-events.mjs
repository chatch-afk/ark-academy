#!/usr/bin/env node
/**
 * Create the 12 Cal.com event types (4 per team) for the 3 brands,
 * with the right durations and locations.
 *
 * WHY A SCRIPT: Cal.com is blocked from the environment this was built in,
 * so it has to run from a machine that can reach api.cal.com (i.e. yours).
 *
 * USAGE (Node 18+, no install needed):
 *   1. Dry run — shows exactly what it will create, changes nothing:
 *        CAL_API_KEY=cal_live_xxx node scripts/setup-cal-events.mjs
 *   2. For real:
 *        CAL_API_KEY=cal_live_xxx LIVE=1 node scripts/setup-cal-events.mjs
 *
 * It is SAFE to re-run: it skips any event type whose slug already exists
 * on a team, so a half-finished run just fills in the gaps.
 *
 * If the API rejects a field (Cal.com's schema shifts), the script prints
 * the full error response — paste that back and I'll adjust the mapping.
 */

const API = 'https://api.cal.com/v2';
const KEY = process.env.CAL_API_KEY;
const LIVE = process.env.LIVE === '1';
const API_VERSION = process.env.CAL_API_VERSION || '2024-08-13';

if (!KEY) {
  console.error('✗ Set CAL_API_KEY (your cal_live_… key). Aborting.');
  process.exit(1);
}

/* ── What to build ────────────────────────────────────────────────────────
   Each team gets the same 4 events; the LOCATION differs per brand.
   Location formats (Cal.com v2):
     Zoom        → { type: 'integration', integration: 'zoom' }
     Google Meet → { type: 'integration', integration: 'google-meet' }
     Attendee phone (you call/FaceTime them) → { type: 'attendeePhone' }
   NOTE: the Zoom / Google Meet apps must already be INSTALLED in Cal.com,
   otherwise those locations won't attach. (Untamed needs no app.)
─────────────────────────────────────────────────────────────────────────── */
const TEAMS = [
  { slug: 'ark-academy',      location: { type: 'integration', integration: 'zoom' } },
  { slug: 'para-transform',   location: { type: 'integration', integration: 'google-meet' } },
  { slug: 'untamed-marriage', location: { type: 'attendeePhone' } },
];

const EVENTS = [
  { title: 'Quick Intro',    slug: 'quick-intro',    lengthInMinutes: 15, description: 'A quick first-touch conversation.' },
  { title: 'Call',           slug: 'call',           lengthInMinutes: 30, description: 'A 30-minute conversation.' },
  { title: 'Client Call',    slug: 'client-call',    lengthInMinutes: 60, description: 'A 60-minute call for existing clients.' },
  { title: 'Discovery Call', slug: 'discovery-call', lengthInMinutes: 60, description: 'A 60-minute discovery conversation.' },
];

const headers = () => ({
  Authorization: `Bearer ${KEY}`,
  'cal-api-version': API_VERSION,
  'Content-Type': 'application/json',
});

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { ok: res.ok, status: res.status, json };
}

const arr = (r) => (Array.isArray(r) ? r : r?.data ?? r?.teams ?? r?.eventTypes ?? []);

async function main() {
  console.log(`\nCal.com event setup — ${LIVE ? 'LIVE (will create)' : 'DRY RUN (no changes)'}\n`);

  // Who am I (host for the team events)
  const me = await api('GET', '/me');
  if (!me.ok) { console.error('✗ Could not read /me:', me.status, me.json); process.exit(1); }
  const userId = me.json?.data?.id ?? me.json?.id;
  console.log(`Authenticated as userId=${userId} (${me.json?.data?.email ?? ''})`);

  // Find the teams by slug
  const teamsRes = await api('GET', '/teams');
  if (!teamsRes.ok) { console.error('✗ Could not list /teams:', teamsRes.status, teamsRes.json); process.exit(1); }
  const allTeams = arr(teamsRes.json);
  console.log(`Found ${allTeams.length} team(s): ${allTeams.map(t => t.slug).join(', ') || '(none)'}\n`);

  let created = 0, skipped = 0, failed = 0;

  for (const team of TEAMS) {
    const match = allTeams.find(t => t.slug === team.slug);
    if (!match) {
      console.warn(`⚠ Team "${team.slug}" not found — skipping its 4 events. (Check the slug.)`);
      failed += EVENTS.length;
      continue;
    }
    const teamId = match.id;
    console.log(`▶ ${team.slug} (teamId=${teamId}) — location: ${JSON.stringify(team.location)}`);

    // existing event slugs on this team (so re-runs are safe)
    const existingRes = await api('GET', `/teams/${teamId}/event-types`);
    const existing = arr(existingRes.json).map(e => e.slug);

    for (const ev of EVENTS) {
      if (existing.includes(ev.slug)) {
        console.log(`   ↷ ${ev.slug} already exists — skip`);
        skipped++;
        continue;
      }
      const body = {
        title: ev.title,
        slug: ev.slug,
        description: ev.description,
        lengthInMinutes: ev.lengthInMinutes,
        locations: [team.location],
        schedulingType: 'roundRobin',
        hosts: [{ userId, mandatory: true }],
      };
      if (!LIVE) {
        console.log(`   + would create ${ev.slug} (${ev.lengthInMinutes}m)`);
        created++;
        continue;
      }
      const r = await api('POST', `/teams/${teamId}/event-types`, body);
      if (r.ok) { console.log(`   ✓ created ${ev.slug} (${ev.lengthInMinutes}m)`); created++; }
      else { console.error(`   ✗ FAILED ${ev.slug}: ${r.status}`, JSON.stringify(r.json)); failed++; }
    }
  }

  console.log(`\nDone. ${LIVE ? 'created' : 'would create'}=${created}, skipped=${skipped}, failed=${failed}`);
  if (!LIVE) console.log('Re-run with LIVE=1 to apply.');
}

main().catch(e => { console.error('Unexpected error:', e); process.exit(1); });
