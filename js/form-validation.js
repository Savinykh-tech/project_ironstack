(function () {
  "use strict";

  // 1. ЗАПОМИНАЕМ ВРЕМЯ ЗАГРУЗКИ СТРАНИЦЫ СРАЗУ (вне обработчиков)
  sessionStorage.setItem('pageLoadTime', Date.now().toString());

  const form = document.getElementById("contact-form");
  if (!form) return;

  // Регулярки для проверки
  const patterns = {
    email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    phone: /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/
  };

  function showError(inputName, message) {
    const errorEl = document.querySelector(`[data-error-for="${inputName}"]`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("visible");
    }
  }

  function clearError(inputName) {
    const errorEl = document.querySelector(`[data-error-for="${inputName}"]`);
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
    }
  }

  function validateContact(value) {
    const trimmed = value.trim();
    if (!trimmed) return "Укажите email или телефон";
    if (patterns.email.test(trimmed)) return null;
    
    const digitsOnly = trimmed.replace(/\D/g, "");
    if (digitsOnly.length === 11 && (digitsOnly.startsWith("7") || digitsOnly.startsWith("8"))) {
      return null;
    }
    return "Введите корректный email (mail@example.com) или телефон (+7 999 000-00-00)";
  }

  function validateName(value) {
    const trimmed = value.trim();
    if (!trimmed) return "Укажите ваше имя";
    if (trimmed.length < 2) return "Имя должно содержать минимум 2 символа";
    if (/^\d+$/.test(trimmed)) return "Имя не может состоять только из цифр";
    return null;
  }

  function validateCheckbox(checkbox) {
    if (!checkbox.checked) return "Необходимо дать согласие";
    return null;
  }

  // 2. ФУНКЦИЯ ПРОВЕРКИ НА СПАМ (вынесена отдельно)
  function isSpam(currentForm) {
    // Honeypot проверка
    const honeypot = currentForm.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn('🤖 Обнаружен бот: заполнено honeypot поле');
      return true; 
    }

    // Time-based проверка
    const formSubmitTime = Date.now();
    const pageLoadTime = parseInt(sessionStorage.getItem('pageLoadTime')) || formSubmitTime;
    const timeToFill = (formSubmitTime - pageLoadTime) / 1000; 
    
    if (timeToFill < 3) {
      console.warn(`🤖 Обнаружен бот: форма заполнена за ${timeToFill.toFixed(1)} секунд`);
      return true; 
    }

    return false; 
  }

  // Валидация при потере фокуса
  const contactInput = document.getElementById("contact");
  const nameInput = document.getElementById("name");

  contactInput.addEventListener("blur", function () {
    const error = validateContact(this.value);
    if (error) {
      showError("contact", error);
      this.classList.add("invalid");
    } else {
      clearError("contact");
      this.classList.remove("invalid");
    }
  });

  contactInput.addEventListener("input", function () {
    if (this.classList.contains("invalid")) {
      const error = validateContact(this.value);
      if (!error) {
        clearError("contact");
        this.classList.remove("invalid");
      }
    }
  });

  nameInput.addEventListener("blur", function () {
    const error = validateName(this.value);
    if (error) {
      showError("name", error);
      this.classList.add("invalid");
    } else {
      clearError("name");
      this.classList.remove("invalid");
    }
  });

  nameInput.addEventListener("input", function () {
    if (this.classList.contains("invalid")) {
      const error = validateName(this.value);
      if (!error) {
        clearError("name");
        this.classList.remove("invalid");
      }
    }
  });

  // Валидация при отправке
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // Имя
    const nameError = validateName(nameInput.value);
    if (nameError) {
      showError("name", nameError);
      nameInput.classList.add("invalid");
      isValid = false;
    } else {
      clearError("name");
      nameInput.classList.remove("invalid");
    }

    // Контакт
    const contactError = validateContact(contactInput.value);
    if (contactError) {
      showError("contact", contactError);
      contactInput.classList.add("invalid");
      isValid = false;
    } else {
      clearError("contact");
      contactInput.classList.remove("invalid");
    }

    // Чекбокс ПД
    const pdCheckbox = form.querySelector('input[name="pd-consent"]');
    const pdError = validateCheckbox(pdCheckbox);
    if (pdError) {
      showError("pd-consent", pdError);
      isValid = false;
    } else {
      clearError("pd-consent");
    }

    // Чекбокс оферты
    const ofertaCheckbox = form.querySelector('input[name="oferta-consent"]');
    const ofertaError = validateCheckbox(ofertaCheckbox);
    if (ofertaError) {
      showError("oferta-consent", ofertaError);
      isValid = false;
    } else {
      clearError("oferta-consent");
    }

    if (!isValid) {
      const firstError = form.querySelector(".form-error.visible");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return; // Останавливаем выполнение, если есть ошибки валидации
    }

    // 3. ПРОВЕРКА НА СПАМ (вызываем функцию ПЕРЕД отправкой)
    if (isSpam(form)) {
      // Ботам показываем успешную отправку, чтобы они "успокоились", 
      // но на самом деле мы ничего не отправляем (форма просто сбрасывается)
      console.log("Спам-атака заблокирована.");
      form.reset();
      return; 
    }

    // 4. Если всё ок (и не спам), отправляем
    alert("Заявка отправлена! (Это демо-режим, бэкенд подключим позже)");
    form.reset();
  });
})();