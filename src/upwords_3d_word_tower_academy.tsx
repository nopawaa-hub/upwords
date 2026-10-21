import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Bundled English vocabulary for primary school classroom demonstration & sandbox validation
const DICTIONARY = new Set([
  'CAT', 'RAT', 'BAT', 'HAT', 'MAT', 'SAT', 'PAT', 'FAT', 'VAT', 'EAT', 'OAT',
  'DOG', 'LOG', 'FOG', 'HOG', 'JOG', 'COG', 'BOG', 'DOT', 'POT', 'COT', 'HOT', 'LOT', 'NOT', 'GOT', 'ROT',
  'CAR', 'BAR', 'FAR', 'JAR', 'TAR', 'WAR', 'STAR', 'SCAR',
  'SUN', 'RUN', 'FUN', 'BUN', 'GUN', 'NUN', 'PUN',
  'BIG', 'PIG', 'DIG', 'FIG', 'JIG', 'RIG', 'WIG',
  'BED', 'RED', 'LED', 'FED', 'WED', 'SHED', 'SLED',
  'PEN', 'HEN', 'MEN', 'TEN', 'DEN', 'YEN', 'THEN', 'WHEN',
  'BOX', 'FOX', 'OX', 'POX', 'SOX',
  'CUP', 'PUP', 'UP', 'SUP',
  'TOP', 'MOP', 'HOP', 'POP', 'COP', 'SOP', 'STOP', 'SHOP', 'CHOP', 'DROP', 'CROP',
  'BAG', 'TAG', 'RAG', 'WAG', 'SAG', 'NAG', 'LAG', 'FLAG', 'DRAG',
  'PAN', 'CAN', 'MAN', 'FAN', 'VAN', 'RAN', 'TAN', 'BAN', 'PLAN',
  'PIN', 'BIN', 'TIN', 'WIN', 'FIN', 'SIN', 'KIN', 'CHIN', 'THIN', 'SPIN', 'SKIN',
  'BUS', 'GUS', 'PUS', 'PLUS',
  'NET', 'PET', 'WET', 'JET', 'VET', 'SET', 'LET', 'MET', 'GET', 'BET', 'YET',
  'BUG', 'RUG', 'MUG', 'HUG', 'JUG', 'TUG', 'DUG', 'PLUG', 'SLUG',
  'LIP', 'TIP', 'ZAP', 'ZIP', 'DIP', 'HIP', 'NIP', 'RIP', 'SIP', 'SHIP', 'CHIP', 'SKIP', 'TRIP', 'SLIP',
  'MAP', 'CAP', 'TAP', 'NAP', 'LAP', 'GAP', 'SAP', 'RAP', 'TRAP', 'CLAP', 'FLAP', 'SLAP',
  'COW', 'NOW', 'HOW', 'BOW', 'ROW', 'SOW', 'VOW', 'WOW', 'PLOW',
  'TOY', 'BOY', 'JOY', 'SOY', 'COY',
  'DAY', 'SAY', 'MAY', 'WAY', 'PAY', 'LAY', 'RAY', 'BAY', 'HAY', 'GAY', 'PLAY', 'CLAY', 'STAY', 'TRAY',
  'SEE', 'BEE', 'FEE', 'TEE', 'WEE', 'FREE', 'TREE', 'KNEE',
  'BOOK', 'LOOK', 'COOK', 'TOOK', 'HOOK', 'NOOK', 'BROOK', 'SHOOK',
  'BALL', 'CALL', 'FALL', 'HALL', 'MALL', 'TALL', 'WALL', 'SMALL',
  'CAKE', 'BAKE', 'LAKE', 'MAKE', 'RAKE', 'SAKE', 'TAKE', 'WAKE', 'FAKE', 'SNAKE', 'SHAKE',
  'GAME', 'CAME', 'FAME', 'LAME', 'NAME', 'SAME', 'TAME', 'FLAME', 'FRAME',
  'TIME', 'DIME', 'LIME', 'MIME', 'CHIME', 'SLIME',
  'HOME', 'DOME', 'ROME', 'TOME', 'COME', 'SOME',
  'CUBE', 'TUBE', 'RUBE',
  'NOSE', 'ROSE', 'HOSE', 'POSE', 'CLOSE', 'THOSE',
  'ROPE', 'HOPE', 'COPE', 'POPE', 'SLOPE',
  'KITE', 'BITE', 'SITE', 'MITE', 'WHITE', 'WRITE',
  'SHIP', 'SHOP', 'SHOT', 'SHOE', 'SHOW', 'SHED', 'SHIN', 'SHUT',
  'FISH', 'DISH', 'WISH', 'CASH', 'DASH', 'LASH', 'MASH', 'RASH', 'SASH', 'WASH', 'BUSH', 'PUSH', 'RUSH',
  'BIRD', 'WORD', 'HERD', 'CARD', 'HARD', 'YARD', 'CORD', 'FORD', 'LORD',
  'GOLD', 'COLD', 'FOLD', 'HOLD', 'MOLD', 'SOLD', 'TOLD', 'BOLD',
  'HAND', 'BAND', 'LAND', 'SAND', 'WAND', 'BOND', 'FOND', 'POND', 'WIND', 'FIND', 'KIND', 'MIND',
  'RING', 'KING', 'SING', 'WING', 'PING', 'DING', 'SONG', 'LONG', 'GONG', 'RANG', 'SANG', 'HANG', 'FANG',
  'MILK', 'SILK', 'BULK', 'HULK', 'SULK',
  'JUMP', 'BUMP', 'DUMP', 'HUMP', 'LUMP', 'PUMP', 'CAMP', 'DAMP', 'LAMP', 'RAMP',
  'STAR', 'STIR', 'STEP', 'STEM', 'STAG', 'STUB', 'STUD', 'STUN',
  'FAST', 'LAST', 'MAST', 'PAST', 'VAST', 'CAST', 'EAST', 'WEST', 'BEST', 'NEST', 'PEST', 'REST', 'TEST', 'VEST', 'ZEST',
  'LIST', 'MIST', 'FIST', 'WIST', 'COST', 'LOST', 'MOST', 'POST', 'HOST', 'DUST', 'GUST', 'JUST', 'MUST', 'RUST',
  'READ', 'LEAD', 'BEAD', 'HEAD', 'DEAD', 'SEED', 'WEED', 'FEED', 'NEED', 'DEED', 'REED',
  'TEAM', 'BEAM', 'SEAM', 'REAM', 'CREAM', 'DREAM', 'STEAM', 'STREAM',
  'BOAT', 'COAT', 'GOAT', 'MOAT', 'FLOAT', 'THROAT',
  'RAIN', 'MAIN', 'PAIN', 'GAIN', 'VAIN', 'WAIN', 'TRAIN', 'BRAIN', 'GRAIN', 'DRAIN', 'CHAIN', 'PLAIN',
  'TAIL', 'BAIL', 'FAIL', 'HAIL', 'JAIL', 'MAIL', 'NAIL', 'PAIL', 'RAIL', 'SAIL', 'WAIL', 'SNAIL', 'TRAIL',
  'BEAR', 'DEAR', 'FEAR', 'GEAR', 'HEAR', 'NEAR', 'PEAR', 'REAR', 'TEAR', 'WEAR', 'YEAR', 'CLEAR',
  'BLUE', 'CLUE', 'GLUE', 'TRUE',
  'GROW', 'CROW', 'BLOW', 'FLOW', 'GLOW', 'SLOW', 'SNOW', 'KNOW', 'SHOW', 'THROW',
  'UP', 'AT', 'IN', 'ON', 'TO', 'GO', 'NO', 'SO', 'DO', 'IT', 'IS', 'AS', 'BE', 'HE', 'ME', 'WE', 'BY', 'MY', 'AN', 'AM', 'OR', 'IF', 'OF'
]);

const WORD_MEANINGS = {
  'CAT': { phonetic: '/kæt/', meaning: 'A small furry domestic animal that purrs and catches mice.' },
  'RAT': { phonetic: '/ræt/', meaning: 'A rodent that resembles a large mouse with a long tail.' },
  'BAT': { phonetic: '/bæt/', meaning: 'A nocturnal flying mammal, or a wooden club used in sports.' },
  'HAT': { phonetic: '/hæt/', meaning: 'A shaped covering for the head worn for warmth or fashion.' },
  'MAT': { phonetic: '/mæt/', meaning: 'A piece of thick material placed on the floor for wiping shoes.' },
  'SAT': { phonetic: '/sæt/', meaning: 'Past tense of sit; rested on a chair or the ground.' },
  'DOG': { phonetic: '/dɒɡ/', meaning: 'A loyal domestic animal that barks and loves to play fetch.' },
  'LOG': { phonetic: '/lɒɡ/', meaning: 'A thick piece of a fallen or cut tree trunk or branch.' },
  'FOG': { phonetic: '/fɒɡ/', meaning: 'A thick cloud of tiny water droplets near the ground.' },
  'HOG': { phonetic: '/hɒɡ/', meaning: 'A large domesticated pig.' },
  'JOG': { phonetic: '/dʒɒɡ/', meaning: 'To run at a steady, gentle pace for exercise.' }
};

const TUTORIAL_STEPS = [
  {
    step: 1,
    audioId: 'tutorial_step_1',
    title: 'WELCOME TO UPWORDS 3D!',
    subtitle: '"Build words. Stack letters. Reach new heights!"',
    explanation: 'Upwords is an exciting 3D word-building game where players create words across the board AND stack new letters right on top of existing tiles to transform words!',
    highlightBanner: 'Unlike Scrabble, Upwords lets you build UP!',
    narration: 'Welcome to Upwords 3D! Build words, stack letters, and reach new heights! Unlike Scrabble, Upwords lets you build UP by stacking letters on top of each other!',
    wordDisplay: 'U P W O R D S',
    cameraPreset: 'ORBIT_INTRO'
  },
  {
    step: 2,
    audioId: 'tutorial_step_2',
    title: 'LEARN THE BOARD',
    subtitle: 'Explore the 10 × 10 Playing Grid',
    explanation: 'This is our 10 by 10 Upwords board. Every game starts on the highlighted golden center area. We build words Horizontally (Across →) and Vertically (Down ↓). Diagonal words are not allowed!',
    highlightBanner: 'Horizontal → and Vertical ↓ only (No Diagonals!)',
    narration: 'This is our Upwords board. We start in the center and build words across from left to right, or down from top to bottom. Diagonal words are not allowed.',
    wordDisplay: 'Across → & Down ↓',
    cameraPreset: 'FLYOVER'
  },
  {
    step: 3,
    audioId: 'tutorial_step_3',
    title: 'BUILD YOUR FIRST WORD',
    subtitle: 'Placing Tiles on the Center Squares',
    explanation: 'Watch as three 3D letter tiles — C, A, and T — float from the tile rack onto the center row of the board one after another to form our very first word!',
    highlightBanner: 'C → A → T spells CAT! (/kæt/)',
    narration: 'Look! We placed C, A, and T in the center of the board. We made the word CAT!',
    wordDisplay: 'CAT',
    cameraPreset: 'ISOMETRIC'
  },
  {
    step: 4,
    audioId: 'tutorial_step_4',
    title: 'THE MAGIC OF STACKING',
    subtitle: 'Transform Words by Building Upward!',
    explanation: 'Here is the magic of Upwords! Keep CAT on the board. Now watch the new letter R rise up and land physically on top of C. The letter C stays underneath, and only the top letters are read!',
    highlightBanner: 'Transformation: CAT → RAT',
    narration: 'We put R right on top of C. Now CAT becomes RAT! Notice when we look from the side, the letter C is still physically underneath R!',
    wordDisplay: 'CAT → RAT',
    cameraPreset: 'SIDE_DEMO'
  },
  {
    step: 5,
    audioId: 'tutorial_step_5',
    title: 'MAKE THE WORD TOWER TALLER',
    subtitle: 'Stacking Up to 5 Tiles High!',
    explanation: 'Let’s make our word tower even taller! First we stack B on top of R to make BAT. Then we stack H on top of B to make HAT! Each square can hold up to 5 stacked letter tiles.',
    highlightBanner: 'Sequence: CAT → RAT → BAT → HAT (Height: 4 / Max 5)',
    narration: 'Every new letter makes our tower taller! Placing B on R makes BAT. Placing H on B makes HAT! Stacks can hold up to five tiles high.',
    wordDisplay: 'CAT → RAT → BAT → HAT',
    cameraPreset: 'TOWER_SHOWCASE'
  },
  {
    step: 6,
    audioId: 'tutorial_step_6',
    title: 'TRY IT YOURSELF!',
    subtitle: 'Interactive Pupil Challenge: DOG → LOG',
    explanation: 'The word DOG is on the board. Look at the three practice tiles below (L, P, S). Question: Which letter can replace D to make a new valid English word? Click the correct letter, then click the D tile!',
    highlightBanner: 'Question: Which letter replaces D in DOG to make LOG?',
    narration: 'Now it is your turn! The word DOG is on the board. Which letter can stack on top of D to make the word LOG? Click a letter below, then click on D!',
    wordDisplay: 'DOG → ?OG',
    cameraPreset: 'CHALLENGE_FOCUS'
  },
  {
    step: 7,
    audioId: 'tutorial_step_7',
    title: 'READY TO PLAY!',
    subtitle: 'You Have Mastered Upwords 3D!',
    explanation: 'Fantastic job! Remember the Golden Rules: 1) Build English words across or down. 2) Stack letters on top of tiles to change words. 3) Read only the topmost letters. 4) Maximum 5 tiles per stack!',
    highlightBanner: 'YOU ARE READY FOR THE UPWORDS CHALLENGE!',
    narration: 'Congratulations! You are ready for the Upwords Challenge! Choose Free Play Sandbox or Teacher Demo Mode to keep building word towers.',
    wordDisplay: 'CHAMPION!',
    cameraPreset: 'CELEBRATION'
  }
];

