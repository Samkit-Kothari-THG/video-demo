# Remotion Replit Starter

This project contains four Remotion compositions:

- `HelloWorld`
- `LaunchDay`
- `IntroSequence`
- `FirstTimeSpeakers`

## Run in Replit

1. Create a new Replit Node.js project.
2. Upload or paste this folder's files into the Replit workspace.
3. In the Replit shell, run:

```bash
npm install
npm run dev
```

Open the web preview and use Remotion Studio's render button, or render from the shell:

```bash
npm run render:hello
npm run render:launch
npm run render:intro
npm run render:fts
```

The 30-second First Time Speakers video does not require external assets.

Optional music: upload an MP3 into `public/`, for example `public/bensound-badass.mp3`, then render with:

```bash
npm run render:fts -- --props='{"musicSrc":"bensound-badass.mp3"}'
```

The rendered MP4 files are written to `out/`.
