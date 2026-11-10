
const digitalTime = document.getElementById("digital-time");
const dateLine = document.getElementById("date-line");
const secondHand = document.getElementById("second-hand");
const formatToggle = document.getElementById("format-toggle");

let use24Hour = false;

function updateClock() {
  const now = new Date();

  digitalTime.textContent = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !use24Hour
  }).format(now);

  dateLine.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(now);

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  secondHand.style.transform = `rotate(${seconds * 6}deg)`;
}

formatToggle.addEventListener("click", () => {
  use24Hour = !use24Hour;

  formatToggle.textContent = use24Hour
    ? "Switch to 12-hour"
    : "Switch to 24-hour";

  updateClock();
});

updateClock();
setInterval(updateClock, 250);
