import {spawnSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const SAMPLE_RATE = 44_100;
const DURATION_SECONDS = 30;
const SAMPLE_COUNT = SAMPLE_RATE * DURATION_SECONDS;
const TABLE_SIZE = 4096;
const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const secondsToSample = (seconds) => Math.round(seconds * SAMPLE_RATE);
const midiToFrequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

const noteOffsets = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

const note = (name) => {
  const match = /^([A-G](?:#|b)?)(-?\d)$/.exec(name);
  if (!match) {
    throw new Error(`Invalid note: ${name}`);
  }

  return (Number(match[2]) + 1) * 12 + noteOffsets[match[1]];
};

const createRandom = (seed) => {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
};

const buildTable = (partials) => {
  const table = new Float32Array(TABLE_SIZE);
  let peak = 0;

  for (let index = 0; index < TABLE_SIZE; index += 1) {
    const phase = (index / TABLE_SIZE) * Math.PI * 2;
    let value = 0;

    for (const [harmonic, amplitude, phaseOffset = 0] of partials) {
      value += amplitude * Math.sin(phase * harmonic + phaseOffset);
    }

    table[index] = value;
    peak = Math.max(peak, Math.abs(value));
  }

  for (let index = 0; index < TABLE_SIZE; index += 1) {
    table[index] /= peak || 1;
  }

  return table;
};

const waveTables = {
  sine: buildTable([[1, 1]]),
  warm: buildTable([
    [1, 1],
    [2, 0.24],
    [3, 0.12],
    [4, 0.045],
  ]),
  velvet: buildTable([
    [1, 1],
    [2, 0.1],
    [3, 0.18],
    [5, 0.045],
  ]),
  flute: buildTable([
    [1, 1],
    [2, 0.11],
    [3, 0.045],
  ]),
  reed: buildTable([
    [1, 1],
    [2, 0.3],
    [3, 0.12],
    [4, 0.06],
    [5, 0.04],
  ]),
  glass: buildTable([
    [1, 1],
    [2, 0.32],
    [4, 0.18],
    [6, 0.08],
  ]),
  muted: buildTable([
    [1, 1],
    [2, 0.34],
    [3, 0.21],
    [4, 0.11],
    [5, 0.06],
    [6, 0.035],
  ]),
};

class MusicTrack {
  constructor(seed, roomAmount = 0.18) {
    this.left = new Float32Array(SAMPLE_COUNT);
    this.right = new Float32Array(SAMPLE_COUNT);
    this.random = createRandom(seed);
    this.roomAmount = roomAmount;
  }

  mix(startSeconds, durationSeconds, pan, renderSample) {
    const start = clamp(secondsToSample(startSeconds), 0, SAMPLE_COUNT);
    const end = clamp(
      start + secondsToSample(durationSeconds),
      start,
      SAMPLE_COUNT,
    );
    const leftGain = Math.cos(((clamp(pan, -1, 1) + 1) * Math.PI) / 4);
    const rightGain = Math.sin(((clamp(pan, -1, 1) + 1) * Math.PI) / 4);

    for (let index = start; index < end; index += 1) {
      const value = renderSample(index - start, end - start);
      this.left[index] += value * leftGain;
      this.right[index] += value * rightGain;
    }
  }

  tone({
    start,
    duration,
    midi,
    amplitude,
    pan = 0,
    table = 'warm',
    attack = 0.02,
    release = 0.3,
    detuneCents = 0,
    vibratoDepth = 0,
    vibratoRate = 5.1,
  }) {
    const frequency =
      midiToFrequency(midi) * 2 ** (detuneCents / 1200);
    const phaseIncrement = (frequency / SAMPLE_RATE) * TABLE_SIZE;
    const selectedTable = waveTables[table];
    const attackSamples = Math.max(1, secondsToSample(attack));
    const releaseSamples = Math.max(1, secondsToSample(release));
    let phase = this.random() * TABLE_SIZE;
    let vibratoPhase = this.random() * TABLE_SIZE;
    const vibratoIncrement = (vibratoRate / SAMPLE_RATE) * TABLE_SIZE;

    this.mix(start, duration, pan, (sampleIndex, totalSamples) => {
      const attackEnvelope = Math.min(1, sampleIndex / attackSamples);
      const releaseEnvelope = Math.min(
        1,
        (totalSamples - sampleIndex) / releaseSamples,
      );
      const envelope =
        Math.sin((Math.min(attackEnvelope, releaseEnvelope) * Math.PI) / 2) **
        1.35;
      const vibrato =
        waveTables.sine[Math.floor(vibratoPhase) % TABLE_SIZE] *
        vibratoDepth;
      phase += phaseIncrement * (1 + vibrato);
      vibratoPhase += vibratoIncrement;

      return (
        selectedTable[Math.floor(phase) % TABLE_SIZE] *
        amplitude *
        envelope
      );
    });
  }

  padChord(start, duration, notes, amplitude, width = 0.52) {
    notes.forEach((midi, index) => {
      const position =
        notes.length === 1 ? 0 : index / (notes.length - 1) - 0.5;
      const pan = position * width;
      this.tone({
        start,
        duration,
        midi,
        amplitude: amplitude * 0.58,
        pan,
        table: 'velvet',
        attack: 0.42,
        release: Math.min(1.1, duration * 0.32),
        detuneCents: -4,
      });
      this.tone({
        start: start + 0.012,
        duration,
        midi: midi + 12,
        amplitude: amplitude * 0.19,
        pan: -pan * 0.82,
        table: 'warm',
        attack: 0.6,
        release: Math.min(1.25, duration * 0.38),
        detuneCents: 5,
      });
    });
  }

  stringPluck({
    start,
    duration,
    midi,
    amplitude,
    pan = 0,
    damping = 0.994,
    brightness = 0.62,
  }) {
    const frequency = midiToFrequency(midi);
    const delayLength = Math.max(2, Math.round(SAMPLE_RATE / frequency));
    const delay = new Float32Array(delayLength);
    let previousNoise = 0;

    for (let index = 0; index < delayLength; index += 1) {
      const noise = this.random() * 2 - 1;
      previousNoise += (noise - previousNoise) * brightness;
      delay[index] = previousNoise;
    }

    let delayIndex = 0;
    this.mix(start, duration, pan, (sampleIndex, totalSamples) => {
      const current = delay[delayIndex];
      const next = delay[(delayIndex + 1) % delayLength];
      delay[delayIndex] = (current + next) * 0.5 * damping;
      delayIndex = (delayIndex + 1) % delayLength;

      const attack = Math.min(1, sampleIndex / 80);
      const release = Math.min(
        1,
        (totalSamples - sampleIndex) / secondsToSample(0.16),
      );

      return current * amplitude * attack * release;
    });
  }

  mallet({
    start,
    duration,
    midi,
    amplitude,
    pan = 0,
    softness = 0.3,
  }) {
    const frequency = midiToFrequency(midi);
    const increments = [1, 2.015, 3.97].map(
      (ratio) => (frequency * ratio * TABLE_SIZE) / SAMPLE_RATE,
    );
    const phases = increments.map(() => this.random() * TABLE_SIZE);
    const decays = [2.2, 1.25, 0.72];

    this.mix(start, duration, pan, (sampleIndex) => {
      const time = sampleIndex / SAMPLE_RATE;
      let value = 0;

      for (let partial = 0; partial < increments.length; partial += 1) {
        phases[partial] += increments[partial];
        value +=
          waveTables.sine[Math.floor(phases[partial]) % TABLE_SIZE] *
          [1, 0.34, 0.13][partial] *
          Math.exp(-time * decays[partial]);
      }

      const click =
        time < 0.018
          ? (this.random() * 2 - 1) *
            (1 - time / 0.018) *
            (0.07 + softness * 0.05)
          : 0;

      return (value + click) * amplitude;
    });
  }

  lead({
    start,
    duration,
    midi,
    amplitude,
    pan = 0,
    table = 'flute',
    glideFrom = null,
  }) {
    const targetFrequency = midiToFrequency(midi);
    const startFrequency =
      glideFrom === null ? targetFrequency : midiToFrequency(glideFrom);
    let phase = this.random() * TABLE_SIZE;
    let vibratoPhase = this.random() * TABLE_SIZE;

    this.mix(start, duration, pan, (sampleIndex, totalSamples) => {
      const time = sampleIndex / SAMPLE_RATE;
      const progress = sampleIndex / Math.max(1, totalSamples - 1);
      const glide = Math.min(1, time / 0.09);
      const frequency =
        startFrequency + (targetFrequency - startFrequency) * glide;
      const vibrato =
        Math.sin(vibratoPhase) * 0.0024 * Math.min(1, time / 0.2);
      phase += (frequency * (1 + vibrato) * TABLE_SIZE) / SAMPLE_RATE;
      vibratoPhase += (Math.PI * 2 * 5.25) / SAMPLE_RATE;
      const envelope =
        Math.min(1, time / 0.075) *
        Math.min(1, (1 - progress) / 0.16) *
        (0.92 + Math.sin(time * Math.PI * 1.7) * 0.08);

      return (
        waveTables[table][Math.floor(phase) % TABLE_SIZE] *
        amplitude *
        envelope
      );
    });
  }

  bass(start, duration, midi, amplitude, pan = 0) {
    this.tone({
      start,
      duration,
      midi,
      amplitude,
      pan,
      table: 'warm',
      attack: 0.012,
      release: 0.16,
    });
  }

  kick(start, amplitude = 0.34, softness = 0) {
    let phase = 0;
    this.mix(start, 0.48, 0, (sampleIndex) => {
      const time = sampleIndex / SAMPLE_RATE;
      const frequency =
        45 + (112 + softness * 24) * Math.exp(-time * 22);
      phase += (frequency * Math.PI * 2) / SAMPLE_RATE;
      const body = Math.sin(phase) * Math.exp(-time * (9.2 + softness * 3));
      const click =
        time < 0.009
          ? (this.random() * 2 - 1) *
            (1 - time / 0.009) *
            (0.09 - softness * 0.045)
          : 0;
      return (body + click) * amplitude;
    });
  }

  tonalDrum(start, amplitude = 0.22, pan = 0, low = false) {
    let phase = 0;
    this.mix(start, low ? 0.42 : 0.25, pan, (sampleIndex) => {
      const time = sampleIndex / SAMPLE_RATE;
      const startFrequency = low ? 155 : 310;
      const endFrequency = low ? 88 : 205;
      const frequency =
        endFrequency +
        (startFrequency - endFrequency) * Math.exp(-time * 15);
      phase += (frequency * Math.PI * 2) / SAMPLE_RATE;
      const body =
        (Math.sin(phase) + Math.sin(phase * 1.51) * 0.22) *
        Math.exp(-time * (low ? 8.5 : 15));
      const skin =
        (this.random() * 2 - 1) * Math.exp(-time * 48) * 0.16;
      return (body + skin) * amplitude;
    });
  }

  hat(start, amplitude = 0.055, pan = 0, open = false) {
    let previousNoise = 0;
    this.mix(start, open ? 0.28 : 0.09, pan, (sampleIndex) => {
      const time = sampleIndex / SAMPLE_RATE;
      const noise = this.random() * 2 - 1;
      const highPassed = noise - previousNoise * 0.82;
      previousNoise = noise;
      return (
        highPassed *
        amplitude *
        Math.exp(-time * (open ? 13 : 46))
      );
    });
  }

  shaker(start, amplitude = 0.04, pan = 0) {
    let lowPass = 0;
    let previous = 0;
    this.mix(start, 0.12, pan, (sampleIndex) => {
      const time = sampleIndex / SAMPLE_RATE;
      const noise = this.random() * 2 - 1;
      lowPass += (noise - lowPass) * 0.55;
      const band = lowPass - previous;
      previous = lowPass;
      return band * amplitude * Math.exp(-time * 32);
    });
  }

  clap(start, amplitude = 0.13, pan = 0) {
    let lowPass = 0;
    this.mix(start, 0.25, pan, (sampleIndex) => {
      const time = sampleIndex / SAMPLE_RATE;
      const noise = this.random() * 2 - 1;
      lowPass += (noise - lowPass) * 0.62;
      const bursts =
        Math.exp(-time * 19) +
        (time > 0.028 ? Math.exp(-(time - 0.028) * 34) * 0.65 : 0) +
        (time > 0.055 ? Math.exp(-(time - 0.055) * 40) * 0.42 : 0);
      return (noise - lowPass * 0.72) * amplitude * bursts;
    });
  }

  snap(start, amplitude = 0.11, pan = 0) {
    let lowPass = 0;
    this.mix(start, 0.12, pan, (sampleIndex) => {
      const time = sampleIndex / SAMPLE_RATE;
      const noise = this.random() * 2 - 1;
      lowPass += (noise - lowPass) * 0.42;
      const body = Math.sin(time * Math.PI * 2 * 1180) * 0.16;
      return (
        (noise - lowPass + body) *
        amplitude *
        Math.exp(-time * 52)
      );
    });
  }

  rainTexture(amplitude = 0.006) {
    let leftSlow = 0;
    let rightSlow = 0;
    let leftPrevious = 0;
    let rightPrevious = 0;

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const leftNoise = this.random() * 2 - 1;
      const rightNoise = this.random() * 2 - 1;
      leftSlow += (leftNoise - leftSlow) * 0.055;
      rightSlow += (rightNoise - rightSlow) * 0.05;
      const leftBand = leftSlow - leftPrevious * 0.94;
      const rightBand = rightSlow - rightPrevious * 0.94;
      leftPrevious = leftSlow;
      rightPrevious = rightSlow;
      this.left[index] += leftBand * amplitude;
      this.right[index] += rightBand * amplitude;
    }
  }

  applyRoom() {
    const wetLeft = new Float32Array(SAMPLE_COUNT);
    const wetRight = new Float32Array(SAMPLE_COUNT);
    const delayA = secondsToSample(0.071);
    const delayB = secondsToSample(0.113);
    const delayC = secondsToSample(0.191);

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const a = index >= delayA ? index - delayA : -1;
      const b = index >= delayB ? index - delayB : -1;
      const c = index >= delayC ? index - delayC : -1;
      wetLeft[index] =
        (a >= 0 ? this.right[a] * 0.5 : 0) +
        (b >= 0 ? this.left[b] * 0.32 : 0) +
        (c >= 0 ? wetRight[c] * 0.2 : 0);
      wetRight[index] =
        (a >= 0 ? this.left[a] * 0.48 : 0) +
        (b >= 0 ? this.right[b] * 0.34 : 0) +
        (c >= 0 ? wetLeft[c] * 0.2 : 0);
    }

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      this.left[index] += wetLeft[index] * this.roomAmount;
      this.right[index] += wetRight[index] * this.roomAmount;
    }
  }

  master() {
    this.applyRoom();

    let previousInputLeft = 0;
    let previousInputRight = 0;
    let previousOutputLeft = 0;
    let previousOutputRight = 0;
    const drive = 1.18;
    const driveScale = Math.tanh(drive);
    const fadeInSamples = secondsToSample(0.16);
    const fadeOutSamples = secondsToSample(1.15);
    let peak = 0;
    let sumSquares = 0;

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const highPassedLeft =
        this.left[index] -
        previousInputLeft +
        0.9965 * previousOutputLeft;
      const highPassedRight =
        this.right[index] -
        previousInputRight +
        0.9965 * previousOutputRight;
      previousInputLeft = this.left[index];
      previousInputRight = this.right[index];
      previousOutputLeft = highPassedLeft;
      previousOutputRight = highPassedRight;

      const fadeIn = Math.min(1, index / fadeInSamples);
      const fadeOut = Math.min(
        1,
        (SAMPLE_COUNT - index) / fadeOutSamples,
      );
      const fade = Math.sin((Math.min(fadeIn, fadeOut) * Math.PI) / 2);
      this.left[index] =
        (Math.tanh(highPassedLeft * drive) / driveScale) * fade;
      this.right[index] =
        (Math.tanh(highPassedRight * drive) / driveScale) * fade;
      peak = Math.max(
        peak,
        Math.abs(this.left[index]),
        Math.abs(this.right[index]),
      );
      sumSquares +=
        this.left[index] * this.left[index] +
        this.right[index] * this.right[index];
    }

    const rms = Math.sqrt(sumSquares / (SAMPLE_COUNT * 2));
    const targetRms = 10 ** (-16 / 20);
    const loudnessGain = targetRms / Math.max(rms, 0.000_001);
    const peakGain = 0.88 / Math.max(peak, 0.000_001);
    const gain = Math.min(loudnessGain, peakGain);
    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      this.left[index] *= gain;
      this.right[index] *= gain;
    }
  }

  write(relativePath) {
    this.master();

    const outputPath = resolve(PROJECT_ROOT, relativePath);
    mkdirSync(dirname(outputPath), {recursive: true});
    const channelCount = 2;
    const bytesPerSample = 2;
    const dataSize = SAMPLE_COUNT * channelCount * bytesPerSample;
    const buffer = Buffer.allocUnsafe(44 + dataSize);

    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(channelCount, 22);
    buffer.writeUInt32LE(SAMPLE_RATE, 24);
    buffer.writeUInt32LE(
      SAMPLE_RATE * channelCount * bytesPerSample,
      28,
    );
    buffer.writeUInt16LE(channelCount * bytesPerSample, 32);
    buffer.writeUInt16LE(bytesPerSample * 8, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    let offset = 44;
    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const ditherLeft = (this.random() - this.random()) / 65_536;
      const ditherRight = (this.random() - this.random()) / 65_536;
      buffer.writeInt16LE(
        Math.round(clamp(this.left[index] + ditherLeft, -1, 1) * 32_767),
        offset,
      );
      buffer.writeInt16LE(
        Math.round(clamp(this.right[index] + ditherRight, -1, 1) * 32_767),
        offset + 2,
      );
      offset += 4;
    }

    writeFileSync(outputPath, buffer);
    process.stdout.write(`Generated ${relativePath}\n`);
    return outputPath;
  }
}

