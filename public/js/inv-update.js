document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("editInventoryForm");
  const updateBtn = document.getElementById("updateForm");
  if (form && updateBtn) {
    form.addEventListener("input", function () {
      updateBtn.removeAttribute("disabled");
    });
  }
});