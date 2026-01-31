const WHATSAPP_PHONE = "7XXXXXXXXXX";
const BRAND_NAME = "BRAND_NAME_HERE";
const MODELS = [
  {
    name: "MODEL_1_NAME",
    features: ["Сдержанный профиль", "Контрольная система", "Сертифицированные материалы"],
  },
  {
    name: "MODEL_2_NAME",
    features: ["Умеренная динамика", "Точный подбор", "Надёжные компоненты"],
  },
  {
    name: "MODEL_3_NAME",
    features: ["Минималистичная конструкция", "Тихая работа", "Единый стандарт качества"],
  },
];

const DOCTORS = [
  {
    id: 1,
    name: "Илья Кузнецов",
    city: "Москва",
    experienceYears: 18,
    credentials: ["Врач-уролог", "Опыт реконструктивных операций", "Член профильных ассоциаций"],
    photo: "assets/doctor-placeholder.svg",
    tags: ["Реконструктивная хирургия", "Премиальный сервис", "Этика"],
  },
  {
    id: 2,
    name: "Андрей Сорокин",
    city: "Санкт-Петербург",
    experienceYears: 16,
    credentials: ["Хирург-уролог", "Международная стажировка", "Сложные случаи"],
    photo: "assets/doctor-placeholder.svg",
    tags: ["Сертификация", "Точность", "Персональный подход"],
  },
  {
    id: 3,
    name: "Максим Литвинов",
    city: "Екатеринбург",
    experienceYears: 14,
    credentials: ["Врач-уролог", "Опыт 14 лет", "Работа по единому стандарту"],
    photo: "assets/doctor-placeholder.svg",
    tags: ["Командный подход", "Конфиденциальность", "Сдержанный стиль"],
  },
  {
    id: 4,
    name: "Олег Данилов",
    city: "Новосибирск",
    experienceYears: 20,
    credentials: ["Хирург высшей категории", "Профильные публикации", "Сложные кейсы"],
    photo: "assets/doctor-placeholder.svg",
    tags: ["Технологии", "Опыт", "Приватность"],
  },
  {
    id: 5,
    name: "Павел Орлов",
    city: "Казань",
    experienceYears: 12,
    credentials: ["Врач-уролог", "Практика 12 лет", "Фокус на этике"],
    photo: "assets/doctor-placeholder.svg",
    tags: ["Деликатный процесс", "Мягкое сопровождение", "Выбор врача"],
  },
  {
    id: 6,
    name: "Роман Трофимов",
    city: "Краснодар",
    experienceYears: 15,
    credentials: ["Уролог-андролог", "Сертифицированные импланты", "Согласование по графику"],
    photo: "assets/doctor-placeholder.svg",
    tags: ["Стабильность", "Партнёрство", "Ответственный подход"],
  },
];

const brandName = document.getElementById("brand-name");
const implantCards = document.getElementById("implant-cards");
const doctorGrid = document.getElementById("doctor-grid");
const cityFilter = document.getElementById("city-filter");
const doctorSearch = document.getElementById("doctor-search");
const yearSpan = document.getElementById("year");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const privacyModal = document.querySelector(".privacy-modal");
const privacyToggle = document.querySelector("[data-privacy-toggle]");
const privacyClose = document.querySelector("[data-privacy-close]");

const state = {
  city: "",
  doctorName: "",
  search: "",
};

const buildWhatsAppLink = ({ city, doctorName } = {}) => {
  const message =
    "Здравствуйте. Хочу конфиденциально узнать о фаллопротезировании." +
    ` Город: ${city || "[ваш город]"}.` +
    ` Предпочтительный врач: ${doctorName || "[если выбран]"}.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
};

const renderImplants = () => {
  implantCards.innerHTML = MODELS.map(
    (model) => `
      <article class="implant-card">
        <h3>${model.name}</h3>
        <ul class="implant-features">
          ${model.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </article>
    `,
  ).join("");
};

const uniqueCities = () => {
  const cities = new Set(DOCTORS.map((doctor) => doctor.city));
  return ["Все города", ...cities];
};

const renderCityOptions = () => {
  cityFilter.innerHTML = uniqueCities()
    .map((city) => `<option value="${city}">${city}</option>`)
    .join("");
};

const doctorMatches = (doctor) => {
  const matchesCity =
    !state.city || state.city === "Все города" || doctor.city === state.city;
  const matchesSearch = doctor.name
    .toLowerCase()
    .includes(state.search.toLowerCase());
  return matchesCity && matchesSearch;
};

const renderDoctors = () => {
  const filtered = DOCTORS.filter(doctorMatches);
  doctorGrid.innerHTML = filtered
    .map(
      (doctor) => `
      <article class="doctor-card">
        <div class="doctor-header">
          <img class="doctor-photo" src="${doctor.photo}" alt="${doctor.name}" loading="lazy" />
          <div>
            <h3 class="doctor-name">${doctor.name}</h3>
            <p class="doctor-meta">${doctor.city} · ${doctor.experienceYears} лет опыта</p>
          </div>
        </div>
        <ul class="implant-features">
          ${doctor.credentials.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <div class="tags">
          ${doctor.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <a class="button button-primary" data-whatsapp data-doctor="${doctor.name}" data-city="${doctor.city}" href="#">
          Написать анонимно (выбрать этого врача)
        </a>
      </article>
    `,
    )
    .join("");
  updateWhatsAppLinks();
};

const updateWhatsAppLinks = () => {
  document.querySelectorAll("[data-whatsapp]").forEach((button) => {
    const city = button.dataset.city || state.city;
    const doctorName = button.dataset.doctor || state.doctorName;
    button.setAttribute("href", buildWhatsAppLink({ city, doctorName }));
  });
};

const handleCityChange = (event) => {
  state.city = event.target.value === "Все города" ? "" : event.target.value;
  renderDoctors();
  updateWhatsAppLinks();
};

const handleSearch = (event) => {
  state.search = event.target.value.trim();
  renderDoctors();
};

const initAccordion = () => {
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      triggers.forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        item.parentElement.querySelector(".accordion-panel").hidden = true;
      });
      trigger.setAttribute("aria-expanded", String(!expanded));
      trigger.parentElement.querySelector(".accordion-panel").hidden = expanded;
    });
  });
};

const initMobileMenu = () => {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.hidden = expanded;
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
    });
  });
};

const initPrivacyModal = () => {
  const openModal = () => {
    privacyModal.hidden = false;
    privacyClose.focus();
  };
  const closeModal = () => {
    privacyModal.hidden = true;
    privacyToggle.focus();
  };
  privacyToggle?.addEventListener("click", openModal);
  privacyClose?.addEventListener("click", closeModal);
  privacyModal?.addEventListener("click", (event) => {
    if (event.target === privacyModal) {
      closeModal();
    }
  });
};

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
};

const init = () => {
  brandName.textContent = BRAND_NAME;
  renderImplants();
  renderCityOptions();
  renderDoctors();
  updateWhatsAppLinks();
  initAccordion();
  initMobileMenu();
  initPrivacyModal();
  initSmoothScroll();
  cityFilter.addEventListener("change", handleCityChange);
  doctorSearch.addEventListener("input", handleSearch);
  yearSpan.textContent = new Date().getFullYear();
};

init();