const scheduleHook = (track, start, beat, melody, options = {}) => {
  const {
    amplitude = 0.12,
    pan = 0.08,
    table = 'flute',
    octave = 0,
  } = options;

  melody.forEach(([beatOffset, durationInBeats, midi, glideFrom], index) => {
    track.lead({
      start: start + beatOffset * beat,
      duration: durationInBeats * beat * 0.92,
      midi: midi + octave,
      amplitude,
      pan: index % 2 === 0 ? pan : -pan * 0.6,
      table,
      glideFrom:
        glideFrom === undefined || glideFrom === null
          ? null
          : glideFrom + octave,
    });
  });
};

const createGoldenHour = () => {
  const track = new MusicTrack(10_421, 0.2);
  const beat = 60 / 96;
  const bar = beat * 4;
  const chords = [
    {notes: ['D3', 'F#3', 'A3', 'E4'], bass: 'D2'},
    {notes: ['C#3', 'E3', 'A3', 'B3'], bass: 'C#2'},
    {notes: ['B2', 'D3', 'F#3', 'A3'], bass: 'B1'},
    {notes: ['G2', 'D3', 'A3', 'B3'], bass: 'G1'},
  ];
  const arp = [0, 2, 1, 3, 2, 1, 3, 2];
  const hook = [
    [0, 0.9, note('A4')],
    [1, 0.85, note('F#4'), note('E4')],
    [2, 0.85, note('E4')],
    [3, 0.9, note('D4')],
  ];

  for (let barIndex = 0; barIndex < 12; barIndex += 1) {
    const start = barIndex * bar;
    const chord = chords[barIndex % chords.length];
    const section =
      barIndex < 2 ? 0.68 : barIndex < 8 ? 1 : barIndex < 10 ? 0.72 : 1.08;
    track.padChord(
      start,
      bar * 1.04,
      chord.notes.map(note),
      0.07 * section,
    );
    track.bass(start, beat * 1.55, note(chord.bass), 0.12 * section);
    track.bass(
      start + beat * 2,
      beat * 1.4,
      note(chord.bass),
      0.095 * section,
    );

    arp.forEach((chordIndex, step) => {
      track.stringPluck({
        start: start + step * (beat / 2),
        duration: beat * 1.15,
        midi: note(chord.notes[chordIndex]) + 12,
        amplitude: 0.105 * section,
        pan: step % 2 === 0 ? -0.3 : 0.28,
        damping: 0.9938,
        brightness: 0.54,
      });
    });

    if (barIndex >= 2 && barIndex !== 8) {
      track.tonalDrum(start, 0.19 * section, -0.08, true);
      track.tonalDrum(start + beat * 2, 0.15 * section, 0.12, false);
      track.tonalDrum(start + beat * 3.5, 0.1 * section, -0.18, false);
      for (let step = 1; step < 8; step += 1) {
        track.shaker(
          start + step * (beat / 2),
          0.037 * section,
          step % 2 === 0 ? -0.24 : 0.24,
        );
      }
    }

    if ([1, 5, 10].includes(barIndex)) {
      scheduleHook(track, start, beat, hook, {
        amplitude: 0.105 * section,
        pan: 0.16,
        table: 'flute',
      });
    }
  }

  track.mallet({
    start: 0.18,
    duration: 2.2,
    midi: note('D5'),
    amplitude: 0.11,
    pan: -0.22,
  });
  track.mallet({
    start: 0.48,
    duration: 2.1,
    midi: note('A5'),
    amplitude: 0.075,
    pan: 0.28,
  });
  return track;
};

