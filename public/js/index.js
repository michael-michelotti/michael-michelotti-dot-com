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
      let screenBotToTop =
        entry.boundingClientRect.top - entry.rootBounds.height;
      // console.log(entry);
      if (
        entry.isIntersecting === false &&
        entry.boundingClientRect.bottom <= 0
      ) {
        leavingSection = entry.target;
        nextSection = leavingSection.nextElementSibling;

        // hero section doesn't have a navigation element
        if (leavingSection.id != 'hero') {
          leavingSectionNav = document.querySelector(
            `[href="#${leavingSection.id}"]`
          );
          leavingSectionNav.classList.remove('active-nav');
        }

        nextSectionNav = document.querySelector(`[href="#${nextSection.id}"]`);
        nextSectionNav.classList.add('active-nav');
      } else if (screenBotToTop >= 0 && screenBotToTop <= 100) {
        leavingSection = entry.target;
        nextSection = leavingSection.previousElementSibling;
        console.log(`leaving section ${leavingSection.id}`);
        leavingSectionNav = document.querySelector(
          `[href="#${leavingSection.id}"]`
        );
        leavingSectionNav.classList.remove('active-nav');

        if (nextSection.id != 'hero') {
          nextSectionNav = document.querySelector(
            `[href="#${nextSection.id}"]`
          );
          nextSectionNav.classList.add('active-nav');
        }
      }
    });
  });

  [heroSection, about, projects, articles, skills, contact].forEach(
    (section) => {
      sectionObserver.observe(section);
    }
  );
}
