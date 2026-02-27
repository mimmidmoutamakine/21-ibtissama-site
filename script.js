// Mobile nav toggle
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");

if (toggle) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Close nav on link click (mobile)
document.querySelectorAll(".nav-list a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

// Reveal on scroll (IntersectionObserver)
const revealElements = document.querySelectorAll("[data-reveal]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute("data-delay");
        if (delay) {
          entry.target.style.transitionDelay = `${delay}ms`;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((el) => observer.observe(el));

// Simple stats counter
const statNumbers = document.querySelectorAll(".stat-number");
let statsStarted = false;

function startStats() {
  if (statsStarted) return;
  statsStarted = true;

  statNumbers.forEach((el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    let current = 0;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / target), 20);

    const interval = setInterval(() => {
      current += 1;
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, stepTime);
  });
}

const impactSection = document.getElementById("impact");
if (impactSection) {
  const impactObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startStats();
          impactObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  impactObserver.observe(impactSection);
}

// ====== HERO IMAGE SLIDER ======
(function () {
  const wrapper = document.querySelector("[data-hero-slider]");
  if (!wrapper) return;

  const slides = Array.from(wrapper.querySelectorAll(".hero-slide"));
  const prevBtn = wrapper.querySelector("[data-hero-prev]");
  const nextBtn = wrapper.querySelector("[data-hero-next]");
  const dotsContainer = wrapper.querySelector("[data-hero-dots]");
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll(".hero-dot")) : [];

  let current = 0;
  let timerId = null;
  const DELAY = 7000; // 7 seconds

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
    });

    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === current);
      });
    }
  }

  function goNext() {
    showSlide(current + 1);
  }

  function goPrev() {
    showSlide(current - 1);
  }

  function startAuto() {
    stopAuto();
    timerId = setInterval(goNext, DELAY);
  }

  function stopAuto() {
    if (timerId) clearInterval(timerId);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goNext();
      startAuto();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goPrev();
      startAuto();
    });
  }

  if (dots.length) {
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        showSlide(i);
        startAuto();
      });
    });
  }

  // pause on hover (desktop)
  wrapper.addEventListener("mouseenter", stopAuto);
  wrapper.addEventListener("mouseleave", startAuto);

  // init
  showSlide(0);
  startAuto();
})();

// ====== RENDER NEWS FROM DATA (news-data.js) ======
(function () {
  // had script ghadi ykhdem ghir f news.html (7it ids kaynin ghir hnayk)
  const timelineContainer = document.getElementById("news-timeline");
  const articlesContainer = document.getElementById("news-articles");

  // ila ma kaynach had page, nخرجو بلا والو
  if (!timelineContainer && !articlesContainer) return;

// ====== RENDER NEWS FROM DATA (news-data.js) ======
(function () {
  const timelineContainer = document.getElementById("news-timeline");
  const articlesContainer = document.getElementById("news-articles");

  if (!timelineContainer && !articlesContainer) return;

  // 1) RENDER TIMELINE
  if (timelineContainer && Array.isArray(NEWS_TIMELINE)) {
    timelineContainer.innerHTML = "";

    NEWS_TIMELINE.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "timeline-item";
      wrapper.setAttribute("data-reveal", "fade-up");
      if (index > 0) {
        wrapper.setAttribute("data-delay", String(index * 100));
      }

      wrapper.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>${item.title}</h3>
          <span class="timeline-date">${item.date}</span>
          <p>${item.text}</p>
        </div>
      `;

      timelineContainer.appendChild(wrapper);
    });
  }

  // 2) RENDER ARTICLES CARDS
  if (articlesContainer && Array.isArray(NEWS_ARTICLES)) {
    articlesContainer.innerHTML = "";

    NEWS_ARTICLES.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "card";
      card.setAttribute("data-reveal", "fade-up");
      if (index > 0) {
        card.setAttribute("data-delay", String(index * 100));
      }

      card.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      `;

      articlesContainer.appendChild(card);
    });
  }
})();

  // bach animations dyal [data-reveal] ykhdmo 3la had elements jdod,
  // khassna n3ayetou l IntersectionObserver li 3mlnah lfo9.
  // ila observer mta3refch global, n9der ndir simple re-init:
  try {
    const revealElements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute("data-delay");
            if (delay) {
              entry.target.style.transitionDelay = `${delay}ms`;
            }
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealElements.forEach((el) => observer.observe(el));
  } catch (e) {
    // ila chi haja mashi mzyana ma ndirou walo, ghadi gha yban content bla animation
    console.warn("Reveal observer re-init skipped:", e);
  }
})();

// Set current year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}