const createMoonlitVows = () => {
  const track = new MusicTrack(20_327, 0.3);
  const beat = 60 / 72;
  const bar = beat * 4;
  const chords = [
    {notes: ['C3', 'G3', 'B3', 'E4'], bass: 'C2'},
    {notes: ['A2', 'E3', 'G3', 'C4'], bass: 'A1'},
    {notes: ['F2', 'C3', 'G3', 'A3'], bass: 'F1'},
    {notes: ['G2', 'D3', 'A3', 'C4'], bass: 'G1'},
  ];
  const pattern = [0, 2, 1, 3, 1, 2, 3, 2];
  const hook = [
    [0, 1.35, note('E5')],
    [1.5, 0.45, note('D5')],
    [2, 0.9, note('C5')],
    [3, 0.9, note('G4'), note('A4')],
  ];

  for (let barIndex = 0; barIndex < 9; barIndex += 1) {
    const start = barIndex * bar;
    const chord = chords[barIndex % chords.length];
    const section =
      barIndex < 2 ? 0.72 : barIndex < 6 ? 1 : barIndex === 6 ? 0.74 : 1.06;
    track.padChord(
      start,
      bar * 1.08,
      chord.notes.map(note),
      0.078 * section,
      0.62,
    );
    track.bass(start, bar * 0.82, note(chord.bass), 0.09 * section);

    pattern.forEach((chordIndex, step) => {
      track.stringPluck({
        start: start + step * (beat / 2),
        duration: beat * 1.9,
        midi: note(chord.notes[chordIndex]) + 12,
        amplitude: 0.085 * section,
        pan: step % 2 === 0 ? -0.34 : 0.34,
        damping: 0.995,
        brightness: 0.43,
      });
    });

    if (barIndex >= 3 && barIndex !== 6) {
      track.tonalDrum(start, 0.09 * section, -0.1, true);
      track.tonalDrum(start + beat * 2, 0.07 * section, 0.12, false);
    }

    if ([1, 4, 7].includes(barIndex)) {
      scheduleHook(track, start, beat, hook, {
        amplitude: 0.095 * section,
        pan: 0.12,
        table: 'flute',
      });
    }
  }

  [0.12, 0.42, 0.72].forEach((start, index) => {
    track.mallet({
      start,
      duration: 2.8,
      midi: [note('C5'), note('G5'), note('E6')][index],
      amplitude: [0.08, 0.06, 0.045][index],
      pan: [-0.3, 0.25, -0.08][index],
      softness: 0.55,
    });
  });
  return track;
};

