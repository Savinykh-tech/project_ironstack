(function () {
  "use strict";
  const canvas = document.getElementById("cosmos-canvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  let width, height, dpr;
  let stars = [];
  let shootingStars = [];
  let lastFrame = 0;

  const CONFIG = {
    starCount: 120, // Мало звезд, много воздуха
    starBaseSize: 1.2, // Очень мелкие точки
    shootingStarChance: 0.0005, // Редкая пасхалка (раз в ~30 сек)
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initStars();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < CONFIG.starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * CONFIG.starBaseSize,
        opacity: 0.1 + Math.random() * 0.4, // От 0.1 до 0.5
        twinkleSpeed: 0.005 + Math.random() * 0.01,
        twinkleDir: 1,
      });
    }
  }

  function draw(timestamp) {
    if (document.hidden) return;
    if (timestamp - lastFrame < 33) { // 30fps для экономии CPU
      requestAnimationFrame(draw);
      return;
    }
    lastFrame = timestamp;
    ctx.clearRect(0, 0, width, height);

    // Статичные мерцающие звезды
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.opacity += s.twinkleSpeed * s.twinkleDir;
      if (s.opacity > 0.5 || s.opacity < 0.1) s.twinkleDir *= -1;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Редкие падающие звезды
    if (Math.random() < CONFIG.shootingStarChance && shootingStars.length < 1) {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.3),
        vx: 4 + Math.random() * 3,
        vy: 2 + Math.random() * 2,
        life: 1,
        length: 80,
      });
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 10, ss.y - ss.vy * 10);
      grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.vx * 10, ss.y - ss.vy * 10);
      ctx.stroke();

      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life -= 0.02;

      if (ss.life <= 0 || ss.x > width || ss.y > height) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
})();