const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const projectsContent = document.getElementById('projectsContent');
const allProjectRows = document.querySelectorAll('.project-row');
const techDropdownButton = document.querySelector('.checkbox-filter__button');
const techDropdownContent = document.querySelector('.checkbox-filter__content');
const dropdownArrow = document.querySelector('.checkbox-filter__arrow');
const techFilters = document.querySelectorAll('.checkbox-filter__input');

const debouncedSearch = _.debounce(async (event) => {
        const searchQuery = searchInput.value;
        const selectedCategory = categoryFilter.value;
        const selectedTechs = Array.from(techFilters).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

        const data = await fetchSearchResults(searchQuery, selectedCategory, selectedTechs);
        const projectNames = data.data.data.map((project) => project.name);
    
        allProjectRows.forEach((row) => {
            const rowProjectName = row.querySelector('.project-row__name').textContent;
            if (!projectNames.includes(rowProjectName)) {
                hideOrShowProject(row, hideOrShow='hide');
            } else {
                hideOrShowProject(row, hideOrShow='show');
            }
        })
    }, 300);

function hideOrShowProject(row, hideOrShow='hide') {
    let displayStr = hideOrShow === 'hide' ? 'none' : '';

    if (row.nextSibling.classList.contains('row-divider'))
        row.nextSibling.style.display = displayStr;
    row.style.display = displayStr;
}

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
        console.log(techs);
        url += `techsUsed=` + techs.join(',');
    }
    
    console.log(url);
    
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
