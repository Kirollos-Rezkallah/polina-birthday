async function updateDonationProgress() {
  try {
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const targetUrl = "https://www.tbank.ru/cf/8hvmwfBM9BF";
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));

    if (!response.ok) throw new Error("Ошибка загрузки страницы");

    const data = await response.json();
    const html = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const moneyElement = doc.querySelector(".Money-module__money_UZBbh");
    if (!moneyElement) throw new Error("Сумма не найдена на странице");

    const amountText = moneyElement.textContent.trim();
    const amount = parseFloat(
      amountText.replace(/[^\d.,]/g, "").replace(",", ".")
    );

    if (isNaN(amount)) throw new Error("Ошибка при разборе суммы");

    const target = 200000;
    const percentage = Math.min(Math.round((amount / target) * 100), 100);

    // Update the width of the progress bar
    document.querySelector(".progress-fill").style.width = `${percentage}%`;

    // Update the text under the strip
    document.querySelector(
      ".funding p"
    ).textContent = `${amount.toLocaleString()}₽ из ${target.toLocaleString()}₽ собрано`;

    // console.log(`Прогресс обновлён: ${percentage}% (${amount}₽)`);
  } catch (error) {
    console.error("Ошибка при обновлении прогресса:", error);
    document.querySelector(".funding p").textContent =
      "не удалось загрузить сумму :(";
  }
}

// The first challenge
updateDonationProgress();

// Update every 5 minutes
setInterval(updateDonationProgress, 300000);

// Crypto code copy
document.getElementById("copy-trc20").addEventListener("click", function (e) {
  e.preventDefault();
  const trc20Address = "TYL4n3stBDdrvjhghLCbnSrPKsZQmpDSRZ";

  navigator.clipboard.writeText(trc20Address).then(() => {
    const msg = document.getElementById("copy-message");
    msg.style.opacity = "1";
    setTimeout(() => (msg.style.opacity = "0"), 2000);
  });
});

// Response of form after submission
const wishForm = document.getElementById("wish-form");

wishForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(wishForm);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => {
      alert("спасибо за твоё пожелание! мне очень приятно :)");
      wishForm.reset();
    })
    .catch(() => alert("упс! что-то пошло не так... попробуй ещё раз позже."));
});

// Alipay qr code pop up
const qrPopup = document.getElementById("qr-popup");
const alipayBtn = document.getElementById("alipay-btn");

alipayBtn.addEventListener("click", function (e) {
  e.preventDefault();
  qrPopup.classList.toggle("qr-hidden");
});

qrPopup.addEventListener("click", (e) => {
  e.stopPropagation(); // don't close when clicking on the popup itself
});

document.addEventListener("click", function (e) {
  if (!qrPopup.contains(e.target) && !alipayBtn.contains(e.target)) {
    qrPopup.classList.add("qr-hidden");
  }
});
