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

const playTone = (frequency, startTime, duration, volume = 0.035, type = "sine") => {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
};

const playRomanticPhrase = () => {
  if (!audioContext || !isMusicPlaying) {
    return;
  }

  const now = audioContext.currentTime;
  const chords = [
    [261.63, 329.63, 392.0],
    [220.0, 329.63, 440.0],
    [246.94, 293.66, 392.0],
    [196.0, 293.66, 392.0],
  ];

  chords.forEach((chord, index) => {
    const start = now + index * 1.2;
    chord.forEach((note) => playTone(note, start, 1.5, 0.018));
    playTone(chord[2] * 2, start + 0.55, 0.55, 0.02, "triangle");
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
  musicTimer = window.setInterval(playRomanticPhrase, 4800);
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
