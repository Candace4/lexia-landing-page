const form = document.querySelector("#enquiry-form");

const messages = {
  "first-name": "Please enter your first name.",
  "last-name": "Please enter your last name.",
  email: "Please enter a valid email address.",
  phone: "Please enter a valid phone number.",
  service: "Please select a finance service.",
  goal: "Please tell us a little more about your goal."
};

function validateField(field) {
  const wrapper = field.closest(".field");
  const error = document.querySelector(`#${field.id}-error`);
  const isValid = field.checkValidity();

  wrapper.classList.toggle("has-error", !isValid);
  field.setAttribute("aria-invalid", String(!isValid));
  field.setAttribute("aria-describedby", field.id === "goal" ? "goal-helper goal-error" : `${field.id}-error`);
  error.textContent = isValid ? "" : messages[field.id];
  return isValid;
}

form.addEventListener("input", (event) => {
  if (event.target.matches("input, textarea")) validateField(event.target);
});

form.addEventListener("change", (event) => {
  if (event.target.matches("select")) validateField(event.target);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = [...form.querySelectorAll("input, select, textarea")];
  const isValid = fields.map(validateField).every(Boolean);

  if (!isValid) {
    fields.find((field) => !field.checkValidity()).focus();
    return;
  }

  // Preview only: submit to the approved CRM or secure endpoint here in production.
  document.querySelector("#form-content").innerHTML = `
    <div class="success-message" role="status" tabindex="-1">
      <span class="success-icon" aria-hidden="true">✓</span>
      <h2>Thank you</h2>
      <p>Your enquiry has been received. A Lexia finance specialist will be in touch within one business day.</p>
    </div>`;
  document.querySelector(".success-message").focus();
});
