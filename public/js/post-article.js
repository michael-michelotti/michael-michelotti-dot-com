const articleForm = document.querySelector('.post-article__form')
const submitBtn = document.querySelector('.post-article__btn')

const titleInput = document.querySelector('input#name');
const summaryPoints = document.querySelector('textarea#summaryPoints');
const articleBodyFile = document.querySelector('input#body');
const categories = document.querySelector('textarea#categories');
const tags = document.querySelector('textarea#tags');
const cardImageFile = document.querySelector('input#cardImage');
const cardImageAlt = document.querySelector('input#cardImageAlt');
const coverImageFile = document.querySelector('input#coverImage');
const coverImageAlt = document.querySelector('input#coverImageAlt');
const coverImageCaption = document.querySelector('input#coverImageCaption');
const authors = document.querySelector('textarea#authors');
const featured = document.querySelector('#featured');
const hidden = document.querySelector('#hidden');

submitBtn.addEventListener('click', async (e) => {
  const formData = new FormData();
  let file;

  formData.append('name', titleInput.value);
  formData.append('summaryPoints', summaryPoints.value);
  
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
