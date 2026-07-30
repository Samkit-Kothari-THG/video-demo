# Music provenance register

**Register date:** 2026-07-30  
**Catalogue version:** 2  
**Rights basis:** Project-original, deterministic, sample-free compositions

This register covers the audio shipped in the invitation soundtrack catalogue.
Lossless WAV masters live outside `public/`; compact MP3 delivery files are
used by browser previews and final renders. This is provenance evidence, not a
substitute for qualified legal review.

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
| Marigold Air | 96 | Indian indie-folk | `assets/music-masters/marigold-air.wav` | `3168d19a275e16868e9cb103b5ea098307f8588d6ce51ab5028567d60974fe9a` |
| Moonlit Vows | 72 | Cinematic neo-classical | `assets/music-masters/moonlit-vows.wav` | `568af013dbe1fccbff2b4ccf8ac55c336603441b76edaae98464941163874e8c` |
| Celebration Afterglow | 120 | Nu-disco pop | `assets/music-masters/celebration-afterglow.wav` | `6c615591a1044521301af288c210b1c213ac06604bbaaa3ecb619092de9dcc09` |
| Little Wonder | 80 | Modern lullaby | `assets/music-masters/little-wonder.wav` | `09492a5035851a6276ecbcf3955b726961979d0f7b2acef7409a1bdd94e23432` |
| Morning Courtyard | 100 | Acoustic Indian folk | `assets/music-masters/morning-courtyard.wav` | `753766b725de3ac0779aec75769afe53cef013b5487d1dcd987ef1352f5e9802` |
| Monsoon Letters | 84 | Indian indie / lo-fi | `assets/music-masters/monsoon-letters.wav` | `15932ca4a34226db7e44425a289a4ccf59ab38c56c990e2015c06106e4a99b19` |
| Saffron Skyline | 112 | Organic Indian house | `assets/music-masters/saffron-skyline.wav` | `32deda8be23086b07bc48f521df5a2be16c3dab90ed515b38255b1d56441d392` |
| First Light, Slowly | 80 | Ambient piano | `assets/music-masters/first-light.wav` | `08219112a6731619566aabf3373e66fe2c3d8ab61940d5c41e97a62887f1360c` |

Delivery files are deterministic 192 kbps MP3 encodes produced with the
FFmpeg binary bundled by Remotion:

| File | SHA-256 |
| --- | --- |
| `public/music/marigold-air.mp3` | `060f42761db62b8901b29c6716d00b953ab5c37959a6fa91a6387d4e274131e9` |
| `public/music/moonlit-vows.mp3` | `e69d4583a26f12cd9009d95a401e15389dc2befbf2f889660bef9db7741b0b96` |
| `public/music/celebration-afterglow.mp3` | `f0ce8abec77a32c3cf62d8b6e92b018695d0028016f1c5a3fded11472877f707` |
| `public/music/little-wonder.mp3` | `560ad6dae148a9741a3d1c0865a897c775d34ea0209e34c8042034a39e5205c3` |
| `public/music/morning-courtyard.mp3` | `bc78172810b686bde613ca8180ce27a1af11c237c80e27f69e1eb91970320015` |
| `public/music/monsoon-letters.mp3` | `bba496bae858a7ec50d3f973f86bc12233b93f3961c7736b96825101d6c284d6` |
| `public/music/saffron-skyline.mp3` | `7ca3fbf76eb7a62a369fc69203c4f5c38bbac24eafb8b9554a4cd1f63675d579` |
| `public/music/first-light.mp3` | `7ea28f4726ec7e42e782492218bd0307be1ede3fcf8cc2f9ab77d5fc89ba6731` |

## Reproduction and review

Run:

```bash
npm run music:generate
shasum -a 256 assets/music-masters/*.wav public/music/*.mp3
```

The generator and delivery encoder are deterministic for the pinned Remotion
release. A changed hash therefore indicates a changed generator, arrangement,
render environment, codec, or master. Review and update this register whenever
a cue, generator, or encoder changes.

Before a public launch, the content owner should confirm the rights statement,
approve the product's customer-use licence, and decide whether standalone
redistribution of the masters is allowed.
