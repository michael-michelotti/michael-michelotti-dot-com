const projectForm = document.querySelector('.content-form__form');
const submitBtn = document.querySelector('.content-form__btn');

const nameInput = document.querySelector('#name');
const summary = document.querySelector('#summary');
const detailDescription = document.querySelector('#detailDescription');
const categories = document.querySelector('#categories');
const tags = document.querySelector('#tags');
const techsUsed = document.querySelector('#techsUsed');
const liveLink = document.querySelector('#liveLink');
const githubLink = document.querySelector('#githubLink');
const coverImageFile = document.querySelector('#coverImage');
const coverImageAlt = document.querySelector('#coverImageAlt');
const contributors = document.querySelector('#contributors');
const featured = document.querySelector('#featured');
const featured_position = document.querySelector('#featured_position');
const hidden = document.querySelector('#hidden');

function parseProjectFormData() {
  const formData = new FormData();
  let file;

  formData.append('name', nameInput.value);
  formData.append('summary', summary.value);
  formData.append('detailDescription', detailDescription.value);
  formData.append('categories', categories.value);
  formData.append('tags', tags.value);
  formData.append('techsUsed', techsUsed.value);
  formData.append('liveLink', liveLink.value);
  formData.append('githubLink', githubLink.value);

  file = coverImageFile.files[0];
  if (file) formData.append('coverImage', file);

  formData.append('coverImageAltText', coverImageAlt.value);
  formData.append('contributors', contributors.value);
  formData.append('featured', featured.value);
  formData.append('featured_position', featured_position.value);
  formData.append('hidden', hidden.value);

  return formData;
}

submitBtn.addEventListener('click', async (e) => {
  const projectFormData = parseProjectFormData();

  try {
    const response = await fetch('/api/v1/projects?frontend=true', {
      method: 'POST',
      body: projectFormData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (err) {
    console.error('Issue with article post operation: ', err);
  }
});
