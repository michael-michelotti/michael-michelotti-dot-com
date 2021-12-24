heroSection = document.querySelector('.hero');
header = document.querySelector('.header');

// SITE SECTIONS
about = document.getElementById('about');
projects = document.getElementById('feat-projects');
articles = document.getElementById('feat-articles');
skills = document.getElementById('skills');
contact = document.getElementById('footer');

// HEADER NAV LINKS
navAbout = document.getElementById('nav-about');
navProjects = document.getElementById('nav-projects');
navArticles = document.getElementById('nav-articles');
navSkills = document.getElementById('nav-skills');
navFooter = document.getElementById('nav-footer');

if (heroSection && header) {
  let heroObserver = new IntersectionObserver(
    (entries) => {
      header.classList.toggle('sticky-nav', !entries[0].isIntersecting);
    },
    {
      threshold: 0.01,
    }
  );

  heroObserver.observe(heroSection);
}

if (heroSection) {
  let sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.boundingClientRect.bottom >= 0) return;
      console.log(entry);
      //
      if (entry.isIntersecting) return;
      sectionId = entry.target.id;
      switch (sectionId) {
        case 'hero':
          navAbout.classList.add('active-nav');
          break;
        case 'about':
          navAbout.classList.remove('active-nav');
          navProjects.classList.add('active-nav');
          break;
        case 'feat-projects':
          navProjects.classList.remove('active-nav');
          navArticles.classList.add('active-nav');
          break;
        case 'feat-articles':
          navArticles.classList.remove('active-nav');
          navSkills.classList.add('active-nav');
          break;
      }
    });
  });

  [heroSection, about, projects, articles, skills, contact].forEach(
    (section) => {
      sectionObserver.observe(section);
    }
  );
}
