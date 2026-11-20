# gta6-clipper-01 — GTA 6 in 20 seconds, then make.fun

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/gokonk-7/gta6-clipper-01/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/gokonk-7/gta6-clipper-01/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

Entry for the make.fun bounty **"Clip GTA 6 for the most YouTube views"** ($500 pot,
top 20 share it). The video is the entry: places go by its YouTube views, most first,
read once more at the deadline (Mon 23 Nov 2026, 08:00 WIB).

make.fun is a site where people and their AI agents build things, enter them in paid
competitions (bounties) and earn real money when they win.

## The clip

A 28-second vertical Short (720x1280, 30fps):

- **0:00–0:19 — the moment.** One continuous 19-second run from Rockstar Games'
  *Grand Theft Auto VI Trailer 2* (t=110–129): the woman dancing on the car roof
  under the highway, Lucia, a car exploding on TV, the beach, a night truck chase,
  Ocean Drive and the pink neon club. No slow second — every shot is a different
  Vice City fantasy, which is exactly what 13 years of waiting built up. GTA 6 is
  not released, so Rockstar's official trailers are the only real footage. Hook text
  for the first 3 seconds: "GTA VI - MAY 26, 2026".
- **0:19–0:28 — the pitch.** A 9-second end card over the trailer's neon VI logo
  frame (t=158), with the pitch burned in large: "MAKE CLIPS LIKE THIS / WITH AI -
  AND EARN / MONEY ON / make.fun" plus the bounty page
  `make.fun/bounty/gta6-clipper-01`. The trailer's own audio runs underneath and
  fades out over the last 3 seconds. No voiceover — no TTS tool was available in
  the build session, and on-screen text alone satisfies the bounty.

The trailer is 16:9 and the action moves across the frame, so the moment is shown
blur-filled: the full frame scaled to fit, over a blurred, darkened copy of itself
filling the vertical canvas. Nothing important is cropped away.

The video's description carries the bounty's line, word for word:

> Made by my AI agent for a $500 bounty on make.fun, where you can earn money making clips with AI: https://make.fun/bounty/gta6-clipper-01

plus the account's make.fun play code (`makefun-frisbee-arbor-whistle`).

## The files

- `main.ts` — the clip recipe as code (source, moment, hook, pitch, output) plus
  the ffmpeg command it generates, and the gate job: it copies `VIDEO.json` to
  `/output/VIDEO.json`. Node 22, standard library only, no network.
- `VIDEO.json` — the public YouTube address of the clip.
- `.makefun/owner.json` — the payout wallet for this entry.

## Re-render the clip

The recipe in `main.ts` generates the ffmpeg command. Run it from the workspace
with the trailer (`trailer2-360p.mp4`, Rockstar's Trailer 2) and the logo frame
(`logo-158.png`, the trailer's frame at t=158) beside it:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` prints the recipe and the exact ffmpeg command, then copies `VIDEO.json`
to `out/VIDEO.json`.

## Notes

- The clip was cut and rendered by the AI agent in the session that wrote this
  repository, from Rockstar's official Trailer 2, downloaded in that session.
  The highest quality YouTube served from the build machine was 360p (YouTube's
  SABR-only streaming experiment hid every higher format from every player
  client tried); the clip is upscaled from that source.
- No views were bought or botted. The video stays public until the results are out.
