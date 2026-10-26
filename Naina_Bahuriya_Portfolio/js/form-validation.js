document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;

  const fields = {
    name: {
      input: form.querySelector("#name"),
      error: form.querySelector("#name-error"),
      validate: value => value.trim().length >= 2
        ? ""
        : "Please enter your name (at least 2 characters)."
    },
    email: {
      input: form.querySelector("#email"),
      error: form.querySelector("#email-error"),
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? ""
        : "Please enter a valid email address."
    },
    message: {
      input: form.querySelector("#message"),
      error: form.querySelector("#message-error"),
      validate: value => value.trim().length >= 10
        ? ""
        : "Please enter a message with at least 10 characters."
    }
  };

  function validateField(field) {
    const message = field.validate(field.input.value);
    field.error.textContent = message;
    field.input.classList.toggle("invalid", Boolean(message));
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    return message === "";
  }

  Object.values(fields).forEach(field => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.classList.contains("invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const isValid = Object.values(fields).map(validateField).every(Boolean);

    status.classList.remove("success", "error-status");
    if (!isValid) {
      status.textContent = "Please review the highlighted fields and try again.";
      status.classList.add("error-status");
      form.querySelector(".invalid")?.focus();
      return;
    }

    status.textContent =
      "Your details look good. This demo does not send messages yet; connect a backend or form service to receive submissions.";
    status.classList.add("success");
  });
});
