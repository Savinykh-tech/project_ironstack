(function () {
  "use strict";

  // Проверяем, давал ли пользователь согласие
  if (localStorage.getItem("cookie-consent") === "accepted") return;

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.innerHTML = `
    <div class="cookie-banner__inner container">
      <p class="cookie-banner__text">
        Мы используем файлы cookie для улучшения работы сайта и анализа трафика. 
        Продолжая использование сайта, вы соглашаетесь с 
        <a href="privacy-policy.html">политикой конфиденциальности</a>.
      </p>
      <button class="cookie-banner__accept" type="button">Принять</button>
    </div>
  `;

  document.body.appendChild(banner);

  const acceptBtn = banner.querySelector(".cookie-banner__accept");
  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "accepted");
    banner.classList.add("cookie-banner--hidden");
    setTimeout(() => banner.remove(), 300);
  });
})();