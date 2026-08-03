const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const form = document.querySelector("#enquiry-form");
const formStatus = document.querySelector("#form-status");

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
