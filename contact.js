// Contact Form JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Contact form submission
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const contactData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("contactEmail"),
        phone: formData.get("contactPhone"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        consent: formData.get("consent"),
      };

      // Validate required fields
      if (
        !contactData.firstName ||
        !contactData.lastName ||
        !contactData.email ||
        !contactData.phone ||
        !contactData.subject ||
        !contactData.message
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      // Validate email
      if (!window.validateEmail(contactData.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Validate phone number
      if (!window.validatePhone(contactData.phone)) {
        alert("Please enter a valid phone number.");
        return;
      }

      // Validate consent
      if (!contactData.consent) {
        alert(
          "Please consent to the collection and processing of your personal data.",
        );
        return;
      }

      // Add loading state
      const submitButton = this.querySelector('button[type="submit"]');
      addLoadingState(submitButton);

      // Simulate form submission
      setTimeout(() => {
        // In real app, this would be an API call
        console.log("Contact form submitted:", contactData);

        // Show success modal
        showSuccessModal();

        // Reset form
        this.reset();
      }, 2000);
    });

  // Show success modal
  function showSuccessModal() {
    const modal = document.getElementById("successModal");
    modal.classList.add("active");
  }

  // Modal close handlers
  document.getElementById("successModalClose").addEventListener("click", () => {
    document.getElementById("successModal").classList.remove("active");
  });

  document.getElementById("closeSuccessModal").addEventListener("click", () => {
    document.getElementById("successModal").classList.remove("active");
  });

  // Close modal when clicking outside
  document.getElementById("successModal").addEventListener("click", (e) => {
    if (e.target.id === "successModal") {
      document.getElementById("successModal").classList.remove("active");
    }
  });

  // Initialize map (Google Maps would require API key in real implementation)
  function initializeMap() {
    // This is a placeholder for Google Maps initialization
    // In a real application, you would:
    // 1. Load Google Maps API
    // 2. Initialize map with clinic location
    // 3. Add custom markers and info windows

    console.log("Map would be initialized here with Google Maps API");
  }

  // Phone number formatting
  const phoneInput = document.getElementById("contactPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      // Format as +91 XXXXX XXXXX for Indian numbers
      if (value.length >= 10) {
        if (value.startsWith("91")) {
          value = value.substring(2);
        }
        if (value.length === 10) {
          value = `+91 ${value.substring(0, 5)} ${value.substring(5)}`;
        }
      }

      e.target.value = value;
    });
  }

  // Auto-resize textarea
  const messageTextarea = document.getElementById("message");
  if (messageTextarea) {
    messageTextarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
  }

  // Form field validation feedback
  function addFieldValidation() {
    const inputs = document.querySelectorAll(".form-input, .form-select");

    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this);
      });

      input.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          validateField(this);
        }
      });
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Remove existing error styling
    field.classList.remove("error");
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "This field is required";
    }
    // Email validation
    else if (field.type === "email" && value && !window.validateEmail(value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address";
    }
    // Phone validation
    else if (field.type === "tel" && value && !window.validatePhone(value)) {
      isValid = false;
      errorMessage = "Please enter a valid phone number";
    }

    if (!isValid) {
      field.classList.add("error");
      const errorDiv = document.createElement("div");
      errorDiv.className = "field-error";
      errorDiv.textContent = errorMessage;
      errorDiv.style.color = "var(--destructive)";
      errorDiv.style.fontSize = "12px";
      errorDiv.style.marginTop = "4px";
      field.parentNode.appendChild(errorDiv);
    }

    return isValid;
  }

  // Enhanced form submission with better validation
  function enhanceFormValidation() {
    const form = document.getElementById("contactForm");
    const inputs = form.querySelectorAll(".form-input, .form-select");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isFormValid = true;

      // Validate all fields
      inputs.forEach((input) => {
        if (!validateField(input)) {
          isFormValid = false;
        }
      });

      // Validate consent checkbox
      const consentCheckbox = document.getElementById("consent");
      if (!consentCheckbox.checked) {
        isFormValid = false;
        alert(
          "Please consent to the collection and processing of your personal data.",
        );
      }

      if (isFormValid) {
        // Proceed with form submission logic here
        const submitButton = this.querySelector('button[type="submit"]');
        addLoadingState(submitButton);

        setTimeout(() => {
          showSuccessModal();
          this.reset();
        }, 2000);
      } else {
        // Scroll to first error
        const firstError = form.querySelector(".error");
        if (firstError) {
          firstError.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          firstError.focus();
        }
      }
    });
  }

  // Initialize all functionality
  addFieldValidation();
  enhanceFormValidation();
  initializeMap();

  // Add CSS for error styling
  const style = document.createElement("style");
  style.textContent = `
    .form-input.error,
    .form-select.error {
      border-color: var(--destructive);
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
    }
    
    .field-error {
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
});
