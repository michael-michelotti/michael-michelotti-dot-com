const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const allArticleCards = document.querySelectorAll('.article-card');
const allDividers = document.querySelectorAll('.row-divider');

const debouncedSearch = _.debounce(async (event) => {
    const searchQuery = searchInput.value;
    const selectedCategory = categoryFilter.value;

    const data = await fetchSearchResults(searchQuery, selectedCategory);
    const articles = data.data.data;
    const articleNames = articles.map((article) => article.name);

    allArticleCards.forEach((card, i) => {
        const cardArticleName = card.querySelector('.article-card__name').textContent;
        if (!articleNames.includes(cardArticleName)) {
            card.style.display = 'none';
            if (allDividers[i]) allDividers[i].style.display = 'none';
        } else {
            card.style.display = '';
            if (allDividers[i]) allDividers[i].style.display = '';
        }
    });
}, 300);

searchInput.addEventListener('input', debouncedSearch);
categoryFilter.addEventListener('change', debouncedSearch);

async function fetchSearchResults(query, category) {
    let url = 'api/v1/articles/?';

    if (query.length >= 1)
        url += `search=${encodeURIComponent(query)}&`;

    if (category.length !== 0)
        url += `categories=${category}&`;

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
