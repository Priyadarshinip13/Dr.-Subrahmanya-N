// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
    });

    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !mobileMenuBtn.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        mobileMenu.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
      }
    });
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Button click handlers
  const bookingButtons = document.querySelectorAll(".btn-primary, .btn-cta");
  bookingButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // In a real application, this would integrate with a booking system
      alert(
        "Booking system will be integrated here. For now, please call +91 98765 43210 to book your consultation.",
      );
    });
  });

  const callButtons = document.querySelectorAll(".btn-secondary");
  callButtons.forEach((button) => {
    if (button.textContent.includes("Call")) {
      button.addEventListener("click", function () {
        window.location.href = "tel:+919876543210";
      });
    }
  });

  // Add scroll effect to header
  let lastScrollTop = 0;
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });

  // Add CSS for header transition
  header.style.transition = "transform 0.3s ease-in-out";

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe feature cards
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  // Add floating animation to floating cards
  const floatingCards = document.querySelectorAll(".floating-card");
  floatingCards.forEach((card, index) => {
    card.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
  });

  // Add CSS for floating animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
  document.head.appendChild(style);

  // Form validation (if forms are added later)
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ""));
  }

  // Expose validation functions globally for future use
  window.validateEmail = validateEmail;
  window.validatePhone = validatePhone;

  // Add loading states to buttons
  function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML =
      '<span style="margin-right: 8px;">⏳</span>Processing...';
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 2000);
  }

  // Make addLoadingState available globally
  window.addLoadingState = addLoadingState;
});

// Handle window resize
window.addEventListener("resize", function () {
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  if (window.innerWidth > 768) {
    mobileMenu.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
  }
});

// Add performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function () {
  // Any scroll-based animations or effects
}, 10);

window.addEventListener("scroll", optimizedScrollHandler);
