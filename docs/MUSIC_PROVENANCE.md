# Music provenance register

**Register date:** 2026-07-30  
**Catalogue version:** 2  
**Rights basis:** Project-original, deterministic, sample-free compositions

This register covers the audio shipped in the invitation soundtrack catalogue.
It is provenance evidence, not a substitute for qualified legal review.

## Rights statement

- Every listed master is rendered by
  `scripts/generate-original-music.mjs`.
- The note sequences, arrangements, synthesis, percussion, stereo ambience,
  and mastering logic are contained in that repository file.
- No downloaded recording, third-party sample pack, copyrighted song stem,
  artist voice, or reference audio is used.
- No listed cue is an arrangement, interpolation, or deliberate imitation of
  a named commercial song.
- Attribution is not required for invitation videos created by this product.
- The files may be used in commercial invitation renders made by this product.
- Do not register these shared catalogue masters with an automated Content ID
  service without a product-level decision; doing so could create claims
  against customers who legitimately use them.

If the owner wants to make the standalone masters available to everyone as
"copyright-free" assets, use a deliberate rights-holder action such as the
[CC0 1.0 Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).
The product does not apply CC0 automatically because only the rightsholder can
make that dedication.

## Master records

All masters are 30 seconds, stereo, 44.1 kHz, 16-bit PCM WAV. They target
-16 dBFS measured RMS, retain at least 1 dB of peak headroom, and contain no
clipped samples. A 2026-07-30 EBU R128 pass measured the masters between
-13.9 and -14.9 LUFS with true peaks no higher than -1.1 dBTP. The shared
render gain is 0.5 (-6.0 dB); the representative Monsoon Letters invitation
render measured -20.4 LUFS and -8.6 dBTP after fades and AAC encoding.

| Track | BPM | Style | File | SHA-256 |
| --- | ---: | --- | --- | --- |
| Marigold Air | 96 | Indian indie-folk | `public/engagement/indian-instrumental.wav` | `3168d19a275e16868e9cb103b5ea098307f8588d6ce51ab5028567d60974fe9a` |
| Moonlit Vows | 72 | Cinematic neo-classical | `public/music/moonlit-vows.wav` | `568af013dbe1fccbff2b4ccf8ac55c336603441b76edaae98464941163874e8c` |
| Celebration Afterglow | 120 | Nu-disco pop | `public/music/celebration-afterglow.wav` | `6c615591a1044521301af288c210b1c213ac06604bbaaa3ecb619092de9dcc09` |
| Little Wonder | 80 | Modern lullaby | `public/music/little-wonder.wav` | `09492a5035851a6276ecbcf3955b726961979d0f7b2acef7409a1bdd94e23432` |
| Morning Courtyard | 100 | Acoustic Indian folk | `public/music/morning-courtyard.wav` | `753766b725de3ac0779aec75769afe53cef013b5487d1dcd987ef1352f5e9802` |
| Monsoon Letters | 84 | Indian indie / lo-fi | `public/music/monsoon-letters.wav` | `15932ca4a34226db7e44425a289a4ccf59ab38c56c990e2015c06106e4a99b19` |
| Saffron Skyline | 112 | Organic Indian house | `public/music/saffron-skyline.wav` | `32deda8be23086b07bc48f521df5a2be16c3dab90ed515b38255b1d56441d392` |
| First Light, Slowly | 80 | Ambient piano | `public/music/first-light.wav` | `08219112a6731619566aabf3373e66fe2c3d8ab61940d5c41e97a62887f1360c` |

## Reproduction and review

Run:

```bash
npm run music:generate
shasum -a 256 public/engagement/indian-instrumental.wav public/music/*.wav
```

The generator is deterministic. A changed hash therefore indicates a changed
generator, arrangement, render environment, or master. Review and update this
register whenever a cue or generator changes.

Before a public launch, the content owner should confirm the rights statement,
approve the product's customer-use licence, and decide whether standalone
redistribution of the masters is allowed.
