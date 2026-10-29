
const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

document.getElementById("year").textContent = new Date().getFullYear();

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();

    formMessage.textContent =
        `Thank you, ${name}! Your demo enquiry has been validated. ` +
        "This form is not connected to an email service yet.";

    contactForm.reset();
});
