const articleForm = document.querySelector('.content-form__form')
const submitBtn = document.querySelector('.content-form__btn')

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

const pathname = window.location.pathname;

function parseArticleFormData() {
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

  return formData;
}

if (pathname.startsWith('/articles/update')) {
  let origFormData;
  let submittedFormData;
  let patchBodyObj;
  let file;

  window.onload = function() {
    origFormData = parseArticleFormData();
  };

  submitBtn.addEventListener('click', async (e) => {
    try {
      submittedFormData = parseArticleFormData();
      patchBodyObj = new FormData();
      for (let [key, value] of submittedFormData.entries()) {
        if (origFormData.get(key) !== value) {
          patchBodyObj.append(key, value)
        }
      }

      file = articleBodyFile.files[0];
      if (file) {
        patchBodyObj.set('body', file);
      }

      file = cardImageFile.files[0];
      if (file) {
        patchBodyObj.set('cardImage', file);
      }

      file = coverImageFile.files[0];
      if (file) {
        patchBodyObj.set('coverImage', file);
      }

      const articleId = pathname.split('/')[3];
      const response = await fetch(`/api/v1/articles/${articleId}?frontend=true&name=${titleInput.value}`, {
        method: 'PATCH',
        body: patchBodyObj,
      })

      if (response.ok) {
        window.location.replace(`/articles/update/${articleId}`);
      }

    } catch(err) {
      console.error(err);
    }
  })


} else if (window.location.pathname.startsWith('/articles/post')) {

  submitBtn.addEventListener('click', async (e) => {
    try {
      const response = await fetch('/api/v1/articles?frontend=true', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      if (response.ok) {
        window.location.replace(`/articles`)
      }
      
    } catch (err) {
      console.error('Issue with article post operation: ', err);
    }
  });
}
