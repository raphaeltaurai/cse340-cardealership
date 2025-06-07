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

  // Password match validation for register form
  var registerForm = document.querySelector('form[action="/account/register"]');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      var password = registerForm.querySelector('input[name="account_password"]');
      var confirm = registerForm.querySelector('input[name="account_confirm_password"]');
      // Remove any previous error
      var oldError = registerForm.querySelector('.password-error');
      if (oldError) oldError.remove();
      if (password && confirm && password.value !== confirm.value) {
        e.preventDefault();
        var error = document.createElement('p');
        error.className = 'password-error form-text';
        error.style.color = '#d9534f';
        error.textContent = 'Passwords do not match.';
        confirm.parentElement.parentElement.appendChild(error);
        confirm.focus();
      }
    });
  }

  // Login form validation
  var loginForm = document.querySelector('form[action="/account/login"]');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      var email = loginForm.querySelector('input[name="account_email"]');
      var password = loginForm.querySelector('input[name="account_password"]');
      // Remove any previous error
      var oldError = loginForm.querySelector('.login-error');
      if (oldError) oldError.remove();
      var errorMsg = '';
      if (!email.value.trim()) {
        errorMsg = 'Email is required.';
        email.focus();
      } else if (!password.value.trim()) {
        errorMsg = 'Password is required.';
        password.focus();
      }
      if (errorMsg) {
        e.preventDefault();
        var error = document.createElement('p');
        error.className = 'login-error form-text';
        error.style.color = '#d9534f';
        error.textContent = errorMsg;
        password.parentElement.parentElement.appendChild(error);
      }
    });
  }
});