const createCelebrationAfterglow = () => {
  const track = new MusicTrack(30_733, 0.13);
  const beat = 60 / 120;
  const bar = beat * 4;
  const chords = [
    {notes: ['A2', 'E3', 'G3', 'C4'], bass: 'A1'},
    {notes: ['F2', 'C3', 'E3', 'A3'], bass: 'F1'},
    {notes: ['C3', 'G3', 'B3', 'E4'], bass: 'C2'},
    {notes: ['G2', 'D3', 'F3', 'B3'], bass: 'G1'},
  ];
  const bassPattern = [0, 0.75, 1.5, 2.5, 3.25];
  const hook = [
    [0, 0.42, note('E5')],
    [0.5, 0.42, note('G5')],
    [1, 0.82, note('A5')],
    [2, 0.42, note('C6')],
    [2.5, 0.42, note('B5')],
    [3, 0.82, note('G5')],
  ];

  for (let barIndex = 0; barIndex < 15; barIndex += 1) {
    const start = barIndex * bar;
    const chord = chords[barIndex % chords.length];
    const breakdown = barIndex === 0 || [9, 10].includes(barIndex);
    const section = breakdown ? 0.62 : barIndex >= 12 ? 1.08 : 1;
    track.padChord(
      start,
      bar * 1.02,
      chord.notes.map(note),
      0.046 * section,
      0.78,
    );

    bassPattern.forEach((beatOffset, index) => {
      track.bass(
        start + beatOffset * beat,
        beat * 0.58,
        note(chord.bass) + (index === 3 ? 12 : 0),
        0.16 * section,
        index % 2 === 0 ? -0.04 : 0.04,
      );
    });

    for (let step = 0; step < 8; step += 1) {
      const chordNote = chord.notes[[1, 2, 1, 3, 1, 2, 0, 3][step]];
      track.tone({
        start: start + step * (beat / 2),
        duration: beat * 0.34,
        midi: note(chordNote) + 12,
        amplitude: 0.07 * section,
        pan: step % 2 === 0 ? -0.25 : 0.25,
        table: 'muted',
        attack: 0.004,
        release: 0.08,
      });
    }

    if (!breakdown) {
      for (let pulse = 0; pulse < 4; pulse += 1) {
        track.kick(start + pulse * beat, 0.255 * section);
        track.hat(
          start + (pulse + 0.5) * beat,
          0.05 * section,
          pulse % 2 === 0 ? -0.28 : 0.28,
          true,
        );
      }
      track.clap(start + beat, 0.115 * section, -0.08);
      track.clap(start + beat * 3, 0.125 * section, 0.08);
    } else {
      track.kick(start, 0.18 * section, 0.4);
      track.snap(start + beat * 2, 0.07, 0.12);
    }

    if ([2, 6, 12, 14].includes(barIndex)) {
      scheduleHook(track, start, beat, hook, {
        amplitude: 0.082 * section,
        pan: 0.18,
        table: 'glass',
      });
    }
  }

  track.mallet({
    start: 0.08,
    duration: 1.5,
    midi: note('A5'),
    amplitude: 0.09,
    pan: 0.22,
  });
  return track;
};