const NARRATION_VERSION = 'v1';
const DEFAULT_AI_VOICE = 'Puck';

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function pcmToWav(pcm16, sampleRate = 24000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcm16.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < pcm16.length; i++, offset += 2) {
    view.setInt16(offset, pcm16[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

const IDB_NAME = 'Upwords3DAudioCacheDB';
const IDB_STORE = 'narration_blobs';
const IDB_VERSION = 1;

function openAudioCacheDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'cacheKey' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getCachedAudioBlob(cacheKey) {
  try {
    const db = await openAudioCacheDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(cacheKey);
      req.onsuccess = () => {
        const record = req.result;
        resolve(record && record.blob instanceof Blob ? record.blob : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function saveCachedAudioBlob(cacheKey, audioId, text, voice, blob) {
  try {
    const db = await openAudioCacheDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put({
        cacheKey,
        audioId,
        text,
        voice,
        version: NARRATION_VERSION,
        blob,
        savedAt: Date.now()
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore IndexedDB quota or private browsing restrictions gracefully
  }
}

class ClassroomAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.voiceName = DEFAULT_AI_VOICE;
    this.memoryBlobCache = new Map();
    this.inFlightPromises = new Map();
    this.currentAudio = null;
    this.currentObjectUrl = null;
    this.requestId = 0;
    this.onStateChange = null;
  }

  notifyState(state) {
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration = 0.12, type = 'sine', volume = 0.12, delay = 0) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {
      // Ignore audio errors on restricted environments
    }
  }

  playPickup() {
    this.playTone(440, 0.09, 'sine', 0.1, 0);
    this.playTone(587.33, 0.11, 'sine', 0.1, 0.04);
  }

  playPlace(stackHeight = 1) {
    // Pitch rises with stack height so pupils hear the tower growing!
    const baseFreq = 320 + (stackHeight - 1) * 75;
    this.playTone(baseFreq, 0.12, 'triangle', 0.15, 0);
    this.playTone(baseFreq * 1.25, 0.14, 'sine', 0.12, 0.05);
  }

  playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.22, 'triangle', 0.14, idx * 0.08);
    });
  }

  playError() {
    this.playTone(220, 0.18, 'sawtooth', 0.1, 0);
    this.playTone(185, 0.24, 'sawtooth', 0.1, 0.12);
  }

  buildCacheKey(audioId, text) {
    const safeId = audioId || 'custom_narration';
    return `${safeId}::${NARRATION_VERSION}::${this.voiceName}::${text.trim()}`;
  }

  async fetchGeminiTTSBlobWithBackoff(text, voiceName) {
    // Key comes from VITE_GEMINI_KEY in a local .env file (never committed).
    // NOTE: still visible in the built bundle — move to a backend proxy for real protection.
    const apiKey = import.meta.env.VITE_GEMINI_KEY ?? "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [{
          text: `Speak as a natural, friendly, cheerful, and expressive primary school English teacher at a moderate pace suitable for young pupils: ${text}`
        }]
      }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      },
      model: "gemini-2.5-flash-preview-tts"
    };

    const delays = [1000, 2000, 4000];
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType || 'audio/L16;rate=24000';

        if (audioData) {
          const rateMatch = mimeType.match(/rate=(\d+)/);
          const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
          const pcmBuffer = base64ToArrayBuffer(audioData);
          const pcm16 = new Int16Array(pcmBuffer);
          return pcmToWav(pcm16, sampleRate);
        }
        throw new Error('No audio data in response');
      } catch (err) {
        if (attempt === delays.length) throw err;
        await new Promise(res => setTimeout(res, delays[attempt]));
      }
    }
  }

  async resolveAudioBlob(audioId, text) {
    const cacheKey = this.buildCacheKey(audioId, text);

    // 1. Check fast in-memory session Blob cache
    if (this.memoryBlobCache.has(cacheKey)) {
      return { blob: this.memoryBlobCache.get(cacheKey), fromCache: true };
    }

    // 2. Check persistent IndexedDB Blob storage (survives page refresh & reopening)
    const cachedBlob = await getCachedAudioBlob(cacheKey);
    if (cachedBlob) {
      this.memoryBlobCache.set(cacheKey, cachedBlob);
      return { blob: cachedBlob, fromCache: true };
    }

    // 3. Deduplicate any concurrent request for the same step
    if (this.inFlightPromises.has(cacheKey)) {
      const blob = await this.inFlightPromises.get(cacheKey);
      return { blob, fromCache: true };
    }

    // 4. Generate once via Gemini TTS and persist to IndexedDB
    this.notifyState('loading');
    const generationPromise = (async () => {
      try {
        const wavBlob = await this.fetchGeminiTTSBlobWithBackoff(text, this.voiceName);
        if (wavBlob) {
          this.memoryBlobCache.set(cacheKey, wavBlob);
          await saveCachedAudioBlob(cacheKey, audioId, text, this.voiceName, wavBlob);
        }
        return wavBlob;
      } finally {
        this.inFlightPromises.delete(cacheKey);
      }
    })();

    this.inFlightPromises.set(cacheKey, generationPromise);
    const wavBlob = await generationPromise;
    return { blob: wavBlob, fromCache: false };
  }

  async speak(text, audioId = 'custom_narration') {
    if (!this.enabled || !text || typeof window === 'undefined') return;
    this.stopSpeech();

    const currentReqId = ++this.requestId;

    try {
      const { blob } = await this.resolveAudioBlob(audioId, text);

      if (currentReqId !== this.requestId || !this.enabled || !blob) {
        if (currentReqId === this.requestId) this.notifyState('error');
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      this.currentObjectUrl = objectUrl;
      const audio = new Audio(objectUrl);
      this.currentAudio = audio;
      this.notifyState('speaking');

      const cleanupUrl = () => {
        if (this.currentObjectUrl === objectUrl) {
          URL.revokeObjectURL(objectUrl);
          this.currentObjectUrl = null;
        }
      };

      audio.onended = () => {
        cleanupUrl();
        if (this.currentAudio === audio) {
          this.currentAudio = null;
          this.notifyState('idle');
        }
      };

      audio.onerror = () => {
        cleanupUrl();
        if (this.currentAudio === audio) {
          this.currentAudio = null;
          this.notifyState('error');
        }
      };

      await audio.play();
    } catch (e) {
      // Never fall back to robotic browser speechSynthesis; report narration unavailable gracefully
      if (currentReqId === this.requestId) {
        this.notifyState('error');
      }
    }
  }

  stopSpeech() {
    this.requestId++;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (_) {}
      this.currentAudio = null;
    }
    if (this.currentObjectUrl) {
      try {
        URL.revokeObjectURL(this.currentObjectUrl);
      } catch (_) {}
      this.currentObjectUrl = null;
    }
    this.notifyState('idle');
  }
}

const soundFX = new ClassroomAudio();

const TILE_WIDTH = 0.9;
const TILE_DEPTH = 0.9;
const TILE_HEIGHT = 0.22; // Crisp visible thickness for classroom projection
const BOARD_SURFACE_Y = 0.16;
const MAX_STACK = 5;

function createLetterTexture(letter, bgStyle = 'normal') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background gradient based on tile state
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  if (bgStyle === 'correct') {
    grad.addColorStop(0, '#d1fae5');
    grad.addColorStop(1, '#6ee7b7');
  } else if (bgStyle === 'highlight') {
    grad.addColorStop(0, '#fef9c3');
    grad.addColorStop(1, '#fde047');
  } else if (bgStyle === 'error') {
    grad.addColorStop(0, '#fee2e2');
    grad.addColorStop(1, '#fca5a5');
  } else {
    grad.addColorStop(0, '#fffdf7');
    grad.addColorStop(1, '#f3ead8');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle recessed inner bevel frame on top of the tile
  ctx.strokeStyle = bgStyle === 'correct' ? '#059669' : bgStyle === 'highlight' ? '#ca8a04' : '#d6c7b2';
  ctx.lineWidth = 18;
  ctx.strokeRect(26, 26, 460, 460);

  // Inner soft highlight border
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, 432, 432);

  // Main uppercase bold letter
  ctx.fillStyle = '#1e293b';
  ctx.font = '900 330px "Inter", "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 4;
  ctx.fillText(letter.toUpperCase(), 256, 268);

  // Small corner point indicator for authentic board game aesthetic
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = '#64748b';
  ctx.font = '800 54px "Inter", Arial, sans-serif';
  ctx.textAlign = 'right';
  const quPoint = ['Q', 'Z', 'J', 'X'].includes(letter.toUpperCase()) ? '2' : '1';
  ctx.fillText(quPoint, 456, 444);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function createSideLayerTexture(stackIndex) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Warm ivory side body with distinct bottom groove so stacked tiles are super clear from Side View
  ctx.fillStyle = '#ebe0cb';
  ctx.fillRect(0, 0, 256, 64);

  // Top bevel rim
  ctx.fillStyle = '#fffcf5';
  ctx.fillRect(0, 0, 256, 8);

  // Bottom dark shadow seam for clear visual separation when stacked vertically
  ctx.fillStyle = '#94846b';
  ctx.fillRect(0, 54, 256, 10);

  // Subtle level badge stripe on the side
  const levelColors = ['#3b82f6', '#eab308', '#10b981', '#f97316', '#ec4899'];
  ctx.fillStyle = levelColors[Math.min(stackIndex, 4)];
  ctx.fillRect(16, 22, 224, 10);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createHeightRulerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 496, 24);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 26px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('STACK HEIGHT', 128, 48);

  const levels = [
    { lv: 5, label: '5 MAX', color: '#ec4899' },
    { lv: 4, label: '4: HAT', color: '#f97316' },
    { lv: 3, label: '3: BAT', color: '#10b981' },
    { lv: 2, label: '2: RAT', color: '#eab308' },
    { lv: 1, label: '1: CAT', color: '#3b82f6' }
  ];

  levels.forEach((item, idx) => {
    const y = 95 + idx * 80;
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.roundRect(28, y, 200, 62, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 30px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, 48, y + 41);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createEmptyBoard() {
  return Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => []));
}

function cloneBoard(board) {
  return board.map(row => row.map(cell => cell.map(tile => ({ ...tile }))));
}

// Detect all contiguous horizontal and vertical words (length >= 2) using ONLY the topmost letter of each cell
function detectWordsOnBoard(board) {
  const words = [];

  // Horizontal scan (Across →)
  for (let r = 0; r < 10; r++) {
    let c = 0;
    while (c < 10) {
      if (board[r][c].length > 0) {
        let wordStr = '';
        let cells = [];
        let totalStackHeight = 0;
        let allSingleLevel = true;
        while (c < 10 && board[r][c].length > 0) {
          const stack = board[r][c];
          const topTile = stack[stack.length - 1];
          wordStr += topTile.letter;
          cells.push({ row: r, col: c });
          totalStackHeight += stack.length;
          if (stack.length > 1) allSingleLevel = false;
          c++;
        }
        if (wordStr.length >= 2) {
          const isValid = DICTIONARY.has(wordStr.toUpperCase());
          // Official Upwords scoring: 2 pts per tile if flat (level 1 only), or 1 pt per tile in stack if stacked
          const officialScore = allSingleLevel ? wordStr.length * 2 : totalStackHeight;
          words.push({
            word: wordStr,
            direction: 'Horizontal →',
            cells,
            isValid,
            officialScore,
            maxHeight: Math.max(...cells.map(pos => board[pos.row][pos.col].length))
          });
        }
      } else {
        c++;
      }
    }
  }

  // Vertical scan (Down ↓)
  for (let c = 0; c < 10; c++) {
    let r = 0;
    while (r < 10) {
      if (board[r][c].length > 0) {
        let wordStr = '';
        let cells = [];
        let totalStackHeight = 0;
        let allSingleLevel = true;
        while (r < 10 && board[r][c].length > 0) {
          const stack = board[r][c];
          const topTile = stack[stack.length - 1];
          wordStr += topTile.letter;
          cells.push({ row: r, col: c });
          totalStackHeight += stack.length;
          if (stack.length > 1) allSingleLevel = false;
          r++;
        }
        if (wordStr.length >= 2) {
          const isValid = DICTIONARY.has(wordStr.toUpperCase());
          const officialScore = allSingleLevel ? wordStr.length * 2 : totalStackHeight;
          words.push({
            word: wordStr,
            direction: 'Vertical ↓',
            cells,
            isValid,
            officialScore,
            maxHeight: Math.max(...cells.map(pos => board[pos.row][pos.col].length))
          });
        }
      } else {
        r++;
      }
    }
  }

  return words;
}

