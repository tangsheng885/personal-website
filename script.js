const header = document.querySelector("[data-header]");
const languageToggle = document.querySelector("[data-language-toggle]");
const translatableElements = document.querySelectorAll("[data-i18n]");
const revealItems = document.querySelectorAll(".reveal");
const sectionTriggers = document.querySelectorAll("[data-show-section]");
const toggleSections = document.querySelectorAll("#watch-categories, #men-watches, #women-watches, #kids-watches, #perfume-categories, #women-perfumes, #men-perfumes");
const musicToggle = document.querySelector("[data-music-toggle]");
const galleryImages = document.querySelectorAll(".perfume-grid img");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxStage = document.querySelector(".lightbox-stage");
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
let lightboxPan = null;
let currentLanguage = "es";
let canSwitchLanguage = new URLSearchParams(window.location.search).get("owner") === "1";

const translations = {
  es: {
    "nav.about": "Sobre mí",
    "nav.catalog": "Catálogo",
    "nav.contact": "Contacto",
    "hero.eyebrow": "Sitio personal",
    "hero.title": "El espacio personal de C.T.",
    "hero.copy": "Un espacio sencillo, cuidado y con personalidad.",
    "hero.about": "Conóceme",
    "hero.contact": "Contáctame",
    "about.label": "Sobre mí",
    "about.title": "Hola, soy C.T.",
    "about.copy": "Me gustan los objetos bien diseñados, la comunicación clara y una vida con calidad.",
    "catalog.watches": "Relojes",
    "catalog.perfumes": "Perfumes",
    "catalog.glasses": "Gafas",
    "service.repair": "Reparación gratuita",
    "service.copy": "Compra con tranquilidad: tienes respaldo posventa",
    "service.womenCopy": "Los relojes para mujer incluyen respaldo posventa",
    "watches.categories": "Categorías de relojes",
    "watches.choose": "Elige relojes para hombre, mujer o niños.",
    "watches.men": "Relojes para hombre",
    "watches.women": "Relojes para mujer",
    "watches.kids": "Relojes para niños",
    "watches.menCopy": "Nuevos relojes para hombre. Precios en las imágenes y envío gratis.",
    "watches.womenCopy": "Colección de relojes para mujer. Precio: $8.900. Envío gratis.",
    "watches.kidsCopy": "Colección de relojes para niños. Precio: $8.900. Envío gratis.",
    "common.priceImage": "Precio en la imagen",
    "common.shipping": "Envío gratis",
    "perfumes.categories": "Categorías de perfumes",
    "perfumes.women": "Perfumes para mujer",
    "perfumes.men": "Perfumes para hombre",
    "perfumes.womenCopy": "Selección de perfumes para mujer. Precio: $15.900. Envío gratis.",
    "perfumes.menCopy": "Selección de perfumes para hombre. Precio: $15.900. Envío gratis.",
    "contact.label": "Contacto",
    "contact.title": "Contáctame",
    "contact.copy": "Será un gusto conversar contigo.",
    "contact.qrTitle": "Escanea y visita nuestra web",
    "footer.top": "Volver arriba",
  },
  zh: {
    "nav.about": "关于",
    "nav.catalog": "目录",
    "nav.contact": "联系",
    "hero.eyebrow": "个人网站",
    "hero.title": "C.T. 的个人主页",
    "hero.copy": "一个简洁、有质感的个人主页。",
    "hero.about": "了解我",
    "hero.contact": "联系我",
    "about.label": "关于",
    "about.title": "你好，我是 C.T.。",
    "about.copy": "喜欢精致物件、清晰表达和有品质的生活方式。",
    "catalog.watches": "腕表",
    "catalog.perfumes": "香氛",
    "catalog.glasses": "眼镜",
    "service.repair": "免费维修",
    "service.copy": "售后有保障，选购更安心",
    "service.womenCopy": "女士手表售后有保障，选购更安心",
    "watches.categories": "腕表分类",
    "watches.choose": "请选择男士、女士或儿童手表。",
    "watches.men": "男士手表",
    "watches.women": "女士手表",
    "watches.kids": "儿童手表",
    "watches.menCopy": "男士手表新品。价格见图片，免费送货。",
    "watches.womenCopy": "女士手表图片展示。价格：$8900。免费送货。",
    "watches.kidsCopy": "儿童手表图片展示。价格：$8900。免费送货。",
    "common.priceImage": "价格见图片",
    "common.shipping": "免费送货",
    "perfumes.categories": "香水分类",
    "perfumes.women": "女用香水",
    "perfumes.men": "男士香水",
    "perfumes.womenCopy": "精选香水图片展示。价格：$15900。免费送货。",
    "perfumes.menCopy": "男士香水图片展示。价格：$15900。免费送货。",
    "contact.label": "联系",
    "contact.title": "联系我",
    "contact.copy": "欢迎交流。",
    "contact.qrTitle": "扫码访问网站",
    "footer.top": "回到顶部",
  },
};