const createLittleWonder = () => {
  const track = new MusicTrack(40_939, 0.28);
  const beat = 60 / 80;
  const bar = beat * 4;
  const chords = [
    {notes: ['G3', 'D4', 'A4', 'B4'], bass: 'G2'},
    {notes: ['D3', 'A3', 'C4', 'F#4'], bass: 'D2'},
    {notes: ['E3', 'B3', 'D4', 'G4'], bass: 'E2'},
    {notes: ['C3', 'G3', 'D4', 'E4'], bass: 'C2'},
  ];
  const lullaby = [
    [0, 0.85, note('B5')],
    [1, 0.42, note('A5')],
    [1.5, 0.42, note('G5')],
    [2, 0.85, note('D5')],
    [3, 0.85, note('G5')],
  ];

  for (let barIndex = 0; barIndex < 10; barIndex += 1) {
    const start = barIndex * bar;
    const chord = chords[barIndex % chords.length];
    const section =
      barIndex < 2 ? 0.7 : barIndex < 7 ? 1 : barIndex === 7 ? 0.72 : 1.02;
    track.padChord(
      start,
      bar * 1.07,
      chord.notes.map(note),
      0.064 * section,
      0.5,
    );
    track.bass(start, bar * 0.8, note(chord.bass), 0.055 * section);

    [0, 1, 2, 1, 3, 2, 1, 2].forEach((chordIndex, step) => {
      track.mallet({
        start: start + step * (beat / 2),
        duration: beat * 1.7,
        midi: note(chord.notes[chordIndex]) + 12,
        amplitude: 0.055 * section,
        pan: step % 2 === 0 ? -0.26 : 0.26,
        softness: 0.65,
      });
    });

    if (barIndex >= 3 && barIndex !== 7) {
      track.kick(start, 0.075 * section, 0.85);
      track.kick(start + beat * 2, 0.06 * section, 0.9);
      track.shaker(start + beat, 0.018 * section, -0.16);
      track.shaker(start + beat * 3, 0.018 * section, 0.16);
    }

    if ([1, 5, 8].includes(barIndex)) {
      lullaby.forEach(([beatOffset, durationInBeats, midi], index) => {
        track.mallet({
          start: start + beatOffset * beat,
          duration: durationInBeats * beat * 1.45,
          midi,
          amplitude: 0.062 * section,
          pan: index % 2 === 0 ? 0.12 : -0.12,
          softness: 0.78,
        });
      });
    }
  }

  track.mallet({
    start: 0.18,
    duration: 3.1,
    midi: note('G6'),
    amplitude: 0.05,
    pan: 0.28,
    softness: 0.82,
  });
  return track;
};

