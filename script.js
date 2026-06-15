const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const sectionTriggers = document.querySelectorAll("[data-show-section]");
const toggleSections = document.querySelectorAll("#watch-categories, #perfume-categories, #women-perfumes, #men-perfumes");
const musicToggle = document.querySelector("[data-music-toggle]");
let audioContext;
let musicTimer;
let isMusicPlaying = false;

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

const playPianoNote = (frequency, startTime, duration, volume = 0.035) => {
  const main = audioContext.createOscillator();
  const overtone = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();

  main.type = "triangle";
  overtone.type = "sine";
  main.frequency.setValueAtTime(frequency, startTime);
  overtone.frequency.setValueAtTime(frequency * 2.01, startTime);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, startTime);
  filter.frequency.exponentialRampToValueAtTime(620, startTime + duration);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(volume * 0.22, startTime + 0.28);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  main.connect(filter);
  overtone.connect(filter);
  filter.connect(gain).connect(audioContext.destination);
  main.start(startTime);
  overtone.start(startTime);
  main.stop(startTime + duration + 0.05);
  overtone.stop(startTime + duration + 0.05);
};

const playRomanticPhrase = () => {
  if (!audioContext || !isMusicPlaying) {
    return;
  }

  const now = audioContext.currentTime;
  const melody = [
    659.25, 622.25, 659.25, 622.25, 659.25, 493.88, 587.33, 523.25, 440.0,
    261.63, 329.63, 440.0, 493.88, 329.63, 415.3, 493.88, 523.25, 329.63,
    659.25, 622.25, 659.25, 622.25, 659.25, 493.88, 587.33, 523.25, 440.0,
  ];
  const chords = [
    [220.0, 261.63, 329.63],
    [164.81, 246.94, 329.63],
    [196.0, 246.94, 293.66],
    [220.0, 261.63, 329.63],
  ];

  chords.forEach((chord, chordIndex) => {
    const chordStart = now + chordIndex * 2.6;
    playPianoNote(chord[0], chordStart, 2.7, 0.012);
    chord.forEach((note, noteIndex) => {
      playPianoNote(note, chordStart + 0.24 + noteIndex * 0.2, 1.9, 0.01);
    });
  });

  melody.forEach((note, index) => {
    const start = now + index * 0.28;
    const isLandingNote = index === 8 || index === 17 || index === 26;
    playPianoNote(note, start, isLandingNote ? 1.4 : 0.62, isLandingNote ? 0.026 : 0.021);
  });
};

const startRomanticMusic = async () => {
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  await audioContext.resume();
  isMusicPlaying = true;
  musicToggle.classList.add("is-playing");
  musicToggle.setAttribute("aria-pressed", "true");
  musicToggle.textContent = "Pausar musica";
  playRomanticPhrase();
  musicTimer = window.setInterval(playRomanticPhrase, 8200);
};

const stopRomanticMusic = () => {
  isMusicPlaying = false;
  window.clearInterval(musicTimer);
  musicToggle.classList.remove("is-playing");
  musicToggle.setAttribute("aria-pressed", "false");
  musicToggle.textContent = "Musica romantica";
};

const showSection = (sectionId) => {
  toggleSections.forEach((section) => {
    const shouldShow = section.id === sectionId;
    section.hidden = !shouldShow;
    section.classList.toggle("is-hidden", !shouldShow);
  });

  const section = document.getElementById(sectionId);
  if (section) {
    section.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));
sectionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const sectionId = trigger.dataset.showSection;

    if (sectionId) {
      event.preventDefault();
      showSection(sectionId);
    }
  });
});
if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (isMusicPlaying) {
      stopRomanticMusic();
    } else {
      startRomanticMusic();
    }
  });
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
