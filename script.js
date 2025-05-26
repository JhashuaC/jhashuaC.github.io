// Animación al hacer scroll
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

// Botones magnéticos
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.transform = 'translate(0, 0)';
  });
});

// Funciones de modales
function openCertificate(url) {
  const modal = document.getElementById('certModal');
  const frame = document.getElementById('certFrame');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  frame.src = url;
}

function closeCertificate() {
  const modal = document.getElementById('certModal');
  const frame = document.getElementById('certFrame');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
  frame.src = '';
}

document.addEventListener('DOMContentLoaded', () => {
  // Typewriter
  const roles = ['Cybersecurity Enthusiast', 'Backend Developer', 'IoT Hacker', 'REST API Developer'];
  let i = 0, j = 0, isDeleting = false;
  const el = document.getElementById('typewriter');
  let current = '';

  function typeLoop() {
    current = roles[i];
    if (!isDeleting) {
      el.textContent = current.slice(0, j++);
      if (j > current.length + 10) isDeleting = true;
    } else {
      el.textContent = current.slice(0, j--);
      if (j === 0) {
        isDeleting = false;
        i = (i + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 60 : 100);
  }
  typeLoop();

  // Skill bars
  const skillSection = document.querySelector('#skills');
  if (skillSection) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar').forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillObserver.observe(skillSection);
  }

  // Timeline
  const timelineEntries = document.querySelectorAll('.timeline-entry');
  const timelineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-x-10');
        entry.target.classList.add('opacity-100', 'translate-x-0');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  timelineEntries.forEach(entry => {
    timelineObserver.observe(entry);
  });

  // Profile Modal
  const profileImage = document.getElementById('profileImage');
  const imageModal = document.getElementById('imageModal');
  const closeModalBtn = document.getElementById('closeModal');

  if (profileImage && imageModal && closeModalBtn) {
    profileImage.addEventListener('click', () => {
      imageModal.classList.remove('hidden');
      imageModal.classList.add('flex');
    });

    closeModalBtn.addEventListener('click', () => {
      imageModal.classList.remove('flex');
      imageModal.classList.add('hidden');
    });
  }

  // Filtro de certificaciones
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      filterButtons.forEach(btn => {
        btn.classList.remove('bg-teal-400', 'text-gray-900');
        btn.classList.add('bg-gray-700');
      });

      button.classList.remove('bg-gray-700');
      button.classList.add('bg-teal-400', 'text-gray-900');

      projectItems.forEach(item => {
        const match = item.classList.contains(`category-${filter}`);
        if (filter === 'all' || match) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Cargar Credly embed script DESPUÉS de que estén en el DOM
 
 
});