const createMorningCourtyard = () => {
  const track = new MusicTrack(51_143, 0.18);
  const beat = 60 / 100;
  const bar = beat * 4;
  const chords = [
    {notes: ['C3', 'G3', 'C4', 'E4'], bass: 'C2'},
    {notes: ['G2', 'D3', 'A3', 'B3'], bass: 'G1'},
    {notes: ['A2', 'E3', 'G3', 'C4'], bass: 'A1'},
    {notes: ['F2', 'C3', 'G3', 'A3'], bass: 'F1'},
  ];
  const hook = [
    [0, 0.75, note('E5')],
    [1, 0.45, note('G5')],
    [1.5, 0.45, note('A5')],
    [2, 0.75, note('G5')],
    [3, 0.75, note('D5')],
  ];

  for (let barIndex = 0; barIndex < 13; barIndex += 1) {
    const start = barIndex * bar;
    const chord = chords[barIndex % chords.length];
    const section =
      barIndex < 2 ? 0.68 : barIndex < 9 ? 1 : barIndex === 9 ? 0.7 : 1.05;
    track.padChord(
      start,
      bar * 1.04,
      chord.notes.map(note),
      0.046 * section,
      0.56,
    );
    track.bass(start, beat * 1.6, note(chord.bass), 0.09 * section);
    track.bass(
      start + beat * 2,
      beat * 1.3,
      note(chord.bass),
      0.075 * section,
    );

    [0, 2, 1, 2, 0, 3, 1, 2].forEach((chordIndex, step) => {
      track.stringPluck({
        start: start + step * (beat / 2),
        duration: beat * 1.25,
        midi: note(chord.notes[chordIndex]) + 12,
        amplitude: 0.095 * section,
        pan: step % 2 === 0 ? -0.32 : 0.32,
        damping: 0.9935,
        brightness: 0.48,
      });
    });

    if (barIndex >= 2 && barIndex !== 9) {
      track.tonalDrum(start, 0.16 * section, -0.12, true);
      track.tonalDrum(start + beat * 2, 0.11 * section, 0.15, false);
      track.clap(start + beat * 3, 0.045 * section, 0.08);
      for (let step = 1; step < 8; step += 2) {
        track.shaker(
          start + step * (beat / 2),
          0.03 * section,
          step % 4 === 1 ? -0.24 : 0.24,
        );
      }
    }

    if ([1, 6, 11].includes(barIndex)) {
      scheduleHook(track, start, beat, hook, {
        amplitude: 0.085 * section,
        pan: 0.13,
        table: 'flute',
      });
    }
  }

  track.mallet({
    start: 0.16,
    duration: 2,
    midi: note('C6'),
    amplitude: 0.065,
    pan: -0.25,
  });
  return track;
};