// =====================================================================
// RulesModal — bright, kid-friendly interactive rules explorer
// Each rule has a mini animated visual demo built with plain DOM/CSS
// =====================================================================
function RulesModal({ onClose }) {
  const [ruleIndex, setRuleIndex] = useState(0);

  const rules = [
    {
      emoji: '➡️',
      title: 'Build words ACROSS or DOWN!',
      color: 'from-sky-400 to-blue-500',
      bg: 'bg-sky-50',
      border: 'border-sky-300',
      text: 'text-sky-700',
      demo: <DemoAcrossDown />,
      blurb: 'Place letters side by side (➡️) or on top of each other (⬇️) to make a word — just like reading a book!',
    },
    {
      emoji: '🧱',
      title: 'STACK letters to change words!',
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-700',
      demo: <DemoStack />,
      blurb: 'Put a new letter ON TOP of an old one and the word transforms! CAT becomes BAT when you stack B on C!',
    },
    {
      emoji: '👀',
      title: 'Only the TOP letter counts!',
      color: 'from-purple-400 to-fuchsia-500',
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      text: 'text-purple-700',
      demo: <DemoTopLetter />,
      blurb: 'When tiles are stacked, you read the letter on the very top. The letters underneath hide away!',
    },
    {
      emoji: '🏗️',
      title: 'Max height is 5 tiles!',
      color: 'from-rose-400 to-pink-500',
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-700',
      demo: <DemoMaxHeight />,
      blurb: 'You can stack up to 5 tiles high — then that square is full! Build somewhere else.',
    },
    {
      emoji: '🏆',
      title: 'Taller stacks = more points!',
      color: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      demo: <DemoScoring />,
      blurb: 'Every tile in a stack you use scores a point. The taller the tower, the bigger the score!',
    },
  ];

  const rule = rules[ruleIndex];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-100 via-white to-pink-100 border-4 border-indigo-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🎮 How to Play Upwords!
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-rose-400 hover:bg-rose-500 text-white font-black text-lg shadow-md transition-transform hover:scale-110"
          >
            ✕
          </button>
        </div>

        {/* Rule tabs */}
        <div className="flex gap-2 mb-4 justify-center">
          {rules.map((r, i) => (
            <button
              key={i}
              onClick={() => setRuleIndex(i)}
              className={`text-2xl w-11 h-11 rounded-2xl border-2 transition-all shadow-sm ${
                i === ruleIndex
                  ? 'bg-white border-indigo-400 scale-110 shadow-lg'
                  : 'bg-white/60 border-slate-200 hover:border-indigo-300 hover:scale-105'
              }`}
            >
              {r.emoji}
            </button>
          ))}
        </div>

        {/* Current rule card */}
        <div className={`${rule.bg} border-2 ${rule.border} rounded-2xl p-5 space-y-4`}>
          <h3 className={`text-xl font-black ${rule.text} text-center`}>
            {rule.emoji} {rule.title}
          </h3>

          {/* Animated demo area */}
          <div className="flex items-center justify-center min-h-[120px]">
            {rule.demo}
          </div>

          <p className="text-center text-sm font-semibold text-slate-700 leading-relaxed">
            {rule.blurb}
          </p>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setRuleIndex(Math.max(0, ruleIndex - 1))}
            disabled={ruleIndex === 0}
            className="px-5 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 disabled:opacity-40 font-black text-slate-700 text-sm transition-all"
          >
            ⬅️ Back
          </button>
          <span className="text-xs font-bold text-slate-500">
            Rule {ruleIndex + 1} of {rules.length}
          </span>
          {ruleIndex < rules.length - 1 ? (
            <button
              onClick={() => setRuleIndex(ruleIndex + 1)}
              className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${rule.color} text-white font-black text-sm shadow-md transition-transform hover:scale-105`}
            >
              Next ➡️
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black text-sm shadow-md transition-transform hover:scale-105 animate-bounce"
            >
              🎉 Let's Play!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Mini demo components (pure CSS animations, kid-friendly) ---

function DemoAcrossDown() {
  const [dir, setDir] = useState('across');
  useEffect(() => {
    const t = setInterval(() => setDir(d => (d === 'across' ? 'down' : 'across')), 2000);
    return () => clearInterval(t);
  }, []);
  const letters = ['C', 'A', 'T'];
  return (
    <div className="flex gap-3 items-center">
      <div className={`flex gap-1.5 ${dir === 'down' ? 'flex-col' : 'flex-row'} transition-all`}>
        {letters.map((l, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-300 to-blue-400 border-b-4 border-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-md"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="text-3xl">{dir === 'across' ? '➡️' : '⬇️'}</div>
    </div>
  );
}

function DemoStack() {
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setStacked(s => !s), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-end gap-3">
      {['C', 'A', 'T'].map((l, i) => (
        <div key={i} className="flex flex-col items-center">
          {i === 0 && (
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 border-b-4 border-orange-600 flex items-center justify-center text-2xl font-black text-white shadow-md transition-all duration-500 ${
                stacked ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}
            >
              B
            </div>
          )}
          <div
            className={`w-12 h-12 rounded-xl border-b-4 flex items-center justify-center text-2xl font-black shadow-md transition-all duration-500 ${
              i === 0 && stacked
                ? 'bg-slate-300 border-slate-400 text-slate-400 scale-95'
                : 'bg-gradient-to-br from-amber-300 to-orange-400 border-orange-600 text-white'
            }`}
          >
            {l}
          </div>
        </div>
      ))}
      <div className="text-2xl font-black text-amber-600 ml-2 transition-all">
        {stacked ? '= BAT! 🦇' : '= CAT 🐱'}
      </div>
    </div>
  );
}

function DemoTopLetter() {
  const [showTop, setShowTop] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setShowTop(s => !s), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col-reverse items-center">
        {['R', 'A'].map((l, i) => (
          <div
            key={l}
            className={`w-12 h-12 rounded-xl border-b-4 flex items-center justify-center text-2xl font-black shadow-md -mt-3 transition-all duration-500 ${
              showTop
                ? i === 1
                  ? 'bg-gradient-to-br from-purple-300 to-fuchsia-400 border-fuchsia-600 text-white ring-4 ring-yellow-300'
                  : 'bg-slate-300 border-slate-400 text-slate-400'
                : 'bg-gradient-to-br from-purple-300 to-fuchsia-400 border-fuchsia-600 text-white'
            }`}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="text-sm font-black text-purple-600 transition-all">
        {showTop ? '👀 We read "A" — the top one!' : 'Two letters stacked...'}
      </div>
    </div>
  );
}

function DemoMaxHeight() {
  const [height, setHeight] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setHeight(h => (h >= 5 ? 1 : h + 1)), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-end gap-4">
      <div className="flex flex-col-reverse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-12 h-9 rounded-lg border-b-2 -mt-2 transition-all duration-300 flex items-center justify-center text-sm font-black ${
              i < height
                ? i === 4 && height === 5
                  ? 'bg-gradient-to-br from-rose-300 to-pink-400 border-pink-600 text-white'
                  : 'bg-gradient-to-br from-rose-200 to-pink-300 border-pink-500 text-white'
                : 'opacity-0'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="text-lg font-black text-rose-600">
        {height}/5 {height === 5 && '🛑 FULL!'}
      </div>
    </div>
  );
}

function DemoScoring() {
  const [stack, setStack] = useState([3, 1, 2]);
  useEffect(() => {
    const seq = [[3, 1, 2], [4, 2, 3], [2, 3, 1]];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setStack(seq[i]);
    }, 1500);
    return () => clearInterval(t);
  }, []);
  const total = stack.reduce((a, b) => a + b, 0);
  return (
    <div className="flex items-end gap-3">
      {stack.map((h, i) => (
        <div key={i} className="flex flex-col-reverse items-center">
          {Array.from({ length: h }).map((_, j) => (
            <div
              key={j}
              className="w-10 h-7 rounded-md bg-gradient-to-br from-emerald-300 to-teal-400 border-b-2 border-teal-600 -mt-1.5 shadow-sm"
            />
          ))}
        </div>
      ))}
      <div className="text-xl font-black text-emerald-600 ml-2">
        = {total} points! ⭐
      </div>
    </div>
  );
}

export default function App() {
  // Primary mode: 'TUTORIAL' | 'SANDBOX' | 'TEACHER_DEMO'
  const [appMode, setAppMode] = useState('TUTORIAL');
  const [tutorialStep, setTutorialStep] = useState(1);

  // 10x10 Board State: board[row][col] = [{ id, letter, status }]
  const [board, setBoard] = useState(() => createEmptyBoard());
  const [boardHistory, setBoardHistory] = useState([]);

  // Rack and Tile Selection State
  const [rackTiles, setRackTiles] = useState(['C', 'A', 'T', 'R', 'B', 'H', 'S']);
  const [selectedRackIndex, setSelectedRackIndex] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ row: 4, col: 4 });
  const [hoveredCell, setHoveredCell] = useState(null);

  // Step 6 Interactive Challenge State
  const [challengeChoices] = useState(['L', 'P', 'S']);
  const [selectedChallengeLetter, setSelectedChallengeLetter] = useState('L');
  const [challengeSolved, setChallengeSolved] = useState(false);

  // Animation & Camera Controls State
  const [isAnimating, setIsAnimating] = useState(false);
  const [slowMotion, setSlowMotion] = useState(false);
  const [spotlightMode, setSpotlightMode] = useState(false);
  const [activeCameraPreset, setActiveCameraPreset] = useState('ISOMETRIC');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ttsStatus, setTtsStatus] = useState('idle'); // 'idle' | 'loading' | 'speaking' | 'error'
  const [strictValidation, setStrictValidation] = useState(false);
  const [officialRulesMode, setOfficialRulesMode] = useState(false);

  // UI Panels Visibility
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [showRack, setShowRack] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Teacher Demo Custom Inputs
  const [teacherWordInput, setTeacherWordInput] = useState('CAT');
  const [teacherSingleLetter, setTeacherSingleLetter] = useState('R');

  // Toast / Classroom Banner Feedback (No blocking alerts!)
  const [bannerFeedback, setBannerFeedback] = useState({
    type: 'info', // 'info' | 'success' | 'error' | 'warning'
    title: 'Welcome to Upwords 3D – Word Tower Academy!',
    message: 'Rotate the 3D board with left mouse drag, zoom with scroll wheel, or click Side View to inspect stacks.'
  });

  // Classroom 5-Team Scoring System (with safe localStorage persistence)
  const defaultTeams = [
    { id: 'red', name: 'Red Team', color: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-400', score: 0, transformations: 0 },
    { id: 'blue', name: 'Blue Team', color: 'bg-sky-500', border: 'border-sky-400', text: 'text-sky-400', score: 0, transformations: 0 },
    { id: 'green', name: 'Green Team', color: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-400', score: 0, transformations: 0 },
    { id: 'yellow', name: 'Yellow Team', color: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-400', score: 0, transformations: 0 },
    { id: 'pink', name: 'Pink Team', color: 'bg-pink-500', border: 'border-pink-400', text: 'text-pink-400', score: 0, transformations: 0 }
  ];

  const [teams, setTeams] = useState(() => {
    try {
      const saved = localStorage.getItem('upwords_3d_teams_v1');
      return saved ? JSON.parse(saved) : defaultTeams;
    } catch {
      return defaultTeams;
    }
  });
  const [activeTeamId, setActiveTeamId] = useState('blue');

  useEffect(() => {
    try {
      localStorage.setItem('upwords_3d_teams_v1', JSON.stringify(teams));
    } catch {
      // Ignore storage errors in sandboxed iframes
    }
  }, [teams]);

  useEffect(() => {
    soundFX.enabled = soundEnabled;
    if (!soundEnabled) soundFX.stopSpeech();
  }, [soundEnabled]);

  useEffect(() => {
    soundFX.onStateChange = (st) => setTtsStatus(st);
    return () => {
      soundFX.onStateChange = null;
    };
  }, []);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cellMeshesRef = useRef([]); // 100 selectable cell meshes
  const tileMeshesMapRef = useRef(new Map()); // id -> THREE.Mesh
  const activeTileAnimsRef = useRef([]); // Animated moving tiles
  const cameraAnimRef = useRef(null); // Smooth camera transition state
  const directionArrowsGroupRef = useRef(null); // Horizontal & Vertical arrows for Step 2
  const heightRulerMeshRef = useRef(null); // Vertical height ruler beside stack for Step 4 & 5
  const targetHaloMeshRef = useRef(null); // Golden glowing ring above target cell
  const particlesGroupRef = useRef(null); // Celebratory 3D confetti particles
  const autoOrbitRef = useRef(false);
  const stepTimeoutsRef = useRef([]);
  const tileIdCounterRef = useRef(1);
  const textureCacheRef = useRef(new Map());
  const webglErrorRef = useRef(false);
  const hasUserInteractedWithStepRef = useRef(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Refs to access current state inside Three.js pointer event listeners
  const stateRef = useRef({
    appMode,
    tutorialStep,
    board,
    selectedRackIndex,
    rackTiles,
    selectedChallengeLetter,
    challengeSolved,
    isAnimating,
    slowMotion,
    strictValidation,
    officialRulesMode,
    activeTeamId
  });

  useEffect(() => {
    stateRef.current = {
      appMode,
      tutorialStep,
      board,
      selectedRackIndex,
      rackTiles,
      selectedChallengeLetter,
      challengeSolved,
      isAnimating,
      slowMotion,
      strictValidation,
      officialRulesMode,
      activeTeamId
    };
  }, [
    appMode,
    tutorialStep,
    board,
    selectedRackIndex,
    rackTiles,
    selectedChallengeLetter,
    challengeSolved,
    isAnimating,
    slowMotion,
    strictValidation,
    officialRulesMode,
    activeTeamId
  ]);

  // Helper to convert (row, col) -> 3D world (x, z)
  const cellToWorldXZ = useCallback((row, col) => {
    return {
      x: (col - 4.5) * 1.0,
      z: (row - 4.5) * 1.0
    };
  }, []);

  // Formula required by specification: boardSurfaceY + (stackIndex + 0.5) * tileHeight
  const stackIndexToWorldY = useCallback((stackIndex) => {
    return BOARD_SURFACE_Y + (stackIndex + 0.5) * TILE_HEIGHT;
  }, []);

  // Clear all scheduled tutorial timeouts so fast clicking never causes conflicts
  const clearScheduledAnims = useCallback(() => {
    stepTimeoutsRef.current.forEach(t => clearTimeout(t));
    stepTimeoutsRef.current = [];
  }, []);

  const moveCameraSmoothly = useCallback((targetPos, targetLookAt, durationMs = 1100) => {
    if (!cameraRef.current || !controlsRef.current) return;
    autoOrbitRef.current = false;
    cameraAnimRef.current = {
      startPos: cameraRef.current.position.clone(),
      endPos: new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z),
      startLook: controlsRef.current.target.clone(),
      endLook: new THREE.Vector3(targetLookAt.x, targetLookAt.y, targetLookAt.z),
      startTime: performance.now(),
      duration: stateRef.current.slowMotion ? durationMs * 1.7 : durationMs
    };
  }, []);

  const applyCameraView = useCallback((viewName) => {
    setActiveCameraPreset(viewName);
    switch (viewName) {
      case 'ISOMETRIC':
        moveCameraSmoothly({ x: 0, y: 9.2, z: 9.8 }, { x: 0, y: 0.3, z: 0 }, 1000);
        break;
      case 'TOP':
        moveCameraSmoothly({ x: 0, y: 14.5, z: 0.01 }, { x: 0, y: 0, z: 0 }, 1000);
        break;
      case 'SIDE':
        // Crucial low-angle Side View so primary school pupils clearly see the physical stacked tiles!
        moveCameraSmoothly({ x: 0, y: 1.45, z: 9.4 }, { x: -0.5, y: 0.65, z: -0.5 }, 1100);
        break;
      case 'TOWER_CLOSEUP':
        moveCameraSmoothly({ x: -3.2, y: 1.9, z: 4.2 }, { x: -0.5, y: 0.65, z: -0.5 }, 1100);
        break;
      case 'RESET':
      default:
        moveCameraSmoothly({ x: 0, y: 9.2, z: 9.8 }, { x: 0, y: 0.3, z: 0 }, 900);
        break;
    }
  }, [moveCameraSmoothly]);

  const spawnCelebrationConfetti = useCallback((worldX = 0, worldZ = 0) => {
    const group = particlesGroupRef.current;
    if (!group) return;
    const colors = [0x10b981, 0xfacc15, 0x38bdf8, 0xf472b6, 0xa855f7];
    const geo = new THREE.BoxGeometry(0.14, 0.14, 0.04);

    for (let i = 0; i < 36; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.3,
        metalness: 0.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        worldX + (Math.random() - 0.5) * 1.4,
        0.6 + Math.random() * 0.5,
        worldZ + (Math.random() - 0.5) * 1.4
      );
      mesh.userData = {
        vx: (Math.random() - 0.5) * 4.5,
        vy: 3.5 + Math.random() * 4.2,
        vz: (Math.random() - 0.5) * 4.5,
        rx: (Math.random() - 0.5) * 8,
        ry: (Math.random() - 0.5) * 8,
        life: 1.0
      };
      group.add(mesh);
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch (err) {
      webglErrorRef.current = true;
      setWebglSupported(false);
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');
    scene.fog = new THREE.FogExp2('#0f172a', 0.022);
    sceneRef.current = scene;

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 9.2, 9.8);
    cameraRef.current = camera;

    // OrbitControls with polar restriction to prevent confusing upside-down angles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Never go below the board table
    controls.minPolarAngle = 0.05;
    controls.minDistance = 3.5;
    controls.maxDistance = 22;
    controls.target.set(0, 0.3, 0);
    controlsRef.current = controls;

    // Classroom-friendly soft lighting & shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.15);
    dirLight.position.set(7, 14, 9);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 35;
    const d = 7.5;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-9, 6, -8);
    scene.add(rimLight);

    // 3D Navy Bevelled Board Base
    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    const outerFrameGeo = new THREE.BoxGeometry(11.4, 0.36, 11.4);
    const outerFrameMat = new THREE.MeshStandardMaterial({
      color: 0x0f2942,
      roughness: 0.35,
      metalness: 0.25
    });
    const outerFrameMesh = new THREE.Mesh(outerFrameGeo, outerFrameMat);
    outerFrameMesh.position.y = -0.06;
    outerFrameMesh.receiveShadow = true;
    boardGroup.add(outerFrameMesh);

    const innerRimGeo = new THREE.BoxGeometry(10.5, 0.42, 10.5);
    const innerRimMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      roughness: 0.4,
      metalness: 0.15
    });
    const innerRimMesh = new THREE.Mesh(innerRimGeo, innerRimMat);
    innerRimMesh.position.y = -0.04;
    innerRimMesh.receiveShadow = true;
    boardGroup.add(innerRimMesh);

    // Coordinate labels around the board perimeter (A-J columns, 1-10 rows)
    const makeCoordBadge = (text, x, z) => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 40px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 32, 32);
      const tex = new THREE.CanvasTexture(c);
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.42, 0.42),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true })
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.set(x, 0.18, z);
      boardGroup.add(plane);
    };

    for (let i = 0; i < 10; i++) {
      const pos = (i - 4.5) * 1.0;
      makeCoordBadge(String.fromCharCode(65 + i), pos, -5.35);
      makeCoordBadge(String(i + 1), -5.35, pos);
    }

    // Build 100 Individually Selectable 3D Board Cells (10x10 Grid)
    const cellGeo = new THREE.BoxGeometry(0.94, 0.14, 0.94);
    const cellMeshes = [];

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const isCenterStart = (row === 4 || row === 5) && (col === 4 || col === 5);
        const isCatCenterRow = row === 4 && (col === 3 || col === 4 || col === 5);
        const isEven = (row + col) % 2 === 0;

        let baseHex = isEven ? 0x1e293b : 0x26354d;
        if (isCenterStart) baseHex = 0x3b4252;

        const mat = new THREE.MeshStandardMaterial({
          color: baseHex,
          roughness: 0.45,
          metalness: 0.1,
          emissive: isCenterStart ? new THREE.Color(0x422006) : new THREE.Color(0x000000),
          emissiveIntensity: isCenterStart ? 0.55 : 0
        });

        const cellMesh = new THREE.Mesh(cellGeo, mat);
        const { x, z } = cellToWorldXZ(row, col);
        cellMesh.position.set(x, 0.09, z);
        cellMesh.receiveShadow = true;
        cellMesh.userData = {
          type: 'CELL',
          row,
          col,
          baseHex,
          isCenterStart,
          isCatCenterRow
        };

        // Golden star frame on center 4 starting squares
        if (isCenterStart) {
          const ringGeo = new THREE.RingGeometry(0.26, 0.36, 4);
          const ringMat = new THREE.MeshBasicMaterial({
            color: 0xfacc15,
            side: THREE.DoubleSide
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = -Math.PI / 2;
          ring.rotation.z = Math.PI / 4;
          ring.position.y = 0.075;
          cellMesh.add(ring);
        }

        boardGroup.add(cellMesh);
        cellMeshes.push(cellMesh);
      }
    }
    cellMeshesRef.current = cellMeshes;

    // Step 2 Visual Direction Arrows (Horizontal → and Vertical ↓)
    const arrowsGroup = new THREE.Group();
    arrowsGroup.visible = false;
    scene.add(arrowsGroup);

    const create3DArrow = (color, length) => {
      const group = new THREE.Group();
      const shaftGeo = new THREE.CylinderGeometry(0.08, 0.08, length, 16);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4
      });
      const shaft = new THREE.Mesh(shaftGeo, mat);
      shaft.position.y = length / 2;
      group.add(shaft);

      const headGeo = new THREE.ConeGeometry(0.24, 0.5, 20);
      const head = new THREE.Mesh(headGeo, mat);
      head.position.y = length + 0.25;
      group.add(head);
      return group;
    };

    // Horizontal Arrow (Across →)
    const horizArrow = create3DArrow(0x38bdf8, 3.2);
    horizArrow.rotation.z = -Math.PI / 2;
    horizArrow.position.set(-1.8, 0.45, -0.5);
    arrowsGroup.add(horizArrow);

    // Vertical Arrow (Down ↓)
    const vertArrow = create3DArrow(0xfacc15, 3.2);
    vertArrow.rotation.x = Math.PI / 2;
    vertArrow.position.set(-0.5, 0.45, -1.8);
    arrowsGroup.add(vertArrow);
    directionArrowsGroupRef.current = arrowsGroup;

    // Step 4 & 5 Vertical Height Indicator beside the first stack (row 4, col 3)
    const rulerTex = createHeightRulerTexture();
    const rulerGeo = new THREE.PlaneGeometry(0.95, 1.65);
    const rulerMat = new THREE.MeshBasicMaterial({
      map: rulerTex,
      transparent: true,
      side: THREE.DoubleSide
    });
    const rulerMesh = new THREE.Mesh(rulerGeo, rulerMat);
    const stackSpot = cellToWorldXZ(4, 3);
    rulerMesh.position.set(stackSpot.x - 0.95, 0.98, stackSpot.z);
    rulerMesh.visible = false;
    scene.add(rulerMesh);
    heightRulerMeshRef.current = rulerMesh;

    // Glowing Golden Halo above the active target cell
    const haloGeo = new THREE.RingGeometry(0.32, 0.44, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.visible = false;
    scene.add(haloMesh);
    targetHaloMeshRef.current = haloMesh;

    // Celebration Confetti Group
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    particlesGroupRef.current = particlesGroup;

    // Raycaster for clicking, hovering, and double-clicking tiles/cells
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const getIntersectedCellOrTile = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const tileMeshes = Array.from(tileMeshesMapRef.current.values());
      const targets = [...tileMeshes, ...cellMeshesRef.current];
      const intersects = raycaster.intersectObjects(targets, false);
      return intersects.length > 0 ? intersects[0].object : null;
    };

    const onPointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerDownPos = { x: clientX, y: clientY };
    };

    const onPointerMove = (e) => {
      const hit = getIntersectedCellOrTile(e);
      if (hit && hit.userData && typeof hit.userData.row === 'number') {
        setHoveredCell({ row: hit.userData.row, col: hit.userData.col });
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredCell(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onPointerUp = (e) => {
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      const dist = Math.hypot(clientX - pointerDownPos.x, clientY - pointerDownPos.y);
      if (dist > 8) return; // Ignore camera drag gestures

      const hit = getIntersectedCellOrTile(e);
      if (hit && hit.userData && typeof hit.userData.row === 'number') {
        const { row, col } = hit.userData;
        setSelectedCell({ row, col });
        handleBoardCellInteraction(row, col);
      }
    };

    const onDoubleClick = (e) => {
      const hit = getIntersectedCellOrTile(e);
      if (hit && hit.userData && typeof hit.userData.row === 'number') {
        const { row, col } = hit.userData;
        const { x, z } = cellToWorldXZ(row, col);
        const stackLen = stateRef.current.board[row][col].length;
        const topY = stackIndexToWorldY(Math.max(0, stackLen - 1));
        moveCameraSmoothly(
          { x: x + 0.2, y: topY + 2.4, z: z + 3.8 },
          { x, y: topY, z },
          850
        );
        setBannerFeedback({
          type: 'info',
          title: `Camera Focused on Square ${String.fromCharCode(65 + col)}${row + 1}`,
          message: stackLen > 0
            ? `Stack height: ${stackLen}/5 tiles. Top visible letter: ${stateRef.current.board[row][col][stackLen - 1].letter}`
            : 'Empty square. Select a letter to place a tile here!'
        });
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    domElem.addEventListener('pointermove', onPointerMove);
    domElem.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('dblclick', onDoubleClick);

    // Main Frame-Rate Independent Animation Loop
    let reqId;
    let lastTime = performance.now();

    const animate = (now) => {
      reqId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 1. Gentle auto-rotation on Welcome Step 1
      if (autoOrbitRef.current && controlsRef.current && cameraRef.current) {
        const angle = dt * 0.35;
        const x = cameraRef.current.position.x;
        const z = cameraRef.current.position.z;
        cameraRef.current.position.x = x * Math.cos(angle) - z * Math.sin(angle);
        cameraRef.current.position.z = x * Math.sin(angle) + z * Math.cos(angle);
      }

      // 2. Smooth Camera Interpolation
      if (cameraAnimRef.current) {
        const anim = cameraAnimRef.current;
        const t = Math.min((now - anim.startTime) / anim.duration, 1);
        // Smooth cubic ease-in-out
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        camera.position.lerpVectors(anim.startPos, anim.endPos, ease);
        controls.target.lerpVectors(anim.startLook, anim.endLook, ease);
        if (t >= 1) cameraAnimRef.current = null;
      }

      // 3. Active 3D Letter Tile Placement / Stacking Animations
      if (activeTileAnimsRef.current.length > 0) {
        const remaining = [];
        for (const item of activeTileAnimsRef.current) {
          const t = Math.min((now - item.startTime) / item.duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);

          if (item.mode === 'ARC_STACK') {
            // Parabolic arc rising high above the stack and descending smoothly onto the top surface
            const curX = THREE.MathUtils.lerp(item.startPos.x, item.endPos.x, ease);
            const curZ = THREE.MathUtils.lerp(item.startPos.z, item.endPos.z, ease);
            const linearY = THREE.MathUtils.lerp(item.startPos.y, item.endPos.y, ease);
            const arcBoost = Math.sin(t * Math.PI) * item.arcHeight;
            item.mesh.position.set(curX, linearY + arcBoost, curZ);
            item.mesh.rotation.y = (1 - ease) * Math.PI * 0.5;
          } else if (item.mode === 'SHAKE_REJECT') {
            // Subtle red shake animation for incorrect challenge letters
            const shakeOffset = Math.sin(t * Math.PI * 6) * 0.22 * (1 - t);
            item.mesh.position.x = item.endPos.x + shakeOffset;
          }

          if (t < 1) {
            remaining.push(item);
          } else {
            item.mesh.position.copy(item.endPos);
            item.mesh.rotation.set(0, 0, 0);
            if (item.onComplete) item.onComplete();
          }
        }
        activeTileAnimsRef.current = remaining;
      }

      // 4. Pulsing Golden Target Halo & Direction Arrows
      if (targetHaloMeshRef.current && targetHaloMeshRef.current.visible) {
        const pulse = 1 + Math.sin(now * 0.006) * 0.14;
        targetHaloMeshRef.current.scale.set(pulse, pulse, 1);
        targetHaloMeshRef.current.rotation.z += dt * 1.2;
      }

      if (directionArrowsGroupRef.current && directionArrowsGroupRef.current.visible) {
        directionArrowsGroupRef.current.position.y = Math.sin(now * 0.004) * 0.12;
      }

      // 5. Update Celebration Confetti Particles
      if (particlesGroupRef.current && particlesGroupRef.current.children.length > 0) {
        const toRemove = [];
        particlesGroupRef.current.children.forEach(p => {
          p.position.x += p.userData.vx * dt;
          p.position.y += p.userData.vy * dt;
          p.position.z += p.userData.vz * dt;
          p.userData.vy -= 9.2 * dt; // Gravity
          p.rotation.x += p.userData.rx * dt;
          p.rotation.y += p.userData.ry * dt;
          p.userData.life -= dt * 0.55;
          if (p.position.y < 0 || p.userData.life <= 0) {
            toRemove.push(p);
          }
        });
        toRemove.forEach(p => {
          particlesGroupRef.current.remove(p);
          p.material.dispose();
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    // Responsive Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('pointerdown', onPointerDown);
      domElem.removeEventListener('pointermove', onPointerMove);
      domElem.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('dblclick', onDoubleClick);
      clearScheduledAnims();
      renderer.dispose();
    };
  }, [cellToWorldXZ, stackIndexToWorldY, moveCameraSmoothly, clearScheduledAnims]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const currentTileIds = new Set();
    const sharedBoxGeo = new THREE.BoxGeometry(TILE_WIDTH, TILE_HEIGHT, TILE_DEPTH);

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const stack = board[r][c];
        const { x, z } = cellToWorldXZ(r, c);

        stack.forEach((tileObj, stackIndex) => {
          currentTileIds.add(tileObj.id);
          const targetY = stackIndexToWorldY(stackIndex);
          const styleKey = `${tileObj.letter}_${tileObj.status || 'normal'}`;

          if (!textureCacheRef.current.has(styleKey)) {
            textureCacheRef.current.set(
              styleKey,
              createLetterTexture(tileObj.letter, tileObj.status || 'normal')
            );
          }
          const topTex = textureCacheRef.current.get(styleKey);

          const sideKey = `SIDE_${stackIndex}`;
          if (!textureCacheRef.current.has(sideKey)) {
            textureCacheRef.current.set(sideKey, createSideLayerTexture(stackIndex));
          }
          const sideTex = textureCacheRef.current.get(sideKey);

          let mesh = tileMeshesMapRef.current.get(tileObj.id);
          if (!mesh) {
            // Create 6-faced material array so the top has the crisp letter and sides show the stack level seam
            const sideMat = new THREE.MeshStandardMaterial({
              map: sideTex,
              roughness: 0.35,
              metalness: 0.08
            });
            const topMat = new THREE.MeshStandardMaterial({
              map: topTex,
              roughness: 0.28,
              metalness: 0.05
            });
            const bottomMat = new THREE.MeshStandardMaterial({ color: 0xd6c7b2, roughness: 0.6 });

            const materials = [sideMat, sideMat, topMat, bottomMat, sideMat, sideMat];
            mesh = new THREE.Mesh(sharedBoxGeo, materials);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Add subtle dark edge outline so stacked tiles are ultra-distinct from every angle
            const edgesGeo = new THREE.EdgesGeometry(sharedBoxGeo);
            const edgesMat = new THREE.LineBasicMaterial({ color: 0x475569 });
            const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
            mesh.add(wireframe);

            // Start elevated and animate down smoothly
            const startX = tileObj.fromRackX ?? x;
            const startZ = tileObj.fromRackZ ?? z + 3.2;
            const startY = targetY + 1.8;
            mesh.position.set(startX, startY, startZ);

            scene.add(mesh);
            tileMeshesMapRef.current.set(tileObj.id, mesh);

            const dur = stateRef.current.slowMotion ? 1350 : 680;
            activeTileAnimsRef.current.push({
              mesh,
              mode: 'ARC_STACK',
              startPos: new THREE.Vector3(startX, startY, startZ),
              endPos: new THREE.Vector3(x, targetY, z),
              arcHeight: stackIndex > 0 ? 1.45 : 0.85,
              startTime: performance.now(),
              duration: dur,
              onComplete: () => {
                soundFX.playPlace(stackIndex + 1);
              }
            });
          } else {
            // Update top texture if highlight/correct status changed
            if (Array.isArray(mesh.material) && mesh.material[2].map !== topTex) {
              mesh.material[2].map = topTex;
              mesh.material[2].needsUpdate = true;
            }
            // Ensure position matches exact stack formula if not mid-flight
            const isBeingAnimated = activeTileAnimsRef.current.some(a => a.mesh === mesh);
            if (!isBeingAnimated) {
              mesh.position.set(x, targetY, z);
            }
          }

          // Spotlight mode dimming for non-highlighted cells
          const isDimmed = spotlightMode && tileObj.status !== 'highlight' && tileObj.status !== 'correct';
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => {
              m.opacity = isDimmed ? 0.35 : 1.0;
              m.transparent = isDimmed;
            });
          }

          mesh.userData = {
            type: 'TILE',
            id: tileObj.id,
            letter: tileObj.letter,
            row: r,
            col: c,
            stackIndex
          };
        });
      }
    }

    // Dispose removed tiles cleanly (e.g., when Undo or Reset is pressed)
    for (const [id, mesh] of tileMeshesMapRef.current.entries()) {
      if (!currentTileIds.has(id)) {
        scene.remove(mesh);
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        }
        tileMeshesMapRef.current.delete(id);
      }
    }
  }, [board, spotlightMode, cellToWorldXZ, stackIndexToWorldY]);

  useEffect(() => {
    cellMeshesRef.current.forEach(cellMesh => {
      const { row, col, baseHex, isCenterStart, isCatCenterRow } = cellMesh.userData;
      const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
      const isHovered = hoveredCell && hoveredCell.row === row && hoveredCell.col === col;
      const stackCount = board[row][col].length;

      let hex = baseHex;
      let emissiveHex = isCenterStart ? 0x422006 : 0x000000;
      let emissiveInt = isCenterStart ? 0.55 : 0;

      // Tutorial Step 2 highlights the center starting area in golden yellow
      if (appMode === 'TUTORIAL' && tutorialStep === 2 && (isCenterStart || isCatCenterRow)) {
        hex = 0xca8a04;
        emissiveHex = 0xfacc15;
        emissiveInt = 0.7;
      } else if (isSelected) {
        hex = 0x0284c7;
        emissiveHex = 0x38bdf8;
        emissiveInt = 0.75;
      } else if (isHovered) {
        hex = stackCount >= MAX_STACK ? 0x991b1b : 0x0369a1;
        emissiveHex = stackCount >= MAX_STACK ? 0xef4444 : 0x0ea5e9;
        emissiveInt = 0.55;
      } else if (appMode === 'SANDBOX' && selectedRackIndex !== null && stackCount < MAX_STACK) {
        // Highlight eligible cells when a rack letter is selected
        if (stackCount > 0 || isCenterStart) {
          emissiveHex = 0x0d9488;
          emissiveInt = 0.4;
        }
      }

      cellMesh.material.color.setHex(hex);
      cellMesh.material.emissive.setHex(emissiveHex);
      cellMesh.material.emissiveIntensity = emissiveInt;
    });
  }, [selectedCell, hoveredCell, appMode, tutorialStep, board, selectedRackIndex]);

  const awardPointsToTeam = useCallback((points, reasonText, isTransformation = false) => {
    setTeams(prev =>
      prev.map(team => {
        if (team.id !== stateRef.current.activeTeamId) return team;
        const nextTransformations = isTransformation ? team.transformations + 1 : team.transformations;
        const fiveBonus = isTransformation && nextTransformations % 5 === 0 ? 10 : 0;
        return {
          ...team,
          score: Math.max(0, team.score + points + fiveBonus),
          transformations: nextTransformations
        };
      })
    );
    if (points > 0) {
      soundFX.playSuccess();
    }
  }, []);

  // Place a letter tile onto board[row][col] with validation for Max Stack = 5 and identical top letter
  const placeTileOnCell = useCallback((row, col, letter, status = 'normal', saveHistory = true) => {
    const cleanLetter = letter.toUpperCase();
    const currentBoard = stateRef.current.board;
    const cellStack = currentBoard[row][col];

    // Mandatory Rule: Maximum 5 tiles per square
    if (cellStack.length >= MAX_STACK) {
      soundFX.playError();
      setBannerFeedback({
        type: 'error',
        title: 'Maximum Tower Height Reached (5 Tiles)!',
        message: `Square ${String.fromCharCode(65 + col)}${row + 1} already has 5 stacked tiles. In Upwords, stacks cannot exceed 5 tiles high!`
      });
      return false;
    }

    // Upwords Rule: Cannot stack the exact same letter directly on top of itself
    if (cellStack.length > 0 && cellStack[cellStack.length - 1].letter === cleanLetter) {
      soundFX.playError();
      setBannerFeedback({
        type: 'warning',
        title: 'Same Letter Already on Top!',
        message: `The top of this stack is already "${cleanLetter}". Choose a different letter to transform the word!`
      });
      return false;
    }

    const nextBoard = cloneBoard(currentBoard);
    const wasOccupied = nextBoard[row][col].length > 0;
    const prevTopLetter = wasOccupied ? nextBoard[row][col][nextBoard[row][col].length - 1].letter : null;

    nextBoard[row][col].push({
      id: `tile_${tileIdCounterRef.current++}_${Date.now()}`,
      letter: cleanLetter,
      status,
      fromRackX: (col - 4.5) * 1.0,
      fromRackZ: 4.8
    });

    // Strict Dictionary Check if enabled in Sandbox or Official Rules Mode
    if (stateRef.current.strictValidation || stateRef.current.officialRulesMode) {
      const formedWords = detectWordsOnBoard(nextBoard);
      const invalidWords = formedWords.filter(w => !w.isValid);
      if (invalidWords.length > 0) {
        soundFX.playError();
        setBannerFeedback({
          type: 'error',
          title: `Invalid English Word: "${invalidWords[0].word}"`,
          message: `Strict Dictionary Mode rejected "${invalidWords[0].word}". Try another letter or disable Strict Mode for free exploration.`
        });
        return false;
      }
    }

    if (saveHistory) {
      setBoardHistory(prev => [...prev, cloneBoard(currentBoard)]);
    }
    setBoard(nextBoard);

    // Check newly formed valid words to celebrate & award classroom points
    const wordsAfter = detectWordsOnBoard(nextBoard);
    const validAfter = wordsAfter.filter(w => w.isValid);

    if (validAfter.length > 0) {
      const latestWord = validAfter[validAfter.length - 1];
      const { x, z } = cellToWorldXZ(row, col);
      spawnCelebrationConfetti(x, z);

      if (wasOccupied) {
        awardPointsToTeam(5, `Transformed ${prevTopLetter} → ${cleanLetter} (${latestWord.word})`, true);
        setBannerFeedback({
          type: 'success',
          title: `WORD TRANSFORMED: ${latestWord.word}! (+5 Points)`,
          message: `Stacked "${cleanLetter}" on top of "${prevTopLetter}"! Tower height is now ${nextBoard[row][col].length}/5.`
        });
      } else {
        awardPointsToTeam(5, `Built word ${latestWord.word}`, false);
        setBannerFeedback({
          type: 'success',
          title: `VALID WORD BUILT: ${latestWord.word}! (+5 Points)`,
          message: WORD_MEANINGS[latestWord.word]
            ? `${latestWord.word} ${WORD_MEANINGS[latestWord.word].phonetic}: ${WORD_MEANINGS[latestWord.word].meaning}`
            : `Great job building "${latestWord.word}" (${latestWord.direction})!`
        });
      }
    } else {
      setBannerFeedback({
        type: 'info',
        title: wasOccupied
          ? `Stacked "${cleanLetter}" on "${prevTopLetter}" (Level ${nextBoard[row][col].length}/5)`
          : `Placed "${cleanLetter}" on Square ${String.fromCharCode(65 + col)}${row + 1}`,
        message: 'Continue placing or stacking letters across or down to complete a word!'
      });
    }

    return true;
  }, [awardPointsToTeam, cellToWorldXZ, spawnCelebrationConfetti]);

  const handleBoardCellInteraction = useCallback((row, col) => {
    const st = stateRef.current;
    if (st.isAnimating) return;

    // 1. Step 6 Interactive Pupil Challenge: DOG -> LOG
    if (st.appMode === 'TUTORIAL' && st.tutorialStep === 6) {
      if (st.challengeSolved) {
        setBannerFeedback({
          type: 'success',
          title: 'Challenge Already Completed!',
          message: 'Click "Reset Challenge" to let another pupil try, or click "Next Step" to finish!'
        });
        return;
      }

      // Target cell is D in DOG at (row 4, col 3)
      if (row !== 4 || col !== 3) {
        soundFX.playError();
        setBannerFeedback({
          type: 'warning',
          title: 'Click on the Letter "D" Tile!',
          message: 'We want to replace the letter D in DOG to make LOG. Click directly on the D tile!'
        });
        return;
      }

      const chosen = st.selectedChallengeLetter;
      if (chosen === 'L') {
        // Correct Answer! Stack L physically over D
        const nextBoard = cloneBoard(st.board);
        nextBoard[4][3].push({
          id: `tile_challenge_L_${Date.now()}`,
          letter: 'L',
          status: 'correct',
          fromRackX: -1.5,
          fromRackZ: 4.5
        });
        nextBoard[4][4][0].status = 'correct';
        nextBoard[4][5][0].status = 'correct';

        setBoard(nextBoard);
        setChallengeSolved(true);
        if (targetHaloMeshRef.current) targetHaloMeshRef.current.visible = false;

        const { x, z } = cellToWorldXZ(4, 3);
        spawnCelebrationConfetti(x, z);
        moveCameraSmoothly({ x: -1.8, y: 2.2, z: 4.4 }, { x: -0.5, y: 0.4, z: -0.5 }, 1000);
        awardPointsToTeam(5, 'Solved DOG → LOG Challenge!', true);
        soundFX.speak('Excellent! DOG becomes LOG! You earned 5 points!', 'challenge_dog_log_success');

        setBannerFeedback({
          type: 'success',
          title: 'EXCELLENT! DOG becomes LOG! (+5 Points)',
          message: 'Notice how L rests physically on top of D, while O and G stay in place!'
        });
      } else {
        // Incorrect challenge letter (P or S): show gentle hint and shake animation without permanent placement
        soundFX.playError();
        soundFX.speak(
          `Not quite! ${chosen} O G is not the word we are looking for. Try another letter!`,
          `challenge_dog_log_hint_${chosen}`
        );
        setBannerFeedback({
          type: 'error',
          title: `"${chosen}OG" — Try another letter!`,
          message: 'Hint: Which letter makes a word for a thick piece of wood from a tree (L-O-G)? Select "L" below!'
        });

        // Shake the D tile briefly in red
        const dTile = st.board[4][3][0];
        if (dTile) {
          const dMesh = tileMeshesMapRef.current.get(dTile.id);
          if (dMesh) {
            activeTileAnimsRef.current.push({
              mesh: dMesh,
              mode: 'SHAKE_REJECT',
              startPos: dMesh.position.clone(),
              endPos: dMesh.position.clone(),
              startTime: performance.now(),
              duration: 450
            });
          }
        }
      }
      return;
    }

    // 2. Free Play Sandbox or Teacher Demo Mode
    if (st.appMode === 'SANDBOX' || st.appMode === 'TEACHER_DEMO') {
      if (st.selectedRackIndex !== null && st.rackTiles[st.selectedRackIndex]) {
        const letterToPlace = st.rackTiles[st.selectedRackIndex];
        const placed = placeTileOnCell(row, col, letterToPlace, 'normal', true);
        if (placed) {
          // Replenish rack slot with a helpful classroom vowel/consonant
          const pool = 'AAEEIIOOUUBCDFGHJKLMNPRSTVWXYZ';
          const replacement = pool[Math.floor(Math.random() * pool.length)];
          setRackTiles(prev => prev.map((l, idx) => (idx === st.selectedRackIndex ? replacement : l)));
        }
      } else {
        setBannerFeedback({
          type: 'info',
          title: `Selected Square ${String.fromCharCode(65 + col)}${row + 1}`,
          message: 'Click a letter tile on the bottom Letter Rack first, then click any board square to place or stack it!'
        });
      }
    }
  }, [cellToWorldXZ, spawnCelebrationConfetti, moveCameraSmoothly, awardPointsToTeam, placeTileOnCell]);

  const runTutorialStepSequence = useCallback((stepNumber, shouldPlayNarration = true) => {
    clearScheduledAnims();
    setIsAnimating(true);

    // Hide step-specific helper meshes by default
    if (directionArrowsGroupRef.current) directionArrowsGroupRef.current.visible = false;
    if (heightRulerMeshRef.current) heightRulerMeshRef.current.visible = false;
    if (targetHaloMeshRef.current) targetHaloMeshRef.current.visible = false;
    autoOrbitRef.current = false;

    const stepInfo = TUTORIAL_STEPS[stepNumber - 1];
    if (shouldPlayNarration) {
      soundFX.speak(stepInfo.narration, stepInfo.audioId);
    }

    const speedMult = stateRef.current.slowMotion ? 1.75 : 1.0;
    const schedule = (fn, delayMs) => {
      const id = setTimeout(fn, delayMs * speedMult);
      stepTimeoutsRef.current.push(id);
    };

    // Helper to construct a static stack immediately (without re-triggering entry arcs for lower tiles)
    const makeStaticTile = (letter, status = 'normal', row = 4, col = 3, stackIdx = 0) => {
      const id = `static_${letter}_${row}_${col}_${stackIdx}_${tileIdCounterRef.current++}`;
      return { id, letter, status };
    };

    if (stepNumber === 1) {
      // STEP 1: WELCOME TO UPWORDS — Gently rotating board + animated vertical stacking demo
      const b = createEmptyBoard();
      setBoard(b);
      moveCameraSmoothly({ x: 0, y: 8.2, z: 9.5 }, { x: 0, y: 0.3, z: 0 }, 900);
      autoOrbitRef.current = true;

      setBannerFeedback({
        type: 'info',
        title: 'STEP 1: WELCOME TO UPWORDS 3D!',
        message: 'Unlike Scrabble, Upwords lets you build UP! Watch the letters stack vertically in the center.'
      });

      // Animate C-A-T and then stack R and B to preview vertical building
      const demoMoves = [
        { r: 4, c: 3, l: 'C', st: 'normal', delay: 400 },
        { r: 4, c: 4, l: 'A', st: 'normal', delay: 850 },
        { r: 4, c: 5, l: 'T', st: 'normal', delay: 1300 },
        { r: 4, c: 3, l: 'R', st: 'highlight', delay: 2100 },
        { r: 4, c: 3, l: 'B', st: 'correct', delay: 2950 }
      ];

      demoMoves.forEach(m => {
        schedule(() => {
          setBoard(prev => {
            const next = cloneBoard(prev);
            next[m.r][m.c].push({
              id: `welcome_${m.l}_${Date.now()}_${Math.random()}`,
              letter: m.l,
              status: m.st,
              fromRackX: (m.c - 4.5) * 1.0,
              fromRackZ: 4.5
            });
            return next;
          });
        }, m.delay);
      });

      schedule(() => setIsAnimating(false), 3400);
    } else if (stepNumber === 2) {
      // STEP 2: LEARN THE BOARD — 10x10 flyover + center highlight + Horizontal & Vertical 3D arrows
      const b = createEmptyBoard();
      setBoard(b);
      if (directionArrowsGroupRef.current) directionArrowsGroupRef.current.visible = true;

      setBannerFeedback({
        type: 'info',
        title: 'STEP 2: THE 10 × 10 UPWORDS BOARD',
        message: 'Words are built Horizontally (Across →) and Vertically (Down ↓) from the golden center area.'
      });

      moveCameraSmoothly({ x: -4.5, y: 11.5, z: 6.5 }, { x: 0, y: 0, z: 0 }, 950);
      schedule(() => {
        moveCameraSmoothly({ x: 0, y: 8.8, z: 8.6 }, { x: -0.5, y: 0.2, z: -0.5 }, 1100);
      }, 1050);

      // Show CAT across and DOG down intersecting
      schedule(() => {
        const next = createEmptyBoard();
        next[4][3].push(makeStaticTile('C', 'highlight', 4, 3, 0));
        next[4][4].push(makeStaticTile('A', 'highlight', 4, 4, 0));
        next[4][5].push(makeStaticTile('T', 'highlight', 4, 5, 0));
        next[5][5].push(makeStaticTile('O', 'normal', 5, 5, 0));
        next[6][5].push(makeStaticTile('P', 'normal', 6, 5, 0));
        setBoard(next);
        setIsAnimating(false);
      }, 1700);
    } else if (stepNumber === 3) {
      // STEP 3: BUILD YOUR FIRST WORD (C -> A -> T landing one after another)
      setBoard(createEmptyBoard());
      moveCameraSmoothly({ x: 0, y: 7.4, z: 8.2 }, { x: -0.5, y: 0.3, z: -0.5 }, 900);

      setBannerFeedback({
        type: 'info',
        title: 'STEP 3: BUILD YOUR FIRST WORD (CAT)',
        message: 'Watch C, A, and T float from the rack onto the center cells one after another!'
      });

      const letters = ['C', 'A', 'T'];
      letters.forEach((l, idx) => {
        schedule(() => {
          setBoard(prev => {
            const next = cloneBoard(prev);
            next[4][3 + idx].push({
              id: `step3_${l}_${Date.now()}`,
              letter: l,
              status: 'normal',
              fromRackX: (idx - 1) * 1.5,
              fromRackZ: 5.2
            });
            return next;
          });
        }, 450 + idx * 750);
      });

      // Highlight completed word CAT in green and celebrate
      schedule(() => {
        setBoard(prev => {
          const next = cloneBoard(prev);
          [3, 4, 5].forEach(c => {
            if (next[4][c][0]) next[4][c][0].status = 'correct';
          });
          return next;
        });
        spawnCelebrationConfetti(-0.5, -0.5);
        soundFX.playSuccess();
        setBannerFeedback({
          type: 'success',
          title: 'Look! We made the word CAT! (/kæt/)',
          message: 'CAT: A small furry domestic animal that purrs. Click "Replay Animation" or "Next Step"!'
        });
        setIsAnimating(false);
      }, 2850);
    } else if (stepNumber === 4) {
      // STEP 4: THE MAGIC OF STACKING (CAT -> RAT with physical C underneath & automatic side-angle camera!)
      const initial = createEmptyBoard();
      const cTile = makeStaticTile('C', 'normal', 4, 3, 0);
      const aTile = makeStaticTile('A', 'normal', 4, 4, 0);
      const tTile = makeStaticTile('T', 'normal', 4, 5, 0);
      initial[4][3].push(cTile);
      initial[4][4].push(aTile);
      initial[4][5].push(tTile);
      setBoard(initial);

      // Show glowing yellow halo above C at (4, 3)
      const cPos = cellToWorldXZ(4, 3);
      if (targetHaloMeshRef.current) {
        targetHaloMeshRef.current.position.set(cPos.x, stackIndexToWorldY(0) + 0.16, cPos.z);
        targetHaloMeshRef.current.visible = true;
      }

      moveCameraSmoothly({ x: 0, y: 6.8, z: 7.8 }, { x: -0.5, y: 0.4, z: -0.5 }, 800);
      setBannerFeedback({
        type: 'info',
        title: 'STEP 4: THE MAGIC OF STACKING (CAT → RAT)',
        message: 'Watch the glowing yellow target above C as the new tile R stacks physically on top of C!'
      });

      // Stack R on top of C
      schedule(() => {
        setBoard(prev => {
          const next = cloneBoard(prev);
          next[4][3].push({
            id: `step4_R_${Date.now()}`,
            letter: 'R',
            status: 'highlight',
            fromRackX: -2.2,
            fromRackZ: 4.8
          });
          return next;
        });
        if (targetHaloMeshRef.current) {
          targetHaloMeshRef.current.position.set(cPos.x, stackIndexToWorldY(1) + 0.16, cPos.z);
        }
      }, 1100);

      // Rotate camera to Side Angle to prove C is still physically underneath R!
      schedule(() => {
        setActiveCameraPreset('SIDE');
        moveCameraSmoothly({ x: -1.6, y: 1.25, z: 4.6 }, { x: -0.5, y: 0.45, z: -0.5 }, 1150);
        setBannerFeedback({
          type: 'success',
          title: 'SIDE VIEW PROOF: C is still underneath R!',
          message: 'Look at the two layers: C is on Level 1 (bottom) and R is on Level 2 (top). Top letters read: RAT!'
        });
      }, 2400);

      // Return smoothly to isometric view
      schedule(() => {
        setActiveCameraPreset('ISOMETRIC');
        moveCameraSmoothly({ x: -0.5, y: 6.2, z: 7.2 }, { x: -0.5, y: 0.45, z: -0.5 }, 1100);
        setIsAnimating(false);
      }, 4600);
    } else if (stepNumber === 5) {
      // STEP 5: MAKE THE WORD TOWER TALLER (RAT -> BAT -> HAT with vertical height indicator)
      const initial = createEmptyBoard();
      initial[4][3].push(makeStaticTile('C', 'normal', 4, 3, 0));
      initial[4][3].push(makeStaticTile('R', 'normal', 4, 3, 1));
      initial[4][4].push(makeStaticTile('A', 'normal', 4, 4, 0));
      initial[4][5].push(makeStaticTile('T', 'normal', 4, 5, 0));
      setBoard(initial);

      if (heightRulerMeshRef.current) heightRulerMeshRef.current.visible = true;
      moveCameraSmoothly({ x: -2.6, y: 3.2, z: 5.8 }, { x: -0.8, y: 0.65, z: -0.5 }, 950);

      setBannerFeedback({
        type: 'info',
        title: 'STEP 5: GROWING THE WORD TOWER (CAT → RAT → BAT → HAT)',
        message: 'Watch B stack on R to form BAT (Height 3), then H stack on B to form HAT (Height 4)!'
      });

      // Introduce tile B -> BAT (Level 3)
      schedule(() => {
        setBoard(prev => {
          const next = cloneBoard(prev);
          next[4][3].push({
            id: `step5_B_${Date.now()}`,
            letter: 'B',
            status: 'highlight',
            fromRackX: -2.5,
            fromRackZ: 4.5
          });
          return next;
        });
        setBannerFeedback({
          type: 'info',
          title: 'Tower Height = 3 Tiles: B on top makes BAT!',
          message: 'Stack at first square from bottom to top: C → R → B.'
        });
      }, 1100);

      // Introduce tile H -> HAT (Level 4)
      schedule(() => {
        setBoard(prev => {
          const next = cloneBoard(prev);
          if (next[4][3][2]) next[4][3][2].status = 'normal';
          next[4][3].push({
            id: `step5_H_${Date.now()}`,
            letter: 'H',
            status: 'correct',
            fromRackX: -2.5,
            fromRackZ: 4.5
          });
          return next;
        });
      }, 2700);

      // Rotate camera to low side angle to showcase the 4-tile tower beside the height indicator
      schedule(() => {
        setActiveCameraPreset('SIDE');
        moveCameraSmoothly({ x: -1.8, y: 1.5, z: 4.4 }, { x: -0.9, y: 0.65, z: -0.5 }, 1100);
        spawnCelebrationConfetti(-1.5, -0.5);
        setBannerFeedback({
          type: 'success',
          title: '4-TILE WORD TOWER COMPLETE: CAT → RAT → BAT → HAT!',
          message: 'Every new letter makes our tower taller! Remember: stacks can hold a maximum of 5 tiles.'
        });
        setIsAnimating(false);
      }, 3700);
    } else if (stepNumber === 6) {
      // STEP 6: TRY IT YOURSELF (Interactive DOG -> LOG Challenge)
      setChallengeSolved(false);
      setSelectedChallengeLetter('L');

      const initial = createEmptyBoard();
      initial[4][3].push(makeStaticTile('D', 'highlight', 4, 3, 0));
      initial[4][4].push(makeStaticTile('O', 'normal', 4, 4, 0));
      initial[4][5].push(makeStaticTile('G', 'normal', 4, 5, 0));
      setBoard(initial);

      const dPos = cellToWorldXZ(4, 3);
      if (targetHaloMeshRef.current) {
        targetHaloMeshRef.current.position.set(dPos.x, stackIndexToWorldY(0) + 0.16, dPos.z);
        targetHaloMeshRef.current.visible = true;
      }

      moveCameraSmoothly({ x: 0, y: 6.8, z: 7.4 }, { x: -0.5, y: 0.4, z: -0.5 }, 950);
      setBannerFeedback({
        type: 'info',
        title: 'INTERACTIVE CHALLENGE: Turn DOG into LOG!',
        message: '1) Click letter "L" below. 2) Click the glowing "D" tile on the 3D board to stack L on top of D!'
      });
      setIsAnimating(false);
    } else if (stepNumber === 7) {
      // STEP 7: READY TO PLAY! Show completed 5-tile tower & confetti celebration
      const finalBoard = createEmptyBoard();
      ['C', 'R', 'B', 'H', 'M'].forEach((l, idx) => {
        finalBoard[4][3].push(makeStaticTile(l, idx === 4 ? 'correct' : 'normal', 4, 3, idx));
      });
      finalBoard[4][4].push(makeStaticTile('A', 'correct', 4, 4, 0));
      finalBoard[4][5].push(makeStaticTile('T', 'correct', 4, 5, 0));
      setBoard(finalBoard);

      if (heightRulerMeshRef.current) heightRulerMeshRef.current.visible = true;
      moveCameraSmoothly({ x: -2.2, y: 2.6, z: 5.4 }, { x: -0.6, y: 0.65, z: -0.5 }, 1000);
      spawnCelebrationConfetti(-0.5, -0.5);
      soundFX.playSuccess();

      setBannerFeedback({
        type: 'success',
        title: 'YOU ARE READY FOR THE UPWORDS CHALLENGE!',
        message: 'Choose Free Play Sandbox or Teacher Demo Mode to build your own 3D word towers!'
      });
      setIsAnimating(false);
    }
  }, [clearScheduledAnims, moveCameraSmoothly, cellToWorldXZ, stackIndexToWorldY, spawnCelebrationConfetti]);

  // Run tutorial sequence whenever step changes in TUTORIAL mode.
  // On initial page load/refresh, show the 3D scene immediately without calling TTS until the user clicks Next or Replay.
  useEffect(() => {
    if (appMode === 'TUTORIAL') {
      runTutorialStepSequence(tutorialStep, hasUserInteractedWithStepRef.current);
    } else {
      clearScheduledAnims();
      autoOrbitRef.current = false;
      if (directionArrowsGroupRef.current) directionArrowsGroupRef.current.visible = false;
      if (heightRulerMeshRef.current) heightRulerMeshRef.current.visible = false;
      if (targetHaloMeshRef.current) targetHaloMeshRef.current.visible = false;
      setIsAnimating(false);
    }
  }, [appMode, tutorialStep, runTutorialStepSequence, clearScheduledAnims]);

  const goToTutorialStep = useCallback((nextStep) => {
    hasUserInteractedWithStepRef.current = true;
    setTutorialStep(nextStep);
  }, []);

  const handleUndo = useCallback(() => {
    if (boardHistory.length === 0) {
      setBannerFeedback({
        type: 'warning',
        title: 'Nothing to Undo',
        message: 'Place or stack a letter tile on the board first!'
      });
      return;
    }
    const previous = boardHistory[boardHistory.length - 1];
    setBoardHistory(prev => prev.slice(0, -1));
    setBoard(previous);
    soundFX.playPickup();
    setBannerFeedback({
      type: 'info',
      title: 'Move Undone',
      message: 'Restored the board to its previous state.'
    });
  }, [boardHistory]);

  const handleResetBoard = useCallback(() => {
    if (appMode === 'TUTORIAL') {
      hasUserInteractedWithStepRef.current = true;
      runTutorialStepSequence(tutorialStep, true);
      return;
    }
    setBoardHistory(prev => [...prev, cloneBoard(board)]);
    setBoard(createEmptyBoard());
    soundFX.playPickup();
    setBannerFeedback({
      type: 'info',
      title: 'Board Cleared',
      message: 'All 100 squares are now empty and ready for a new word tower!'
    });
  }, [appMode, tutorialStep, runTutorialStepSequence, board]);

  const handleTeacherPlaceStartingWord = useCallback((wordToPlace) => {
    const clean = (wordToPlace || '').trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8);
    if (!clean) return;

    const next = createEmptyBoard();
    const startCol = Math.max(0, Math.floor((10 - clean.length) / 2));
    for (let i = 0; i < clean.length; i++) {
      next[4][startCol + i].push({
        id: `teacher_${clean[i]}_${Date.now()}_${i}`,
        letter: clean[i],
        status: 'highlight',
        fromRackX: (startCol + i - 4.5) * 1.0,
        fromRackZ: 4.8
      });
    }
    setBoardHistory(prev => [...prev, cloneBoard(board)]);
    setBoard(next);
    setSelectedCell({ row: 4, col: startCol });
    moveCameraSmoothly({ x: 0, y: 6.8, z: 7.5 }, { x: 0, y: 0.4, z: -0.5 }, 950);
    soundFX.speak(`Placed starting word ${clean} on the center row.`, `teacher_word_${clean}`);
    setBannerFeedback({
      type: 'success',
      title: `Teacher Demo: Placed "${clean}"`,
      message: `Click any square to select it, or stack new letters on "${clean[0]}" at Square ${String.fromCharCode(65 + startCol)}5!`
    });
  }, [board, moveCameraSmoothly]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const detectedWords = useMemo(() => detectWordsOnBoard(board), [board]);
  const selectedCellStack = useMemo(() => {
    if (!selectedCell) return [];
    return board[selectedCell.row]?.[selectedCell.col] || [];
  }, [board, selectedCell]);

  // First letter stack at (4,3) for clear tutorial visualization
  const tutorialPrimaryStack = useMemo(() => board[4]?.[3] || [], [board]);
  const currentStepData = TUTORIAL_STEPS[tutorialStep - 1];

  if (!webglSupported) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-lg bg-slate-800 border-2 border-rose-500 rounded-2xl p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-black text-rose-400 mb-3">WebGL 3D Acceleration Required</h1>
          <p className="text-slate-200 mb-4">
            Upwords 3D – Word Tower Academy uses real-time Three.js WebGL 3D graphics. Please enable hardware acceleration in your browser settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-200 via-sky-100 to-pink-200 text-white select-none font-sans">
      {/* FULL-SCREEN INTERACTIVE 3D BACKGROUND CANVAS */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* TOP FLOATING HEADER OVERLAY CARD */}
      <header className="absolute top-3 left-3 right-3 h-16 bg-gradient-to-r from-violet-500/90 via-fuchsia-500/90 to-pink-500/90 backdrop-blur-xl border-2 border-white/40 rounded-2xl px-4 flex items-center justify-between gap-3 z-30 shadow-2xl shadow-fuchsia-500/30 pointer-events-auto">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20 font-black text-slate-950 text-xl border border-amber-200">
            U3D
          </div>
          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-2">
              UPWORDS 3D
              <span className="hidden sm:inline-block text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Word Tower Academy
              </span>
            </h1>
            <p className="text-xs text-slate-300 hidden xl:block">
              Interactive 3D English Club Board Game Tutorial & Classroom Sandbox
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-white/20 p-1 rounded-xl border border-white/40">
          <button
            onClick={() => setAppMode('TUTORIAL')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
              appMode === 'TUTORIAL'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            1. Guided Tutorial ({tutorialStep}/7)
          </button>
          <button
            onClick={() => {
              setAppMode('SANDBOX');
              if (detectWordsOnBoard(board).length === 0) {
                handleTeacherPlaceStartingWord('CAT');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
              appMode === 'SANDBOX'
                ? 'bg-emerald-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            2. Free Play Sandbox
          </button>
          <button
            onClick={() => setAppMode('TEACHER_DEMO')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
              appMode === 'TEACHER_DEMO'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            3. Teacher Demo
          </button>
        </div>

        {/* Narration, Fullscreen & Help Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle Narration On/Off"
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              !soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-slate-400'
                : ttsStatus === 'error'
                ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
            }`}
          >
            <span>
              {!soundEnabled
                ? '🔇 Narration Off'
                : ttsStatus === 'error'
                ? '⚠️ Narration unavailable'
                : ttsStatus === 'loading'
                ? '⏳ Loading Voice...'
                : ttsStatus === 'speaking'
                ? '🎙️ Speaking...'
                : '🔊 Narration On'}
            </span>
          </button>

          {appMode === 'TUTORIAL' && (
            <button
              onClick={() => {
                hasUserInteractedWithStepRef.current = true;
                soundFX.speak(currentStepData.narration, currentStepData.audioId);
              }}
              disabled={!soundEnabled || ttsStatus === 'loading'}
              title="Replay saved AI voice narration for this step"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-sky-500/20 hover:bg-sky-500/30 disabled:opacity-40 border border-sky-400/40 text-sky-200 transition-all flex items-center gap-1.5"
            >
              <span>🔁 Replay Voice</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            title="Fullscreen Presentation Mode for Smart TV"
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-all hidden sm:flex items-center gap-1.5"
          >
            <span>⛶ Fullscreen</span>
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-black text-sm flex items-center justify-center shadow-md border border-indigo-400"
            title="How to Play Upwords 3D"
          >
            ?
          </button>
        </div>
      </header>

      {/* FLOATING CENTER TOP STATUS BANNER OVERLAY CARD */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-xl pointer-events-none">
        <div
          className={`px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all flex items-center justify-between gap-3 ${
            bannerFeedback.type === 'success'
              ? 'bg-emerald-950/75 border-emerald-400/80 text-emerald-100'
              : bannerFeedback.type === 'error'
              ? 'bg-rose-950/75 border-rose-400/80 text-rose-100'
              : bannerFeedback.type === 'warning'
              ? 'bg-amber-950/75 border-amber-400/80 text-amber-100'
              : 'bg-slate-900/75 border-sky-400/60 text-slate-100'
          }`}
        >
          <div>
            <div className="text-xs sm:text-sm font-black tracking-wide">
              {bannerFeedback.title}
            </div>
            <div className="text-xs opacity-90">{bannerFeedback.message}</div>
          </div>
          <div className="text-xs font-black px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 shrink-0 hidden sm:block">
            View: {activeCameraPreset}
          </div>
        </div>
      </div>

      {/* FLOATING LEFT OVERLAY CARD: TUTORIAL / SANDBOX / TEACHER CONTROLS */}
      {leftPanelOpen ? (
        <aside className="absolute left-3 top-24 bottom-24 w-80 sm:w-96 bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl flex flex-col justify-between z-20 overflow-y-auto p-4 shadow-2xl pointer-events-auto">
          {appMode === 'TUTORIAL' && (
            <div className="space-y-3.5">
              {/* Step Progress Pills */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-400/30">
                  Tutorial Step {tutorialStep} of 7
                </span>
                <button
                  onClick={() => setLeftPanelOpen(false)}
                  className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700"
                >
                  ◀ Minimize Card
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {TUTORIAL_STEPS.map(s => (
                  <button
                    key={s.step}
                    onClick={() => goToTutorialStep(s.step)}
                    className={`h-2.5 rounded-full transition-all ${
                      s.step === tutorialStep
                        ? 'bg-amber-400 scale-110'
                        : s.step < tutorialStep
                        ? 'bg-emerald-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Jump to Step ${s.step}: ${s.title}`}
                  />
                ))}
              </div>

              {/* Step Heading & Explanation Card */}
              <div className="bg-slate-800/75 border border-slate-700/80 rounded-2xl p-3.5 space-y-2 shadow-inner">
                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {currentStepData.title}
                </h2>
                <p className="text-xs font-bold text-sky-300">
                  {currentStepData.subtitle}
                </p>
                {showInstructions && (
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
                    {currentStepData.explanation}
                  </p>
                )}
                <div className="mt-2 p-2 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 font-extrabold text-xs text-center">
                  ✨ {currentStepData.highlightBanner}
                </div>
              </div>

              {/* Live Word Transformation & Stack Visualizer Card */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    Word Transformation
                  </span>
                  <button
                    onClick={() => {
                      hasUserInteractedWithStepRef.current = true;
                      soundFX.speak(currentStepData.narration, currentStepData.audioId);
                    }}
                    disabled={!soundEnabled || ttsStatus === 'loading'}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                      ttsStatus === 'error'
                        ? 'bg-rose-500/20 text-rose-200 border-rose-400/50'
                        : ttsStatus === 'speaking'
                        ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50 animate-pulse'
                        : ttsStatus === 'loading'
                        ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                        : 'text-sky-300 hover:text-sky-200 bg-sky-500/15 border-sky-400/30 disabled:opacity-40'
                    }`}
                  >
                    {ttsStatus === 'error'
                      ? '⚠️ Narration unavailable'
                      : ttsStatus === 'loading'
                      ? '⏳ Loading Voice...'
                      : ttsStatus === 'speaking'
                      ? '🎙️ Speaking...'
                      : '🔁 Replay Voice'}
                  </button>
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-wider text-center py-2 rounded-xl bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-indigo-950/90 border border-indigo-500/30 text-emerald-300">
                  {tutorialStep === 6 && challengeSolved ? 'DOG → LOG ✓' : currentStepData.wordDisplay}
                </div>

                {/* Physical First Cell Stack Visualizer (Bottom -> Top) */}
                {tutorialPrimaryStack.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-bold">First Square Physical Stack:</span>
                      <span className="font-black text-amber-300">
                        Height: {tutorialPrimaryStack.length} / 5 Max
                      </span>
                    </div>
                    <div className="flex flex-col-reverse gap-1 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                      {tutorialPrimaryStack.map((t, idx) => {
                        const isTop = idx === tutorialPrimaryStack.length - 1;
                        return (
                          <div
                            key={t.id}
                            className={`flex items-center justify-between px-3 py-1 rounded-lg text-xs font-black transition-all ${
                              isTop
                                ? 'bg-emerald-500 text-slate-950 shadow-md'
                                : 'bg-slate-800/90 text-slate-300 border border-slate-700'
                            }`}
                          >
                            <span>
                              Level {idx + 1}: Tile &ldquo;{t.letter}&rdquo;
                            </span>
                            <span>
                              {isTop ? '👁️ VISIBLE TOP' : '⬇️ Hidden Underneath'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 1 Big Start Button */}
              {tutorialStep === 1 && (
                <button
                  onClick={() => goToTutorialStep(2)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
                >
                  🚀 START TUTORIAL (STEP 2 →)
                </button>
              )}

              {/* Step 6 Interactive Challenge Selector */}
              {tutorialStep === 6 && (
                <div className="bg-indigo-950/75 border-2 border-amber-400/70 rounded-2xl p-3 space-y-2.5">
                  <div className="text-xs font-black uppercase text-amber-300">
                    Pupil Practice: Click a Letter, Then Click &ldquo;D&rdquo; on the Board!
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {challengeChoices.map(letter => (
                      <button
                        key={letter}
                        onClick={() => {
                          soundFX.playPickup();
                          setSelectedChallengeLetter(letter);
                        }}
                        className={`py-2.5 rounded-xl font-black text-2xl border-2 transition-all ${
                          selectedChallengeLetter === letter
                            ? 'bg-amber-300 text-slate-950 border-cyan-300 ring-4 ring-cyan-400/50 scale-105'
                            : 'bg-amber-50/90 text-slate-900 border-amber-200 hover:bg-white'
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBoardCellInteraction(4, 3)}
                      className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md"
                    >
                      ✨ Stack &ldquo;{selectedChallengeLetter}&rdquo; on Top of &ldquo;D&rdquo;
                    </button>
                    <button
                      onClick={() => {
                        hasUserInteractedWithStepRef.current = true;
                        runTutorialStepSequence(6, true);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Step 7 Ready To Play Action Buttons */}
              {tutorialStep === 7 && (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => goToTutorialStep(1)}
                    className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md"
                  >
                    🔄 1. RESTART TUTORIAL
                  </button>
                  <button
                    onClick={() => {
                      setAppMode('SANDBOX');
                      handleTeacherPlaceStartingWord('CAT');
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-md"
                  >
                    🎮 2. FREE PLAY SANDBOX
                  </button>
                  <button
                    onClick={() => setAppMode('TEACHER_DEMO')}
                    className="w-full py-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs shadow-md"
                  >
                    🎓 3. TEACHER DEMO MODE
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SANDBOX MODE LEFT INSTRUCTIONS */}
          {appMode === 'SANDBOX' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                  Free Play Sandbox
                </span>
                <button
                  onClick={() => setLeftPanelOpen(false)}
                  className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700"
                >
                  ◀ Minimize
                </button>
              </div>

              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-4 space-y-2">
                <h2 className="text-lg font-black text-white">Build & Stack Freely!</h2>
                <p className="text-xs text-slate-200 leading-relaxed">
                  1. Click any letter on the <strong>Bottom Letter Rack</strong>.<br />
                  2. Click any square on the <strong>10×10 3D Board</strong> to place or stack it.<br />
                  3. Only the <strong>topmost letter</strong> of each stack counts toward horizontal or vertical words!
                </p>
              </div>

              {/* Rule Validation Toggles */}
              <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="text-xs font-black uppercase text-slate-400">
                  Classroom Rule Settings
                </div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-200 cursor-pointer">
                  <span>Strict English Dictionary Validation</span>
                  <input
                    type="checkbox"
                    checked={strictValidation}
                    onChange={e => setStrictValidation(e.target.checked)}
                    className="w-4 h-4 accent-emerald-400 rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-bold text-slate-200 cursor-pointer">
                  <span>Official Upwords Scoring Mode</span>
                  <input
                    type="checkbox"
                    checked={officialRulesMode}
                    onChange={e => setOfficialRulesMode(e.target.checked)}
                    className="w-4 h-4 accent-sky-400 rounded"
                  />
                </label>
              </div>

              {/* Quick Preset Word Starters for Pupils */}
              <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-3.5 space-y-2">
                <div className="text-xs font-black uppercase text-sky-300">
                  Quick Word Starters
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['CAT', 'DOG', 'SUN', 'TOP', 'BUG', 'STAR'].map(w => (
                    <button
                      key={w}
                      onClick={() => handleTeacherPlaceStartingWord(w)}
                      className="py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-600 text-xs font-black border border-slate-600 transition-all"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEACHER DEMO MODE CONTROL PANEL */}
          {appMode === 'TEACHER_DEMO' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-sky-400 bg-sky-500/15 px-2.5 py-1 rounded-lg border border-sky-400/30">
                  Teacher Demo Controls
                </span>
                <button
                  onClick={() => setLeftPanelOpen(false)}
                  className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700"
                >
                  ◀ Minimize
                </button>
              </div>

              {/* Place Starting Word */}
              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-3.5 space-y-2.5">
                <label className="text-xs font-black uppercase text-amber-300 block">
                  1. Place Starting Word on Center Row
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={8}
                    value={teacherWordInput}
                    onChange={e => setTeacherWordInput(e.target.value.toUpperCase())}
                    placeholder="e.g. CAT"
                    className="flex-1 bg-slate-950/90 border border-slate-600 rounded-xl px-3 py-2 text-sm font-black uppercase text-white"
                  />
                  <button
                    onClick={() => handleTeacherPlaceStartingWord(teacherWordInput)}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs"
                  >
                    Place Word
                  </button>
                </div>
              </div>

              {/* Stack Single Letter on Selected Square */}
              <div className="bg-slate-800/75 border border-slate-700 rounded-2xl p-3.5 space-y-2.5">
                <label className="text-xs font-black uppercase text-emerald-300 block">
                  2. Stack Letter on Selected Square ({String.fromCharCode(65 + selectedCell.col)}{selectedCell.row + 1})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={1}
                    value={teacherSingleLetter}
                    onChange={e => setTeacherSingleLetter(e.target.value.toUpperCase())}
                    className="w-16 text-center bg-slate-950/90 border border-slate-600 rounded-xl px-3 py-2 text-lg font-black uppercase text-amber-300"
                  />
                  <button
                    onClick={() => {
                      if (teacherSingleLetter) {
                        placeTileOnCell(selectedCell.row, selectedCell.col, teacherSingleLetter, 'highlight', true);
                      }
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs"
                  >
                    + Stack &ldquo;{teacherSingleLetter || '?'}&rdquo; on Square
                  </button>
                </div>
              </div>

              {/* Classroom Presentation Toggles */}
              <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="text-xs font-black uppercase text-slate-400">
                  Classroom Presentation Tools
                </div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-200 cursor-pointer">
                  <span>🐢 Slow Motion Stacking Mode</span>
                  <input
                    type="checkbox"
                    checked={slowMotion}
                    onChange={e => setSlowMotion(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-bold text-slate-200 cursor-pointer">
                  <span>🔦 Spotlight Highlighted Words</span>
                  <input
                    type="checkbox"
                    checked={spotlightMode}
                    onChange={e => setSpotlightMode(e.target.checked)}
                    className="w-4 h-4 accent-sky-400 rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-bold text-slate-200 cursor-pointer">
                  <span>🗂️ Show Bottom Letter Rack</span>
                  <input
                    type="checkbox"
                    checked={showRack}
                    onChange={e => setShowRack(e.target.checked)}
                    className="w-4 h-4 accent-emerald-400 rounded"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-bold text-slate-200 cursor-pointer">
                  <span>📖 Show Instructional Text</span>
                  <input
                    type="checkbox"
                    checked={showInstructions}
                    onChange={e => setShowInstructions(e.target.checked)}
                    className="w-4 h-4 accent-indigo-400 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Tutorial Navigation Footer Buttons */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            {appMode === 'TUTORIAL' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToTutorialStep(Math.max(1, tutorialStep - 1))}
                  disabled={tutorialStep === 1}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 disabled:opacity-40 text-xs font-black border border-slate-600 transition-all"
                >
                  ◀ Previous
                </button>
                <button
                  onClick={() => {
                    hasUserInteractedWithStepRef.current = true;
                    runTutorialStepSequence(tutorialStep, true);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black border border-indigo-400 transition-all"
                  title="Replay 3D Animation & Voice"
                >
                  ↻ Replay
                </button>
                <button
                  onClick={() => goToTutorialStep(Math.min(7, tutorialStep + 1))}
                  disabled={tutorialStep === 7}
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 text-xs font-black shadow-md transition-all"
                >
                  Next Step ▶
                </button>
              </div>
            )}
          </div>
        </aside>
      ) : (
        <button
          onClick={() => setLeftPanelOpen(true)}
          className="absolute left-3 top-24 z-20 px-4 py-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-xl border border-slate-600 text-xs font-black shadow-2xl pointer-events-auto"
        >
          ▶ Open Tutorial Card
        </button>
      )}

      {/* FLOATING RIGHT OVERLAY CARD: 5-TEAM CLASSROOM SCOREBOARD & STACK INSPECTOR */}
      {rightPanelOpen ? (
        <aside className="absolute right-3 top-24 bottom-24 w-72 sm:w-80 bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl flex flex-col justify-between z-20 overflow-y-auto p-4 shadow-2xl pointer-events-auto">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                🏆 Classroom Scoreboard
              </span>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700"
              >
                Minimize ▶
              </button>
            </div>

            {/* 5 Teams List */}
            <div className="space-y-2">
              {teams.map(team => {
                const isActive = team.id === activeTeamId;
                return (
                  <div
                    key={team.id}
                    onClick={() => setActiveTeamId(team.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? `bg-slate-800/90 ${team.border} ring-2 ring-white/20`
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full ${team.color}`} />
                      <div>
                        <div className="text-xs font-black text-white">{team.name}</div>
                        <div className="text-[10px] text-slate-400">
                          Transformations: {team.transformations}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setTeams(prev =>
                            prev.map(t =>
                              t.id === team.id ? { ...t, score: Math.max(0, t.score - 5) } : t
                            )
                          );
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-rose-600 text-xs font-black"
                        title="Deduct 5 points"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-base font-black text-amber-300">
                        {team.score}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setTeams(prev =>
                            prev.map(t => (t.id === team.id ? { ...t, score: t.score + 5 } : t))
                          );
                          soundFX.playSuccess();
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-emerald-500 text-xs font-black"
                        title="Award 5 points"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Classroom Bonus Award Buttons */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 space-y-2">
              <div className="text-[11px] font-black uppercase text-slate-300">
                Quick Award to Active Team
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => awardPointsToTeam(5, 'Correct Word', false)}
                  className="py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold"
                >
                  +5 Correct Word
                </button>
                <button
                  onClick={() => awardPointsToTeam(5, 'Word Transformation', true)}
                  className="py-1.5 px-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-bold"
                >
                  +5 Stack Change
                </button>
                <button
                  onClick={() => awardPointsToTeam(3, 'Spelling + Meaning Bonus', false)}
                  className="py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold col-span-2"
                >
                  +3 Spelling & Meaning Bonus
                </button>
              </div>
              <button
                onClick={() => setTeams(defaultTeams)}
                className="w-full py-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs font-bold border border-slate-700"
              >
                Reset All Team Scores
              </button>
            </div>

            {/* Selected Cell 3D Stack Inspector */}
            <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-sky-300">
                  Square {String.fromCharCode(65 + selectedCell.col)}{selectedCell.row + 1} Inspector
                </span>
                <span className="text-xs font-bold text-amber-300">
                  {selectedCellStack.length} / 5 Tiles
                </span>
              </div>
              {selectedCellStack.length === 0 ? (
                <p className="text-xs text-slate-400 py-1.5 text-center">
                  Empty square. Click a rack letter then click here to place a tile!
                </p>
              ) : (
                <div className="flex flex-col-reverse gap-1">
                  {selectedCellStack.map((tile, i) => (
                    <div
                      key={tile.id}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black flex justify-between ${
                        i === selectedCellStack.length - 1
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>
                        Level {i + 1}: &ldquo;{tile.letter}&rdquo;
                      </span>
                      <span>{i === selectedCellStack.length - 1 ? 'TOP VISIBLE' : 'Underneath'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detected Visible Words List */}
            <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="text-xs font-black uppercase text-slate-400">
                Visible Top-Letter Words ({detectedWords.length})
              </div>
              {detectedWords.length === 0 ? (
                <p className="text-xs text-slate-500">Place 2+ adjacent letters to form a word.</p>
              ) : (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {detectedWords.map((w, idx) => (
                    <div
                      key={`${w.word}_${idx}`}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between ${
                        w.isValid
                          ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-200'
                          : 'bg-rose-500/15 border border-rose-400/40 text-rose-200'
                      }`}
                    >
                      <span>
                        <strong>{w.word}</strong> ({w.direction})
                      </span>
                      <span className="text-[11px]">
                        {officialRulesMode ? `${w.officialScore} pts` : w.isValid ? '✓ Valid' : '✗ Unknown'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      ) : (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="absolute right-3 top-24 z-20 px-4 py-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-xl border border-slate-600 text-xs font-black shadow-2xl pointer-events-auto"
        >
          🏆 Open Scoreboard ◀
        </button>
      )}

      {/* FLOATING BOTTOM DOCK OVERLAY CARD: 7-TILE LETTER RACK + CAMERA VIEW PRESETS + UNDO/RESET */}
      <footer className="absolute bottom-3 left-3 right-3 h-20 bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl px-4 flex items-center justify-between gap-4 z-30 shadow-2xl pointer-events-auto">
        {/* Left: Undo, Reset & Slow-Mo Speed Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={boardHistory.length === 0}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 disabled:opacity-40 border border-slate-600 text-xs sm:text-sm font-black transition-all"
            title="Undo previous tile placement"
          >
            ↩ Undo
          </button>
          <button
            onClick={handleResetBoard}
            className="px-3.5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-400/40 text-rose-200 text-xs sm:text-sm font-black transition-all"
            title="Reset Board"
          >
            🗑️ Reset
          </button>
          <button
            onClick={() => setSlowMotion(!slowMotion)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-black hidden lg:block transition-all ${
              slowMotion
                ? 'bg-amber-400 text-slate-950 border-amber-200'
                : 'bg-slate-800/90 text-slate-300 border-slate-600'
            }`}
          >
            {slowMotion ? '🐢 Slow-Mo ON' : '⚡ Normal Speed'}
          </button>
        </div>

        {/* Center: 7-Tile Interactive Letter Rack */}
        {showRack && (
          <div className="flex items-center gap-1.5 sm:gap-2.5 bg-gradient-to-b from-amber-900/70 to-stone-900/90 px-4 py-1.5 rounded-2xl border-2 border-amber-700/70 shadow-inner">
            <span className="text-[11px] font-black uppercase text-amber-300 mr-1 hidden xl:inline">
              Tile Rack:
            </span>
            {rackTiles.map((letter, idx) => {
              const isSelected = selectedRackIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    soundFX.playPickup();
                    setSelectedRackIndex(isSelected ? null : idx);
                    if (appMode === 'TUTORIAL' && tutorialStep !== 6) {
                      setBannerFeedback({
                        type: 'info',
                        title: `Selected Rack Tile "${letter}"`,
                        message: 'Switch to "2. Free Play Sandbox" at the top to place rack tiles freely anywhere on the board!'
                      });
                    }
                  }}
                  className={`w-10 h-11 sm:w-11 sm:h-12 rounded-xl font-black text-lg sm:text-xl transition-all flex flex-col items-center justify-center relative border-b-4 ${
                    isSelected
                      ? 'bg-amber-200 text-slate-950 border-cyan-400 ring-4 ring-cyan-400 -translate-y-2 shadow-xl'
                      : 'bg-[#fcf5e5] hover:bg-white text-slate-900 border-[#c8b79a] hover:-translate-y-1 shadow-md'
                  }`}
                >
                  <span>{letter}</span>
                  <span className="text-[9px] font-bold text-slate-500 absolute bottom-0.5 right-1">
                    1
                  </span>
                </button>
              );
            })}
            {selectedRackIndex !== null && (
              <button
                onClick={() => setSelectedRackIndex(null)}
                className="ml-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-600"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {/* Right: Dedicated 3D Camera View Preset Buttons (Including Mandatory Side View!) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-slate-300 hidden xl:inline mr-1">Camera:</span>
          <button
            onClick={() => applyCameraView('ISOMETRIC')}
            className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${
              activeCameraPreset === 'ISOMETRIC'
                ? 'bg-sky-400 text-slate-950 border-sky-200 shadow-md'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
          >
            📐 Isometric
          </button>
          <button
            onClick={() => applyCameraView('SIDE')}
            className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${
              activeCameraPreset === 'SIDE'
                ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-md ring-2 ring-amber-300/50'
                : 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-amber-500/40'
            }`}
            title="Inspect physical stack height from the side!"
          >
            👀 Side View (Stacks)
          </button>
          <button
            onClick={() => applyCameraView('TOP')}
            className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all hidden sm:block ${
              activeCameraPreset === 'TOP'
                ? 'bg-sky-400 text-slate-950 border-sky-200 shadow-md'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
          >
            ⬇️ Top View
          </button>
          <button
            onClick={() => applyCameraView('RESET')}
            className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-black hidden md:block"
          >
            🎯 Reset Cam
          </button>
        </div>
      </footer>

      {/* KID-FRIENDLY INTERACTIVE RULES MODAL */}
      {showHelpModal && (
        <RulesModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}