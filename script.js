// script.js

// Animar sección al hacer scroll (fade in)
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

// Aplica a todas las secciones
document.querySelectorAll('.fade-section').forEach(section => {
  section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-1000');
  observer.observe(section);
});