const createMonsoonLetters = () => {
  const track = new MusicTrack(61_349, 0.24);
  const beat = 60 / 84;
  const bar = beat * 4;
  const chords = [
    {notes: ['E3', 'G#3', 'B3', 'F#4'], bass: 'E2'},
    {notes: ['C#3', 'E3', 'G#3', 'B3'], bass: 'C#2'},
    {notes: ['A2', 'E3', 'G#3', 'B3'], bass: 'A1'},
    {notes: ['B2', 'F#3', 'A3', 'E4'], bass: 'B1'},
  ];
  const hook = [
    [0, 0.9, note('G#4')],
    [1, 0.42, note('F#4')],
    [1.5, 0.42, note('E4')],
    [2, 0.9, note('B4'), note('A4')],
    [3, 0.9, note('C#5')],
  ];

  track.rainTexture(0.018);

  for (let barIndex = 0; barIndex < 11; barIndex += 1) {
    const start = barIndex * bar;
    const chord = chords[barIndex % chords.length];
    const section =
      barIndex < 2 ? 0.66 : barIndex < 7 ? 1 : barIndex === 7 ? 0.7 : 1.04;
    track.padChord(
      start,
      bar * 1.08,
      chord.notes.map(note),
      0.063 * section,
      0.7,
    );
    track.bass(start, beat * 1.6, note(chord.bass), 0.105 * section);
    track.bass(
      start + beat * 2.5,
      beat,
      note(chord.bass) + 12,
      0.065 * section,
    );

    [0, 2, 1, 3, 2, 1, 3, 1].forEach((chordIndex, step) => {
      track.tone({
        start: start + step * (beat / 2),
        duration: beat * 0.72,
        midi: note(chord.notes[chordIndex]) + 12,
        amplitude: 0.052 * section,
        pan: step % 2 === 0 ? -0.34 : 0.34,
        table: 'velvet',
        attack: 0.01,
        release: 0.18,
      });
    });

    if (barIndex >= 2 && barIndex !== 7) {
      track.kick(start, 0.13 * section, 0.72);
      track.kick(start + beat * 2, 0.105 * section, 0.78);
      track.snap(start + beat, 0.085 * section, -0.18);
      track.snap(start + beat * 3, 0.09 * section, 0.18);
      for (let step = 1; step < 8; step += 2) {
        track.hat(
          start + step * (beat / 2),
          0.028 * section,
          step % 4 === 1 ? -0.3 : 0.3,
        );
      }
    }

    if ([1, 5, 9].includes(barIndex)) {
      scheduleHook(track, start, beat, hook, {
        amplitude: 0.09 * section,
        pan: 0.1,
        table: 'flute',
      });
    }
  }

  track.mallet({
    start: 0.2,
    duration: 2.6,
    midi: note('B5'),
    amplitude: 0.055,
    pan: 0.26,
    softness: 0.74,
  });
  return track;
};

const createSaffronSkyline = () => {
  const track = new MusicTrack(71_551, 0.16);
  const beat = 60 / 112;
  const bar = beat * 4;
  const chords = [
    {notes: ['D3', 'A3', 'C4', 'E4'], bass: 'D2'},
    {notes: ['G2', 'D3', 'A3', 'B3'], bass: 'G1'},
    {notes: ['C3', 'G3', 'B3', 'E4'], bass: 'C2'},
    {notes: ['A2', 'E3', 'G3', 'C4'], bass: 'A1'},
  ];
  const hook = [
    [0, 0.42, note('A4')],
    [0.5, 0.42, note('C5')],
    [1, 0.9, note('D5')],
    [2, 0.42, note('E5')],
    [2.5, 0.42, note('D5')],
    [3, 0.9, note('A4')],
  ];

  for (let barIndex = 0; barIndex < 14; barIndex += 1) {
    const start = barIndex * bar;
    const chord = chords[barIndex % chords.length];
    const breakdown = barIndex < 2 || [8, 9].includes(barIndex);
    const section = breakdown ? 0.62 : barIndex >= 11 ? 1.08 : 1;
    track.padChord(
      start,
      bar * 1.03,
      chord.notes.map(note),
      0.052 * section,
      0.72,
    );
    track.bass(start, beat * 0.72, note(chord.bass), 0.14 * section);
    track.bass(
      start + beat * 1.5,
      beat * 0.55,
      note(chord.bass) + 12,
      0.095 * section,
    );
    track.bass(
      start + beat * 2.5,
      beat * 0.7,
      note(chord.bass),
      0.11 * section,
    );

    [0, 2, 1, 3, 1, 2, 3, 2].forEach((chordIndex, step) => {
      track.stringPluck({
        start: start + step * (beat / 2),
        duration: beat * 0.8,
        midi: note(chord.notes[chordIndex]) + 12,
        amplitude: 0.07 * section,
        pan: step % 2 === 0 ? -0.31 : 0.31,
        damping: 0.9918,
        brightness: 0.68,
      });
    });

    if (!breakdown) {
      for (let pulse = 0; pulse < 4; pulse += 1) {
        track.kick(start + pulse * beat, 0.22 * section, 0.2);
      }
      track.tonalDrum(start + beat, 0.11 * section, -0.22, false);
      track.tonalDrum(start + beat * 2.5, 0.13 * section, 0.22, true);
      track.tonalDrum(start + beat * 3.5, 0.1 * section, -0.12, false);
      for (let step = 1; step < 8; step += 2) {
        track.hat(
          start + step * (beat / 2),
          0.037 * section,
          step % 4 === 1 ? -0.28 : 0.28,
          true,
        );
      }
    } else {
      track.tonalDrum(start, 0.1 * section, -0.08, true);
      track.shaker(start + beat * 2, 0.025 * section, 0.2);
    }

    if ([1, 5, 10, 12].includes(barIndex)) {
      scheduleHook(track, start, beat, hook, {
        amplitude: 0.087 * section,
        pan: 0.12,
        table: 'reed',
      });
    }
  }

  track.mallet({
    start: 0.1,
    duration: 1.8,
    midi: note('D6'),
    amplitude: 0.07,
    pan: -0.28,
  });
  return track;
};

