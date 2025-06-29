// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Close mobile menu if open
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
});

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "none";
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.01, // Trigger when 10% of the element is visible
  rootMargin: "0px 0px 150px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener("DOMContentLoaded", () => {
  const elementsToAnimate = document.querySelectorAll(
    ".hero-content, .stat-item, .about-item, .benefit-item, .contact-info, .contact-form"
  );

  elementsToAnimate.forEach((el, index) => {
    el.classList.add("fade-in");
    if (el.classList.contains("about-item")) {
      el.style.transitionDelay = `${0.1}ms`;
    } else {
      el.style.transitionDelay = `${index * 0.1}s`;
    }
    observer.observe(el);
  });
});

// Form handling
const contactForm = document.getElementById("contactForm");
const submitButton = contactForm.querySelector('button[type="submit"]');

// Phone number formatting
const phoneInput = document.getElementById("telefone");
phoneInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length <= 11) {
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d)/, "($1) $2");
    }
  }

  e.target.value = value;
});

// Form validation
function validateForm(formData) {
  const errors = [];

  // Required fields validation
  const requiredFields = [
    "nome",
    "telefone",
    "email",
    "propriedade",
    "cidade",
    "estado",
    "area",
    "cultura",
    "energia",
  ];

  requiredFields.forEach((field) => {
    if (!formData.get(field) || formData.get(field).trim() === "") {
      errors.push(`O campo ${getFieldLabel(field)} é obrigatório.`);
    }
  });

  // Email validation
  const email = formData.get("email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push("Por favor, insira um e-mail válido.");
  }

  // Phone validation
  const phone = formData.get("telefone").replace(/\D/g, "");
  if (phone && (phone.length < 10 || phone.length > 11)) {
    errors.push("Por favor, insira um telefone válido.");
  }

  // Area validation
  const area = parseFloat(formData.get("area"));
  if (isNaN(area) || area <= 0) {
    errors.push("Por favor, insira uma área válida.");
  }

  return errors;
}

function getFieldLabel(fieldName) {
  const labels = {
    nome: "Nome completo",
    telefone: "Telefone",
    email: "E-mail",
    propriedade: "Nome da propriedade",
    cidade: "Cidade",
    estado: "Estado",
    area: "Área da propriedade",
    cultura: "Principal cultura",
    energia: "Gasto com energia",
  };
  return labels[fieldName] || fieldName;
}

function showSuccessMessage() {
  // Remove existing success message
  const existingMessage = contactForm.querySelector(".success-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create and show success message
  const successMessage = document.createElement("div");
  successMessage.className = "success-message show";
  successMessage.innerHTML = `
    <strong>✅ Formulário enviado com sucesso!</strong><br>
    Nossa equipe entrará em contato em até 24 horas. Obrigado pelo interesse!
  `;

  contactForm.insertBefore(successMessage, contactForm.firstChild);

  // Scroll to message
  successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

  // Hide message after 8 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
    setTimeout(() => successMessage.remove(), 300);
  }, 8000);
}

function showErrorMessage(errors) {
  // Remove existing error message
  const existingMessage = contactForm.querySelector(".error-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create and show error message
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.style.cssText = `
    background: #fef2f2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid #fecaca;
  `;
  errorMessage.innerHTML = `
    <strong>⚠️ Por favor, corrija os seguintes erros:</strong><br>
    ${errors.map((error) => `• ${error}`).join("<br>")}
  `;

  contactForm.insertBefore(errorMessage, contactForm.firstChild);
  errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });

  // Hide message after 6 seconds
  setTimeout(() => {
    if (errorMessage.parentNode) {
      errorMessage.remove();
    }
  }, 6000);
}

// Form submission
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);

  // Validate form
  const errors = validateForm(formData);
  if (errors.length > 0) {
    showErrorMessage(errors);
    return;
  }

  // Show loading state
  submitButton.classList.add("loading");
  contactForm.classList.add("form-loading");

  try {
    // Simulate API call (replace with your actual endpoint)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Log form data (for development)
    console.log("Form Data Submitted:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Show success message
    showSuccessMessage();

    // Reset form
    contactForm.reset();

    // Analytics tracking (replace with your tracking code)
    if (typeof gtag !== "undefined") {
      gtag("event", "form_submission", {
        event_category: "engagement",
        event_label: "contact_form",
      });
    }
  } catch (error) {
    console.error("Form submission error:", error);
    showErrorMessage([
      "Ocorreu um erro ao enviar o formulário. Tente novamente em alguns minutos.",
    ]);
  } finally {
    // Remove loading state
    submitButton.classList.remove("loading");
    contactForm.classList.remove("form-loading");
  }
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    // Format number based on target and content
    let displayValue;
    const originalText =
      element.getAttribute("data-original") || element.textContent;

    if (originalText.includes("Até")) {
      displayValue = `Até ${Math.floor(current)}%`;
    } else if (originalText.includes("%")) {
      displayValue = `${Math.floor(current)}%`;
    } else if (originalText.includes("h")) {
      displayValue = `${Math.floor(current)}h`;
    } else {
      displayValue = Math.floor(current);
    }

    element.textContent = displayValue;
  }, 16);
}

// Initialize counter animations when stats section is visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const text = stat.textContent;
          stat.setAttribute("data-original", text);
          let target;

          if (text.includes("Até 70%")) {
            target = 70;
            stat.textContent = "Até 0%";
          } else if (text.includes("100%")) {
            target = 100;
            stat.textContent = "0%";
          } else if (text.includes("0%")) {
            target = 0;
            stat.textContent = "100%"; // Start from 100 and go down to 0
          } else if (text.includes("24h")) {
            target = 24;
            stat.textContent = "0h";
          } else {
            target = parseInt(text.replace(/\D/g, ""));
          }

          if (!isNaN(target)) {
            setTimeout(() => animateCounter(stat, target), 200);
          }
        });

        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

// Observe stats section
document.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
});

// Lazy loading for images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img").forEach((img) => {
    img.classList.add("lazy");
    imageObserver.observe(img);
  });
}

// Add CSS for lazy loading
const style = document.createElement("style");
style.textContent = `
  img.lazy {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  img.lazy.loaded {
    opacity: 1;
  }
  
  .nav-menu.active {
    display: flex;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-top: 1px solid var(--gray-200);
  }
  
  .nav-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .nav-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  
  .nav-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
`;
document.head.appendChild(style);
