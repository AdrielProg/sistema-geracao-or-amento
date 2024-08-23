document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", function (event) {
    removeErrorMessages();

    let isValid = true;

    if (emailInput.value.trim() === "") {
      showError(emailInput, "Por favor, insira o seu e-mail.");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "Por favor, insira um e-mail válido.");
      isValid = false;
    }

    if (passwordInput.value.trim() === "") {
      showError(passwordInput, "Por favor, insira a sua senha.");
      isValid = false;
    }

    if (!isValid) {
      event.preventDefault();
    }
  });

  function showError(input, message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.style.color = "red";
    errorElement.innerText = message;
    input.parentElement.appendChild(errorElement);
  }

  function removeErrorMessages() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(function (msg) {
      msg.remove();
    });
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
