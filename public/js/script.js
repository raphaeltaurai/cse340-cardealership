document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.toggle-password').forEach(function(toggleBtn) {
    toggleBtn.addEventListener("click", function() {
      const formGroup = this.closest('.form-group');
      const passwordInput = formGroup ? formGroup.querySelector('.password-input') : null;
      const eyeIcon = this.querySelector('.eye-icon');
      if (passwordInput) {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        // Toggle icon
        if (eyeIcon) {
          if (type === "text") {
            eyeIcon.textContent = "🙈";
            this.setAttribute("aria-label", "Hide password");
          } else {
            eyeIcon.textContent = "👁️";
            this.setAttribute("aria-label", "Show password");
          }
        }
      }
    });
  });
});
