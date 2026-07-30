# Soundtrack competitor audit and catalogue direction

**Audit date:** 2026-07-30  
**Market focus:** Mobile-first Indian invitations shared through Reels,
WhatsApp, and direct messages

## Executive decision

Competing on catalogue size is not realistic for this product today. Canva,
Adobe Express, and Renderforest can offer very large stock catalogues because
audio is one part of a broad creation platform. The more defensible near-term
position is a small, clearly cleared, invitation-specific catalogue whose cues
are already structured for the product's 30-second scene rhythm.

The shipped response is eight project-original stereo cues, ranked by template
fit and described with style, BPM, energy, and rights metadata. Three cues add
directions that were missing from the original five-track library:

- `Monsoon Letters`: intimate Indian indie / lo-fi romance.
- `Saffron Skyline`: modern organic dance energy without a film-song copy.
- `First Light, Slowly`: restrained ambient piano for minimal designs.

## Competitor comparison

| Product | Publicly advertised music experience | What it means for this product |
| --- | --- | --- |
| [Canva wedding invitation videos](https://www.canva.com/create/wedding-invitation-videos/) | Large template ecosystem, music selection, and automatic Beat Sync in its video tooling. | Match the feeling of scene/music cohesion; do not attempt to match library breadth. |
| [Adobe Express wedding invitation videos](https://www.adobe.com/express/create/video/invitation/wedding) | Thousands of free Adobe Stock soundtracks and an explicit rights-cleared positioning. Its [current audio editor](https://helpx.adobe.com/express/web/audio-and-animation/audio.html) also supports multiple tracks and a visible waveform. | Rights evidence and legible audio controls are table stakes, not back-office details. |
| [Renderforest wedding videos](https://www.renderforest.com/wedding-slideshow-maker) | Hundreds of tracks plus custom music or voiceover upload. Renderforest's [support material](https://www.renderforest.com/help-and-support) also distinguishes royalty-free music from a licensed collection that may produce a copyright claim. | A generic "copyright-free" badge is too vague. Store the exact rights basis per master and keep customer uploads out of the first release. |
| [Invite Maker India](https://www.invitemaker.in/) | Indian occasion focus, real-time preview, music personalisation, and exports aimed at WhatsApp, Instagram, and Facebook. | Occasion fit and instant preview matter more than an encyclopedic genre browser at this stage. |

## Demand signals used

- Meta reports that 89% of surveyed Gen Z audiences in India engage with Reels
  daily, reinforcing the need for an immediate hook and a complete 30-second
  arc rather than a slow stock-music intro:
  [Meta, June 2026](https://about.fb.com/news/2026/06/reels-is-shaping-indias-video-first-future-across-gen-z-women-bharat/).
- Instagram's 2025 India review identified nostalgia and lo-fi aesthetics as
  prominent feed trends:
  [Meta, December 2025](https://about.fb.com/news/2025/12/what-kept-india-scrolling-in-2025-instagrams-year-in-review-is-here/).
- Spotify reports that more than 70% of listening in India is now local music,
  and that more than 90% of the tracks in Spotify India's 2024 daily Top 50
  were by local artists:
  [Spotify, March 2024](https://newsroom.spotify.com/2024-03-12/five-years-of-spotify-in-india-a-look-back-at-our-greatest-hits/),
  [Spotify, April 2025](https://newsroom.spotify.com/2025-04-15/indian-artists-are-reaching-more-global-fans-than-ever-before-and-the-data-proves-it/).

These signals support Indian-rooted timbre, lo-fi intimacy, and short-form
structure. They do not justify copying any currently viral song. A recognisable
commercial melody would create both rights risk and a catalogue that becomes
dated as soon as the trend turns.

## Before and after

| Dimension | Previous catalogue | Catalogue v2 |
| --- | --- | --- |
| Choice | 5 cues + silent | 8 cues + silent |
| Master | Mono, 44.1 kHz | Stereo, 44.1 kHz |
| Discovery | Name and prose only | Template ranking, style, BPM, energy, mood, occasion fit |
| Rights | README assertion | Per-track rights object, reproducible generator, hash register |
| Musical range | Romantic, party, lullaby, acoustic | Adds lo-fi Indian indie, organic house, and minimal ambient piano |
| Short-form fit | Fixed 30-second length | Hooks in the opening seconds, arrangement lifts around scene changes, intentional outro |

## Musical guardrails

- Start with a recognisable original motif within roughly the first second.
- Make meaningful arrangement changes near the template's scene transitions.
- Keep melody sparse enough that invitation text remains the focus.
- Use Indian-rooted colour without reducing every event to sitar-and-tabla
  shorthand.
- Keep a calm option and a silent option; "trendy" should not mean uniformly
  loud.
- Never prompt toward, interpolate, or market a cue as sounding like a named
  living artist or copyrighted film song.
- Run an actual user listening test before treating the ranking as validated.

## Remaining product gaps

1. Add a user volume control with preview/render parity.
2. Add compact waveform or section markers and one-click preview from each
   card.
3. Test the eight cues with target users and record selection, completion, and
   manual-switch rates by occasion.
4. Produce 15-second and 45-second authored arrangements instead of trimming
   the 30-second masters.
5. Move delivery masters to a web-efficient codec while retaining archival
   WAVs and stable project references.
6. Complete product-owner and legal review of the customer-use licence before
   public release.
