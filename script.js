const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const form = document.querySelector("#enquiry-form");
const formStatus = document.querySelector("#form-status");
const locationLinks = [...document.querySelectorAll('nav a[href="#home"], nav a[href="#solutions"], nav a[href="#approach"], nav a[href="#who-we-help"]')];
const observedSections = ["home", "solutions", "approach", "who-we-help"]
  .map((id) => document.getElementById(id));

function setActiveLocation(id) {
  locationLinks.forEach((link) => {
    const isActive = link.hash === `#${id}`;
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

locationLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveLocation(link.hash.slice(1)));
});

if ("IntersectionObserver" in window) {
  const visibleSections = new Map();
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio);
      else visibleSections.delete(entry.target.id);
    });

    const active = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0];
    if (active) setActiveLocation(active[0]);
  }, {
    rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue("--header-height").trim()} 0px -48% 0px`,
    threshold: [0, 0.15, 0.35, 0.6]
  });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  mobileMenu.hidden = true;
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") === "false";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.hidden = !willOpen;
  document.body.classList.toggle("menu-open", willOpen);
});

mobileMenu.addEventListener("click", (event) => {
  if (event.target.matches("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileMenu.hidden) {
    closeMenu();
    menuButton.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1080 && !mobileMenu.hidden) closeMenu();
});

const messages = {
  "first-name": "Please enter your first name.", "last-name": "Please enter your last name.",
  email: "Please enter a valid email address.", phone: "Please enter a valid phone number.",
  service: "Please select a finance service.", goal: "Please tell us a little more about your goal.",
  privacy: "Please confirm the privacy acknowledgement."
};

function validateField(field) {
  const wrapper = field.closest(".field");
  const error = document.querySelector(`#${field.id}-error`);
  const isValid = field.checkValidity();
  wrapper.classList.toggle("has-error", !isValid);
  field.setAttribute("aria-invalid", String(!isValid));
  const describedBy = field.id === "goal" ? "goal-note goal-error" : `${field.id}-error`;
  field.setAttribute("aria-describedby", describedBy);
  error.textContent = isValid ? "" : messages[field.id];
  return isValid;
}

form.addEventListener("input", (event) => {
  if (event.target.matches("input, textarea")) validateField(event.target);
});
form.addEventListener("change", (event) => {
  if (event.target.matches("select, input[type='checkbox']")) validateField(event.target);
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, select, textarea")];
  const isValid = fields.map(validateField).every(Boolean);
  if (!isValid) {
    fields.find((field) => !field.checkValidity()).focus();
    return;
  }
  // Preview only: preserve the entered values until an approved secure endpoint is configured.
  formStatus.textContent = "This preview cannot send enquiries yet. Form connection is pending stakeholder confirmation.";
  formStatus.focus();
});
