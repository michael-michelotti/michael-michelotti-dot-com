const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const projectsContent = document.getElementById('projectsContent');
const allProjectCards = document.querySelectorAll('.project-card');
const techDropdownButton = document.querySelector('.checkbox-filter__button');
const techDropdownContent = document.querySelector('.checkbox-filter__content');
const dropdownArrow = document.querySelector('.checkbox-filter__arrow');
const techFilters = document.querySelectorAll('.checkbox-filter__input');

const debouncedSearch = _.debounce(async (event) => {
        const searchQuery = searchInput.value;
        const selectedCategory = categoryFilter.value;
        const selectedTechs = Array.from(techFilters).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

        const data = await fetchSearchResults(searchQuery, selectedCategory, selectedTechs);
        const projects = data.data.data;
        const remainingTechs = projects.flatMap((project) => project.techsUsed);
        const uniqueRemainingTechs = [...new Set(remainingTechs)];
        const projectNames = projects.map((project) => project.name);
    
        // Gray out any techs used that no remaining projects use
        let siblingSpan;
        techFilters.forEach((checkbox) => {
            siblingSpan = checkbox.previousElementSibling;
            if (!uniqueRemainingTechs.includes(checkbox.value)) {
                checkbox.disabled = true;
                siblingSpan.classList.add('disabled-text');
            } else {
                checkbox.disabled = false;
                siblingSpan.classList.remove('disabled-text');
            }
        })

        allProjectCards.forEach((card) => {
            const cardProjectName = card.querySelector('.project-card__name').textContent;
            if (!projectNames.includes(cardProjectName)) {
                card.style.display = 'none';
            } else {
                card.style.display = '';
            }
        })
    }, 300);


searchInput.addEventListener('input', debouncedSearch);
categoryFilter.addEventListener('change', debouncedSearch);
techFilters.forEach(checkbox => checkbox.addEventListener('change', debouncedSearch));

async function fetchSearchResults(query, category, techs) {
    let url = 'api/v1/projects/?'

    if (query.length >= 1)
        url += `search[index]=default&search[autocomplete][query]=${encodeURIComponent(query)}&search[autocomplete][path]=name&`;

    if (category.length !== 0)
        url += `categories=${category}&`

    if (techs.length !== 0) {
        url += `techsUsed=` + techs.join(',');
    }
    
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error while filtering: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Could not fetch data: ", err);
    }
}

techDropdownButton.addEventListener('click', (event) => {
    if (techDropdownContent.style.display === 'block') {
        techDropdownContent.style.display = 'none';
    }
    else {
        techDropdownContent.style.display = 'block';
    }

    event.stopPropagation();
})

window.addEventListener('click', (event) => {
    const withinDropdown = event.target.closest('.checkbox-filter__content');
    const clickedButton = event.target.closest('.checkbox-filter__button');

    if (!withinDropdown && !clickedButton) {
        techDropdownContent.style.display = 'none';
    }
})