try {
  currentLanguage = localStorage.getItem("siteLanguage") === "zh" ? "zh" : "es";
  if (canSwitchLanguage) {
    localStorage.setItem("languageOwnerAccess", "true");
  } else {
    canSwitchLanguage = localStorage.getItem("languageOwnerAccess") === "true";
  }
} catch {
  currentLanguage = "es";
}

const musicLabels = () => currentLanguage === "zh"
  ? { play: "浪漫音乐", pause: "暂停音乐" }
  : { play: "Música romántica", pause: "Pausar música" };

const applyLanguage = (language, remember = false) => {
  currentLanguage = language === "zh" ? "zh" : "es";
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "es";
  document.title = currentLanguage === "zh" ? "C.T. | 个人主页" : "C.T. | Sitio personal";

  translatableElements.forEach((element) => {
    const value = translations[currentLanguage][element.dataset.i18n];
    if (value) element.textContent = value;
  });

  if (languageToggle) {
    languageToggle.hidden = !canSwitchLanguage;
    languageToggle.textContent = currentLanguage === "es" ? "中文" : "Español";
    languageToggle.setAttribute(
      "aria-label",
      currentLanguage === "es" ? "Cambiar idioma a chino" : "切换到西班牙语"
    );
  }

  if (musicToggle) {
    musicToggle.textContent = isMusicPlaying ? musicLabels().pause : musicLabels().play;
  }

  if (remember) {
    try {
      localStorage.setItem("siteLanguage", currentLanguage);
    } catch {
      // The page still works when browser storage is unavailable.
    }
  }
};

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

const startRomanticMusic = async () => {
  await romanticAudio.play();
  isMusicPlaying = true;
  musicToggle.classList.add("is-playing");
  musicToggle.setAttribute("aria-pressed", "true");
  musicToggle.textContent = musicLabels().pause;
};

const stopRomanticMusic = () => {
  isMusicPlaying = false;
  romanticAudio.pause();
  romanticAudio.currentTime = 0;
  musicToggle.classList.remove("is-playing");
  musicToggle.setAttribute("aria-pressed", "false");
  musicToggle.textContent = musicLabels().play;
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
  lightbox?.classList.toggle("is-zoomed", lightboxZoom > 1);
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
  lightboxPan = null;
  lightbox.classList.remove("is-dragging");
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
if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    applyLanguage(currentLanguage === "es" ? "zh" : "es", true);
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
if (lightboxStage) {
  lightboxStage.addEventListener("wheel", (event) => {
    if (lightbox.hidden) return;

    if (event.ctrlKey) {
      event.preventDefault();
      const zoomStep = event.deltaY < 0 ? 0.15 : -0.15;
      setLightboxZoom(lightboxZoom + zoomStep);
    }
  }, { passive: false });

  lightboxStage.addEventListener("pointerdown", (event) => {
    if (lightboxZoom <= 1 || event.button !== 0) return;

    event.preventDefault();
    lightboxPan = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: lightboxStage.scrollLeft,
      scrollTop: lightboxStage.scrollTop,
    };
    lightboxStage.setPointerCapture(event.pointerId);
    lightbox.classList.add("is-dragging");
  });

  lightboxStage.addEventListener("pointermove", (event) => {
    if (!lightboxPan || lightboxPan.pointerId !== event.pointerId) return;

    lightboxStage.scrollLeft = lightboxPan.scrollLeft - (event.clientX - lightboxPan.startX);
    lightboxStage.scrollTop = lightboxPan.scrollTop - (event.clientY - lightboxPan.startY);
  });

  const stopLightboxPan = (event) => {
    if (!lightboxPan || lightboxPan.pointerId !== event.pointerId) return;

    lightboxPan = null;
    lightbox.classList.remove("is-dragging");
  };

  lightboxStage.addEventListener("pointerup", stopLightboxPan);
  lightboxStage.addEventListener("pointercancel", stopLightboxPan);
}
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
  }
});
applyLanguage(currentLanguage);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
