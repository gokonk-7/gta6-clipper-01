// gta6-clipper-01 — "Clip GTA 6 for the most YouTube views" (make.fun, $500).
//
// What this program is: the recipe for the clip, as code, plus the one job the
// gate needs — copying VIDEO.json from this repository to /output/VIDEO.json.
// It uses the Node standard library only, no network, no wall clock, no files
// outside the repository, so two runs write the same bytes.
//
// The clip, decided in the build session that wrote this file:
//   Source: Rockstar Games' "Grand Theft Auto VI Trailer 2" on YouTube
//   (https://www.youtube.com/watch?v=VQRLujxTm3c, 2:47). GTA 6 is not out yet,
//   so the official trailers are the only real footage.
//   Moment: one continuous 19-second run, t=110 to t=129 of Trailer 2.
//   It opens on the woman dancing on the car roof under the highway — the
//   single most "GTA 6" shot in the trailer — then runs through Lucia, a car
//   exploding on TV, the beach, a night truck chase, Ocean Drive and the pink
//   neon club, without a single slow second. That stretch is the hook: every
//   shot is a different Vice City fantasy, so a viewer who has waited 13 years
//   for this game keeps watching to see the next one.
//   Shape: vertical 9:16 (720x1280, 30fps, 28s total), a Short. The trailer
//   is 16:9 and the action moves across the frame, so the moment is shown
//   blur-filled: the full frame scaled to fit, over a blurred, darkened copy
//   of itself filling the vertical canvas. Nothing important is cropped away.
//   Hook text for the first 3 seconds: "GTA VI - MAY 26, 2026".
//   Pitch: after the moment, a 9-second end card over the trailer's neon VI
//   logo frame (t=158), with the pitch burned in large enough to read:
//   "MAKE CLIPS LIKE THIS / WITH AI - AND EARN / MONEY ON / make.fun" plus
//   the bounty page "make.fun/bounty/gta6-clipper-01". No voiceover: no TTS
//   tool was available in the build session, and on-screen text alone
//   satisfies the bounty ("on screen, spoken, or both").
//   Audio: the trailer's own audio for the 28 seconds, faded out over the
//   last 3 seconds of the end card.
//
// How the clip was rendered (the exact ffmpeg invocation, generated below
// from these same constants by ffmpegCommand()): trim the trailer to the
// moment, blur-fill it to vertical, burn in the hook text, hold the logo
// frame for the end card with the pitch text, concat, fade the audio out.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// It prints the recipe and the ffmpeg command, then copies VIDEO.json.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// --- The clip recipe -------------------------------------------------------

const SOURCE = {
  platform: 'YouTube',
  channel: 'Rockstar Games',
  title: 'Grand Theft Auto VI Trailer 2',
  videoId: 'VQRLujxTm3c',
  url: 'https://www.youtube.com/watch?v=VQRLujxTm3c',
  durationSeconds: 167,
};

const MOMENT = {
  startSeconds: 110,
  endSeconds: 129,
  seconds: 19,
  why: 'One continuous run: woman dancing on the car roof, Lucia, a car exploding on TV, the beach, a night truck chase, Ocean Drive, the pink neon club. No slow second; every shot is a different Vice City fantasy.',
};

const HOOK_TEXT = 'GTA VI - MAY 26, 2026';

const END_CARD = {
  logoFrameSeconds: 158,
  durationSeconds: 9,
  pitchLines: [
    'MAKE CLIPS LIKE THIS',
    'WITH AI - AND EARN',
    'MONEY ON',
    'make.fun',
  ],
  bountyPage: 'make.fun/bounty/gta6-clipper-01',
};

const OUTPUT = {
  width: 720,
  height: 1280,
  fps: 30,
  durationSeconds: MOMENT.seconds + END_CARD.durationSeconds,
  codec: 'libx264',
  crf: 20,
};

const FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';

// --- The ffmpeg command this recipe generates ------------------------------

