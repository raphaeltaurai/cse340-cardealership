document.addEventListener("DOMContentLoaded", function() {
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  if (togglePassword && passwordInput && eyeIcon) {
    togglePassword.addEventListener("click", function() {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      // Toggle icon
      if (type === "text") {
        eyeIcon.textContent = "🙈"; // closed eye
        togglePassword.setAttribute("aria-label", "Hide password");
      } else {
        eyeIcon.textContent = "👁️"; // open eye
        togglePassword.setAttribute("aria-label", "Show password");
      }
    });
  }
});
