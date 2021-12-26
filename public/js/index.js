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
    console.log(entry);
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
