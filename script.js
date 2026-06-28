const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const sectionTriggers = document.querySelectorAll("[data-show-section]");
const toggleSections = document.querySelectorAll("#watch-categories, #men-watches, #women-watches, #kids-watches, #perfume-categories, #women-perfumes, #men-perfumes");
const musicToggle = document.querySelector("[data-music-toggle]");
const galleryImages = document.querySelectorAll(".perfume-grid img");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const zoomInButton = document.querySelector("[data-zoom-in]");
const zoomOutButton = document.querySelector("[data-zoom-out]");
const zoomResetButton = document.querySelector("[data-zoom-reset]");
const romanticAudio = new Audio("assets/soft-romantic-piano.wav?v=soft-audio-1");
romanticAudio.loop = true;
romanticAudio.preload = "auto";
romanticAudio.volume = 0.58;
let isMusicPlaying = false;
let lightboxZoom = 1;

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

const startRomanticMusic = async () => {
  await romanticAudio.play();
  isMusicPlaying = true;
  musicToggle.classList.add("is-playing");
  musicToggle.setAttribute("aria-pressed", "true");
  musicToggle.textContent = "Pausar musica";
};

const stopRomanticMusic = () => {
  isMusicPlaying = false;
  romanticAudio.pause();
  romanticAudio.currentTime = 0;
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

const applyLightboxZoom = () => {
  if (!lightboxImage || !zoomResetButton) return;

  lightboxImage.style.setProperty("--zoom", lightboxZoom.toFixed(2));
  zoomResetButton.textContent = `${Math.round(lightboxZoom * 100)}%`;
};

const setLightboxZoom = (zoom) => {
  lightboxZoom = Math.min(Math.max(zoom, 1), 3);
  applyLightboxZoom();
};

const openLightbox = (image) => {
  if (!lightbox || !lightboxImage) return;

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  setLightboxZoom(1);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;

  lightbox.hidden = true;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  setLightboxZoom(1);
  document.body.classList.remove("lightbox-open");
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
  musicToggle.addEventListener("click", async () => {
    if (isMusicPlaying) {
      stopRomanticMusic();
    } else {
      try {
        await startRomanticMusic();
      } catch {
        stopRomanticMusic();
      }
    }
  });
}
galleryImages.forEach((image) => {
  image.addEventListener("click", () => openLightbox(image));
});
if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}
if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}
if (zoomInButton) {
  zoomInButton.addEventListener("click", () => setLightboxZoom(lightboxZoom + 0.25));
}
if (zoomOutButton) {
  zoomOutButton.addEventListener("click", () => setLightboxZoom(lightboxZoom - 0.25));
}
if (zoomResetButton) {
  zoomResetButton.addEventListener("click", () => setLightboxZoom(1));
}
if (lightbox) {
  lightbox.addEventListener("wheel", (event) => {
    if (lightbox.hidden) return;

    event.preventDefault();
    const zoomStep = event.deltaY < 0 ? 0.15 : -0.15;
    setLightboxZoom(lightboxZoom + zoomStep);
  }, { passive: false });
}
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
  }
});
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
