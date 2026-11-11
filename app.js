/**
 * DUS - DOCUMENTO UNIFICADO DE SAÚDE | INTERATIVIDADE & RESPONSIVIDADE
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. MENU MOBILE COM ANIMAÇÃO E FECHAMENTO INTELIGENTE
  // =========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle('open');
      const isExpanded = mobileNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Fechar ao clicar em qualquer link da gaveta
    mobileNav.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });

    // Fechar ao clicar fora da gaveta
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  }

  // =========================================================================
  // 2. SCROLL SUAVE & HEADER ATIVO
  // =========================================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // =========================================================================
  // 3. STEPPER & CARROSSEL RESPONSIVO (COMPUTADOR & CELULAR)
  // =========================================================================
  const stepNodes = document.querySelectorAll('.step-node');
  const screenCards = document.querySelectorAll('.phone-screen-card');
  const screenHolders = document.querySelectorAll('.screen-card-holder');
  const screensGrid = document.getElementById('stepsScreensGrid');
  const carouselDots = document.querySelectorAll('.mobile-carousel-dots .dot');

  function setActiveStep(index) {
    // Atualiza Stepper Nodes
    stepNodes.forEach((node, i) => {
      if (i === index) {
        node.classList.add('active');
        const pill = node.querySelector('.step-pill-label');
        if (pill) {
          pill.style.background = '#0F172A';
          pill.style.color = '#FFFFFF';
        }
      } else {
        node.classList.remove('active');
        const pill = node.querySelector('.step-pill-label');
        if (pill) {
          pill.style.background = '#FFFFFF';
          pill.style.color = '#0F172A';
        }
      }
    });

    // Atualiza Destaque dos Mockups
    screenCards.forEach((card, i) => {
      if (i === index) {
        card.style.transform = window.innerWidth > 768 ? 'translateY(-12px) scale(1.03)' : 'none';
        card.style.borderColor = '#00A5BA';
        card.style.boxShadow = '0 25px 45px rgba(0, 165, 186, 0.35)';
      } else {
        card.style.transform = 'none';
        card.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.25)';
      }
    });

    // Atualiza Dots do Carrossel Mobile
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Em telas mobile, rola o carrossel horizontal até a tela ativa
    if (screensGrid && screenHolders[index] && window.innerWidth <= 768) {
      const holder = screenHolders[index];
      const scrollPosition = holder.offsetLeft - screensGrid.offsetLeft - (screensGrid.clientWidth - holder.clientWidth) / 2;
      screensGrid.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }

  // Clique nos nós do Stepper
  stepNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      setActiveStep(index);
    });
  });

  // Clique nos Dots do Carrossel
  carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      setActiveStep(index);
    });
  });

  // Listener de Scroll no Carrossel Mobile para sincronizar Stepper e Dots
  if (screensGrid) {
    let scrollTimeout;
    screensGrid.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = screensGrid.scrollLeft;
        const gridWidth = screensGrid.clientWidth;
        let closestIndex = 0;
        let minDiff = Infinity;

        screenHolders.forEach((holder, index) => {
          const holderCenter = holder.offsetLeft - screensGrid.offsetLeft + holder.clientWidth / 2;
          const viewportCenter = scrollLeft + gridWidth / 2;
          const diff = Math.abs(holderCenter - viewportCenter);

          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = index;
          }
        });

        // Atualiza estado sem acionar scroll recursivo
        stepNodes.forEach((node, i) => {
          node.classList.toggle('active', i === closestIndex);
          const pill = node.querySelector('.step-pill-label');
          if (pill) {
            pill.style.background = i === closestIndex ? '#0F172A' : '#FFFFFF';
            pill.style.color = i === closestIndex ? '#FFFFFF' : '#0F172A';
          }
        });

        carouselDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === closestIndex);
        });
      }, 60);
    }, { passive: true });
  }

  // Inicializa o primeiro passo como ativo
  setActiveStep(0);
});