function ffmpegCommand(): string {
  const { width: W, height: H } = OUTPUT;
  const fgH = Math.round((W * 360) / 640); // 720x405: full 16:9 frame fitted to width
  const fgY = Math.floor((H - fgH) / 2);
  void fgY;
  const filter = [
    '[0:v]split[bg][fg]',
    `[bg]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},gblur=sigma=40,eq=brightness=-0.18[bg2]`,
    `[fg]scale=${W}:${fgH}:flags=lanczos,unsharp=5:5:0.6:5:5:0.0[fg2]`,
    `[bg2][fg2]overlay=(W-w)/2:(H-h)/2,drawtext=fontfile=${FONT}:text='${HOOK_TEXT}':fontsize=42:fontcolor=white:borderw=2:bordercolor=black:x=(w-text_w)/2:y=64:box=1:boxcolor=black@0.55:boxborderw=12:enable='lt(t,3)',fps=30,setsar=1[v0]`,
    `[1:v]scale=${W}:${fgH}:flags=lanczos[lg]`,
    `color=c=black:s=${W}x${H}:r=30:d=${END_CARD.durationSeconds}[base]`,
    `[base][lg]overlay=(W-w)/2:(H-h)/2` +
      `,drawtext=fontfile=${FONT}:text='${END_CARD.pitchLines[0]}':fontsize=52:fontcolor=white:borderw=2:bordercolor=black:x=(w-text_w)/2:y=150:box=1:boxcolor=black@0.55:boxborderw=12` +
      `,drawtext=fontfile=${FONT}:text='${END_CARD.pitchLines[1]}':fontsize=52:fontcolor=white:borderw=2:bordercolor=black:x=(w-text_w)/2:y=240:box=1:boxcolor=black@0.55:boxborderw=12` +
      `,drawtext=fontfile=${FONT}:text='${END_CARD.pitchLines[2]}':fontsize=64:fontcolor=white:borderw=2:bordercolor=black:x=(w-text_w)/2:y=890:box=1:boxcolor=black@0.55:boxborderw=12` +
      `,drawtext=fontfile=${FONT}:text='${END_CARD.pitchLines[3]}':fontsize=92:fontcolor=#FF2E88:borderw=2:bordercolor=black:x=(w-text_w)/2:y=980:box=1:boxcolor=black@0.55:boxborderw=12` +
      `,drawtext=fontfile=${FONT}:text='${END_CARD.bountyPage}':fontsize=32:fontcolor=white:borderw=1:bordercolor=black:x=(w-text_w)/2:y=1130:box=1:boxcolor=black@0.55:boxborderw=10` +
      `,fps=30,setsar=1[v1]`,
    '[v0][v1]concat=n=2:v=1:a=0[vout]',
    `[0:a]atrim=0:${OUTPUT.durationSeconds},afade=t=out:st=${MOMENT.seconds}:d=3,aresample=44100[aout]`,
  ].join('; ');
  return [
    'ffmpeg -y',
    `-ss ${MOMENT.startSeconds} -t ${MOMENT.seconds} -i trailer2-360p.mp4`,
    `-loop 1 -t ${END_CARD.durationSeconds} -i logo-158.png`,
    `-filter_complex "${filter}"`,
    '-map "[vout]" -map "[aout]"',
    `-c:v ${OUTPUT.codec} -preset medium -crf ${OUTPUT.crf} -pix_fmt yuv420p`,
    '-c:a aac -b:a 128k -movflags +faststart -r 30',
    'gta6-clip-short.mp4',
  ].join(' ');
}

// --- The gate job: hand VIDEO.json over ------------------------------------

const YOUTUBE_URL =
  /^(https:\/\/(www\.|m\.)?youtube\.com\/(shorts\/|watch\?v=)|https:\/\/youtu\.be\/)[A-Za-z0-9_-]{11}/;

function main(): void {
  console.log(`Clip: ${SOURCE.title} (${SOURCE.url})`);
  console.log(`Moment: t=${MOMENT.startSeconds}-${MOMENT.endSeconds}s (${MOMENT.seconds}s)`);
  console.log(`Why: ${MOMENT.why}`);
  console.log(`Hook: ${HOOK_TEXT}`);
  console.log(`Pitch: ${END_CARD.pitchLines.join(' / ')} — ${END_CARD.bountyPage}`);
  console.log(`Output: ${OUTPUT.width}x${OUTPUT.height} ${OUTPUT.fps}fps, ${OUTPUT.durationSeconds}s`);
  console.log(`Render with: ${ffmpegCommand()}`);

  const videoPath = join(BOT_DIR, 'VIDEO.json');
  const video = JSON.parse(readFileSync(videoPath, 'utf8')) as { url?: unknown };
  if (
    typeof video.url !== 'string' ||
    video.url.includes('PLACEHOLDER') ||
    !YOUTUBE_URL.test(video.url)
  ) {
    console.error(`VIDEO.json does not name a YouTube video: ${videoPath}`);
    process.exit(1);
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(videoPath, join(OUTPUT_DIR, 'VIDEO.json'));
  console.log(`VIDEO.json copied to ${join(OUTPUT_DIR, 'VIDEO.json')}`);
}

main();
