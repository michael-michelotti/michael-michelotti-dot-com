const articleForm = document.querySelector('.post-article__form')
const submitBtn = document.querySelector('.post-article__btn')

const titleInput = document.querySelector('#name');
const summaryPoints = document.querySelector('#summaryPoints');
const articleBodyFile = document.querySelector('#body');
const categories = document.querySelector('#categories');
const tags = document.querySelector('#tags');
const cardImageFile = document.querySelector('#cardImage');
const cardImageAlt = document.querySelector('#cardImageAlt');
const coverImageFile = document.querySelector('#coverImage');
const coverImageAlt = document.querySelector('#coverImageAlt');
const coverImageCaption = document.querySelector('#coverImageCaption');
const authors = document.querySelector('#authors');
const featured = document.querySelector('#featured');
const hidden = document.querySelector('#hidden');

submitBtn.addEventListener('click', async (e) => {
  const formData = new FormData();
  let file;

  formData.append('name', nameInput.value);
  formData.append('summaryPoints', summary.value);
  
  file = articleBodyFile.files[0];
  if (file) formData.append('body', file);

  formData.append('categories', categories.value);
  formData.append('tags', tags.value);

  file = cardImageFile.files[0];
  if (file) formData.append('cardImage', file);

  formData.append('cardImageAltText', cardImageAlt.value);

  file = coverImageFile.files[0];
  if (file) formData.append('coverImage', file);

  formData.append('coverImageAltText', coverImageAlt.value);
  formData.append('coverImageCaption', coverImageCaption.value);
  formData.append('authors', authors.value);
  formData.append('featured', featured.value);
  formData.append('hidden', hidden.value);

  try {
    const response = await fetch('/api/v1/articles?frontend=true', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (err) {
    console.error('Issue with article post operation: ', err);
  }
});
