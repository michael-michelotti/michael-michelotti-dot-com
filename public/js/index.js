heroSection = document.querySelector('.hero');
header = document.querySelector('.header');

// SITE SECTIONS
about = document.getElementById('about');
projects = document.getElementById('feat-projects');
articles = document.getElementById('feat-articles');
skills = document.getElementById('skills');
footer = document.getElementById('footer');

// HEADER NAV LINKS
navAbout = document.getElementById('nav-about');
navProjects = document.getElementById('nav-projects');
navArticles = document.getElementById('nav-articles');
navSkills = document.getElementById('nav-skills');
navFooter = document.getElementById('nav-footer');

// Using Intersection Observer API to make header sticky once scrolled below hero section
if (heroSection && header) {
  const makeHeaderSticky = (entries) => {
    header.classList.toggle('sticky-nav', !entries[0].isIntersecting);
  };

  let heroObserver = new IntersectionObserver(makeHeaderSticky, {
    rootMargin: `-${header.offsetHeight}px`,
  });

  heroObserver.observe(heroSection);
}

// Using Intersection Observer to highlight the current section on the header
if (heroSection) {
  const enteringSectionHandler = (entries) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    sectionId = entry.target.id;

    const navLinks = document.querySelectorAll('.header__link');
    navLinks.forEach((link) => {
      if (link.href.split('#').at(-1) == sectionId) {
        link.classList.add('active-nav');
      } else {
        link.classList.remove('active-nav');
      }
    });
  };

  const sectionObserver = new IntersectionObserver(enteringSectionHandler, {
    threshold: 0.5,
  });

  const sections = document.querySelectorAll('section');
  sections.forEach((section) => sectionObserver.observe(section));

  // Handle footer only highlighting when it's 100% in the viewport
  const footerInFrame = (entries) => {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      navFooter.classList.remove('active-nav');
      navSkills.classList.add('active-nav');
      return;
    }

    const navLinks = document.querySelectorAll('.header__link');
    navLinks.forEach((link) => {
      link.classList.remove('active-nav');
    });

    navFooter.classList.add('active-nav');
  };

  const footerObserver = new IntersectionObserver(footerInFrame, {
    threshold: 0.99,
  });

  footerObserver.observe(footer);
}

if (skills) {
  const lazyLoadSkills = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.style = `background: linear-gradient(0, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/img/${entry.target.dataset.src})`;

    entry.target.classList.remove('lazy-img');
    observer.unobserve(entry.target);
  };

  const skillsObserver = new IntersectionObserver(lazyLoadSkills, {
    rootMargin: '500px',
  });

  skillsObserver.observe(skills);
}

if (projects) {
  const loadImg = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.srcset = entry.target.dataset.srcset;

      entry.target.addEventListener('load', function (e) {
        entry.target.classList.remove('lazy-img');
      });

      observer.unobserve(entry.target);
    });
  };

  const imgTargets = document.querySelectorAll('img[data-srcset]');
  const imgObserver = new IntersectionObserver(loadImg, {
    rootMargin: '200px',
  });

  imgTargets.forEach((img) => imgObserver.observe(img));
}
