// THE SONG — calm lo-fi under the captions, with hits tied to the score's events.
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const Genre = require('./engine/audio/genres');
const sc = require('./score');
const { T, BEAT, DURATION, ev, clock, SC } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), keys = bus(), lead = bus(), fx = bus();
const verb = bus(), dly = bus();

// backing: lo-fi groove from bar 2, broken by the held breath before MENTIRA, gone for the calm outro
const g1 = Genre.play('lofi', { clock, from: 2, to: 6, chordAt: sc.chordAt, buses: { drums, bass, keys } });
const g2 = Genre.play('lofi', { clock, from: 6, to: 17, chordAt: sc.chordAt, buses: { drums, bass, keys }, fill: [12] });
Genre.play('lofi', { clock, from: 0, to: 2, chordAt: sc.chordAt, buses: { keys }, drums: false, bassline: false, gain: 0.7 });
Genre.play('lofi', { clock, from: 17, to: 21, chordAt: sc.chordAt, buses: { keys, bass }, drums: false, gain: 0.7 });
const kicks = [...g1.kicks, ...g2.kicks];

// pads: the ocean bed under everything
for (const c of sc.chords) {
  for (const n of c.notes) { const { L, R } = I.padNote(n, c.t1 - c.t0, { cutoff: 900, attack: 0.6, release: 1.4 }); pad.addStereo(L, R, c.t0, 0.08); }
}

// melodies
for (const n of sc.musicbox) { const x = I.musicBox(n.midi); lead.addMono(x, n.t, 0.16); verb.addMono(x, n.t, 0.2); dly.addMono(x, n.t, 0.08); }
for (const n of sc.marimba) { const x = I.marimba(n.midi, { thock: 0 }); lead.addMono(x, n.t, 0.2, 0.25); verb.addMono(x, n.t, 0.12); }

// fx tied to events
for (const [, [t0]] of Object.entries(SC)) if (t0 > 0.1 && Math.abs(t0 - ev.lie) > 0.01 && Math.abs(t0 - ev.glow) > 0.01) fx.addMono(I.noiseSweep(0.45, 500, 2400, { q: 0.8, pink: true, seed: Math.round(t0) }), t0 - 0.3, 0.12); // soft water whoosh on cuts
fx.addMono(I.glass(3, { size: 0.7 }), ev.hookFlash, 0.25); verb.addMono(I.glass(3, { size: 0.7 }), ev.hookFlash, 0.2);
fx.addMono(I.scratch(0.32), ev.scratch, 0.35);
fx.addMono(I.thwack(), ev.lie, 0.7); fx.addMono(I.subBoom(1.6), ev.lie, 0.6); fx.addMono(I.kick({ tail: 0.3, punch: 1.2 }), ev.lie, 0.8);
fx.addMono(I.noiseSweep(1.0, 2000, 150, { q: 1, pink: true }), ev.drop, 0.25); // needle falls
fx.addMono(I.glass(7, { size: 1.2 }), ev.glow, 0.5); fx.addMono(I.subBoom(1.4, 70, 40), ev.glow, 0.35);
for (let i = 0; i < 4; i++) { const b = I.bell(880 * Math.pow(2, i * 4 / 12), 0.5); fx.addMono(b, ev.glow + i * BEAT / 4, 0.1, i % 2 ? 0.3 : -0.3); verb.addMono(b, ev.glow + i * BEAT / 4, 0.12); }
for (const t of [ev.strike1, ev.strike2]) { fx.addMono(I.noiseSweep(0.22, 900, 6000, { q: 1.2 }), t - 0.2, 0.3); fx.addMono(I.thwack(), t, 0.45); }
for (let i = 0; i < 10; i++) fx.addMono(I.pop(1200 + (i * 337) % 1600, 40 + i), ev.strike1 + 0.06 + i * 0.05, 0.08, (i % 3 - 1) * 0.5); // sardines scattering
for (let i = 0; i < 10; i++) fx.addMono(I.pop(1200 + (i * 211) % 1600, 60 + i), ev.strike2 + 0.06 + i * 0.05, 0.08, (i % 3 - 1) * 0.5);

// mix
MIX.sidechain([pad, bass], kicks, { depth: 0.25 });
const stems = {
  drums, bass, pad, keys, lead, fx,
  verb: reverb(verb, { room: 0.86, damp: 0.35 }),
  dly: pingpong(dly, BEAT * 0.75, 0.35, 3000),
};
const GAIN = { drums: 0.75, bass: 0.8, pad: 2.2, keys: 1.1, lead: 1.0, fx: 0.9, verb: 1, dly: 1 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
Genre.fx('lofi', mix, { kicks });
MIX.highpass(mix, 25);
MIX.gate(mix, ev.breath, ev.lie - 0.005); // the held breath is truly silent
MIX.fadeOut(mix, DURATION - 1.8, DURATION);
const M = MIX.master(mix, 0.8, undefined, { lufs: parseFloat(process.env.LUFS || '-14') });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s, ${M.lufs !== undefined ? M.lufs.toFixed(1) + ' LUFS' : ''})`);
