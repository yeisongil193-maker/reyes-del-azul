// THE SCORE — single source of truth for music AND picture.
// "Secretos del Azul #1: el pez vela" — Reyes del Azul. Vertical 9:16, ~57s, lo-fi 88 BPM.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const { m, makeClock, placeBar, makeChords } = MU;

  const FPS = 30;
  const STYLE = 'flat';
  const FORMAT = U.pickFormat('9:16');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const WIDE = W / H > 1.2;
  const clock = makeClock({ bpm: 88, offset: 0 }); // 1 beat = 0.68s, 1 bar = 2.73s
  const { T, BEAT } = clock;
  const DURATION = T(21) + 0.4; // ~57.7s

  // ---------- scenes (cuts on bar lines) ----------
  const SC = {
    hook: [0, T(2)],
    intro: [T(2), T(4, 2)],
    speed: [T(4, 2), T(6)],
    lie: [T(6), T(9)],
    team: [T(9), T(11)],
    ball: [T(11), T(13)],
    glow: [T(13), T(15)],
    strike: [T(15), T(17)],
    calm: [T(17), T(19)],
    end: [T(19), DURATION],
  };
  const S = { // sections for levels.js
    intro: [0, T(2)], groove: [T(2), T(5, 3.5)], breath: [T(5, 3.5), T(6)], hunt: [T(6), T(17)], outro: [T(17), DURATION],
  };

  const ev = {
    hookFlash: T(1), // the fish lights up in the hook
    scratch: T(5, 3), // record stop...
    breath: T(5, 3.5), // ...half a beat of silence...
    lie: T(6), // ...MENTIRA stamp
    drop: T(7, 3), // speed needle falls
    glow: T(13), // sail up + stripes on
    strike1: T(15), strike2: T(16),
    drumsEnd: T(17),
    end: T(19),
  };

  // ---------- harmony: D minor, calm ----------
  const { chords, chordAt } = makeChords(clock, {
    Dm: { notes: ['A3', 'D4', 'F4'], bass: 'D2' },
    Bb: { notes: ['Bb3', 'D4', 'F4'], bass: 'Bb1' },
    F: { notes: ['A3', 'C4', 'F4'], bass: 'F2' },
    C: { notes: ['G3', 'C4', 'E4'], bass: 'C2' },
    Gm: { notes: ['Bb3', 'D4', 'G4'], bass: 'G1' },
    A: { notes: ['A3', 'C#4', 'E4'], bass: 'A1' },
  }, (() => {
    const prog = ['Dm', 'Bb', 'F', 'C'];
    const out = [];
    for (let b = 0; b < 21; b++) out.push([b, 0, 4, b === 5 ? 'A' : b >= 19 ? (b === 19 ? 'Bb' : 'Dm') : prog[b % 4]]);
    return out;
  })());

  // music box motif (intro + outro), marimba answer during the hunt
  const MOTIF = [['D5', 0, 1], ['F5', 1, 1], ['A5', 2, 2], ['G5', 4, 1], ['F5', 5, 1], ['E5', 6, 2]];
  const MOTIF2 = [['F5', 0, 1], ['E5', 1, 1], ['D5', 2, 2], ['C5', 4, 1], ['A4', 5, 3]];
  const musicbox = [
    ...placeBar(clock, MOTIF, 0), ...placeBar(clock, MOTIF2, 1),
    ...placeBar(clock, MOTIF, 17), ...placeBar(clock, MOTIF2, 18),
    ...placeBar(clock, [['D5', 0, 2], ['A5', 2, 2], ['F5', 4, 4]], 19), { t: T(20), dur: 3, midi: m('D6') },
  ];
  const marimba = [9, 11, 13, 15].flatMap((b) => [...placeBar(clock, MOTIF, b, 12), ...placeBar(clock, MOTIF2, b + 1, 12)]);

  // ---------- captions: word-by-word highlight (no voiceover yet: timed for reading) ----------
  const subtitles = [
    { t: T(0, 1), end: T(2), text: 'Este pez cambia de color en un instante.' },
    { t: T(2), end: T(3), text: 'Es el pez vela,' },
    { t: T(3), end: T(4, 2), text: 'y dicen que es el más rápido del océano:' },
    { t: T(4, 2), end: T(5, 3.5), text: '¡110 kilómetros por hora!' },
    { t: T(6, 1), end: T(7, 3), text: 'Ese dato salió de viejas pruebas con carretes de pesca.' },
    { t: T(7, 3), end: T(9), text: 'Estudios modernos calculan que es mucho menos.' },
    { t: T(9), end: T(10), text: 'Pero tiene un arma mejor:' },
    { t: T(10), end: T(11), text: 'caza en equipo.' },
    { t: T(11), end: T(13), text: 'Rodean un banco de sardinas y lo empujan hacia la superficie.' },
    { t: T(13), end: T(14), text: 'Levantan la vela para verse enormes' },
    { t: T(14), end: T(15), text: 'y se encienden con rayas azules.' },
    { t: T(15), end: T(17), text: 'Atacan por turnos, golpeando a las sardinas con su pico.' },
    { t: T(17), end: T(19), text: 'Y cuando termina la caza, su color se apaga.' },
    { t: T(19, 1), end: DURATION, text: 'Sígueme para más secretos del azul.' },
  ];
  // words in this set are drawn in the accent colour
  const KEY = ['color', 'vela,', 'rápido', '¡110', 'kilómetros', 'carretes', 'menos.', 'equipo.', 'sardinas', 'enormes', 'azules.', 'pico.', 'apaga.', 'azul.'];

  const markers = {
    flash: { t: ev.hookFlash, sync: 'v' },
    lie: { t: ev.lie, sync: 'av' },
    glow: { t: ev.glow, sync: 'av' },
    strike: { t: ev.strike1, sync: 'a' },
    end: ev.end,
  };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, WIDE, DURATION, clock, T, BEAT, S, SC, m, chords, chordAt, ev, markers, musicbox, marimba, subtitles, KEY };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