const createFirstLight = () => {
  const track = new MusicTrack(81_757, 0.34);
  const beat = 60 / 80;
  const bar = beat * 4;
  const chords = [
    {notes: ['F3', 'C4', 'E4', 'A4'], bass: 'F2'},
    {notes: ['C3', 'G3', 'D4', 'E4'], bass: 'C2'},
    {notes: ['D3', 'A3', 'C4', 'F4'], bass: 'D2'},
    {notes: ['Bb2', 'F3', 'C4', 'D4'], bass: 'Bb1'},
  ];
  const pianoFigure = [
    [0, 1.4, 0],
    [1.5, 0.42, 2],
    [2, 0.85, 1],
    [3, 0.85, 3],
  ];
  const hook = [
    [0, 1.25, note('A4')],
    [1.5, 0.42, note('G4')],
    [2, 0.85, note('F4')],
    [3, 0.85, note('C5'), note('Bb4')],
  ];

  for (let barIndex = 0; barIndex < 10; barIndex += 1) {
    const start = barIndex * bar;
    const chord = chords[barIndex % chords.length];
    const section =
      barIndex < 2 ? 0.68 : barIndex < 7 ? 1 : barIndex === 7 ? 0.74 : 1.03;
    track.padChord(
      start,
      bar * 1.1,
      chord.notes.map(note),
      0.065 * section,
      0.64,
    );
    track.bass(start, bar * 0.84, note(chord.bass), 0.06 * section);

    pianoFigure.forEach(([beatOffset, durationInBeats, chordIndex], index) => {
      track.mallet({
        start: start + beatOffset * beat,
        duration: durationInBeats * beat * 1.4,
        midi: note(chord.notes[chordIndex]) + 12,
        amplitude: 0.065 * section,
        pan: index % 2 === 0 ? -0.2 : 0.2,
        softness: 0.88,
      });
    });

    if (barIndex >= 4 && barIndex !== 7) {
      track.kick(start, 0.055 * section, 0.95);
      track.shaker(start + beat * 2, 0.014 * section, 0.12);
    }

    if ([1, 5, 8].includes(barIndex)) {
      scheduleHook(track, start, beat, hook, {
        amplitude: 0.075 * section,
        pan: 0.08,
        table: 'flute',
      });
    }
  }

  track.mallet({
    start: 0.14,
    duration: 3.4,
    midi: note('F6'),
    amplitude: 0.042,
    pan: 0.24,
    softness: 0.9,
  });
  return track;
};

const getRemotionCompositorPackage = () => {
  if (process.platform === 'darwin') {
    if (process.arch === 'arm64') {
      return '@remotion/compositor-darwin-arm64';
    }
    if (process.arch === 'x64') {
      return '@remotion/compositor-darwin-x64';
    }
  }

  if (process.platform === 'win32' && process.arch === 'x64') {
    return '@remotion/compositor-win32-x64-msvc';
  }

  if (process.platform === 'linux') {
    const report = process.report?.getReport();
    const header =
      report && typeof report !== 'string' ? report.header : undefined;
    const libc = header?.glibcVersionRuntime ? 'gnu' : 'musl';
    if (process.arch === 'arm64') {
      return `@remotion/compositor-linux-arm64-${libc}`;
    }
    if (process.arch === 'x64') {
      return `@remotion/compositor-linux-x64-${libc}`;
    }
  }

  throw new Error(
    `No bundled FFmpeg binary is available for ${process.platform} ${process.arch}.`,
  );
};

const encodeDeliveryAudio = (masterPath, relativeDeliveryPath) => {
  const compositorPackage = getRemotionCompositorPackage();
  const {dir: compositorDirectory} = require(compositorPackage);
  const ffmpegPath = resolve(
    compositorDirectory,
    process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg',
  );
  const deliveryPath = resolve(PROJECT_ROOT, relativeDeliveryPath);
  mkdirSync(dirname(deliveryPath), {recursive: true});

  const libraryPathName =
    process.platform === 'darwin'
      ? 'DYLD_LIBRARY_PATH'
      : process.platform === 'linux'
        ? 'LD_LIBRARY_PATH'
        : null;
  const environment = {...process.env};
  if (libraryPathName) {
    environment[libraryPathName] = [
      compositorDirectory,
      process.env[libraryPathName],
    ]
      .filter(Boolean)
      .join(':');
  }

  const result = spawnSync(
    ffmpegPath,
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      masterPath,
      '-map_metadata',
      '-1',
      '-vn',
      '-codec:a',
      'libmp3lame',
      '-b:a',
      '192k',
      '-ar',
      String(SAMPLE_RATE),
      deliveryPath,
    ],
    {
      encoding: 'utf8',
      env: environment,
    },
  );

  if (result.error || result.status !== 0) {
    throw new Error(
      result.error?.message ||
        result.stderr ||
        `FFmpeg exited with status ${result.status}.`,
    );
  }

  process.stdout.write(`Encoded ${relativeDeliveryPath}\n`);
};

const tracks = [
  {
    masterPath: 'assets/music-masters/marigold-air.wav',
    deliveryPath: 'public/music/marigold-air.mp3',
    create: createGoldenHour,
  },
  {
    masterPath: 'assets/music-masters/moonlit-vows.wav',
    deliveryPath: 'public/music/moonlit-vows.mp3',
    create: createMoonlitVows,
  },
  {
    masterPath: 'assets/music-masters/celebration-afterglow.wav',
    deliveryPath: 'public/music/celebration-afterglow.mp3',
    create: createCelebrationAfterglow,
  },
  {
    masterPath: 'assets/music-masters/little-wonder.wav',
    deliveryPath: 'public/music/little-wonder.mp3',
    create: createLittleWonder,
  },
  {
    masterPath: 'assets/music-masters/morning-courtyard.wav',
    deliveryPath: 'public/music/morning-courtyard.mp3',
    create: createMorningCourtyard,
  },
  {
    masterPath: 'assets/music-masters/monsoon-letters.wav',
    deliveryPath: 'public/music/monsoon-letters.mp3',
    create: createMonsoonLetters,
  },
  {
    masterPath: 'assets/music-masters/saffron-skyline.wav',
    deliveryPath: 'public/music/saffron-skyline.mp3',
    create: createSaffronSkyline,
  },
  {
    masterPath: 'assets/music-masters/first-light.wav',
    deliveryPath: 'public/music/first-light.mp3',
    create: createFirstLight,
  },
];

for (const definition of tracks) {
  const masterPath = definition.create().write(definition.masterPath);
  encodeDeliveryAudio(masterPath, definition.deliveryPath);
}
