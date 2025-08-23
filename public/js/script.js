// Example starter JavaScript for disabling form submissions if there are invalid fields


(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// for review rating range
try {
  const rangeInput = document.getElementById("rating");
  const rangeOutput = document.getElementById("rangeValue");

  // Set initial value
  rangeOutput.textContent = rangeInput.value;

  rangeInput.addEventListener("input", function () {
    rangeOutput.textContent = this.value;
  });
} catch (err) {
  console.log(err);
}

let alert = document.querySelector(".alert");

setTimeout(() => {
  alert.classList.add("hide-alert");

  // Remove after animation completes (e.g., 400ms)
  setTimeout(() => {
    alert.remove();
  }, 500);
}, 3000);

// if (alert.innerText.trim() !== "") {
//     alert.classList.add("show-alert");
// }
