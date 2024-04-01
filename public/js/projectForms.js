const projectForm = document.querySelector('.content-form__form')
const submitBtn = document.querySelector('.content-form__btn')

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
  formData.append('coverImageAltText', coverImageAlt.value);
  formData.append('contributors', contributors.value);
  formData.append('featured', featured.value);
  formData.append('featured_position', featured_position.value);
  formData.append('hidden', hidden.value);

  file = coverImageFile.files[0];
  if (file) formData.append('coverImage', file);

  return formData;
}

if (pathname.startsWith('/projects/update')) {
  let origFormData;
  let submittedFormData;
  let alteredFormData;
  let file;

  window.onload = function() {
    origFormData = parseProjectFormData();
  };

  submitBtn.addEventListener('click', async (e) => {
    try {
      submittedFormData = parseProjectFormData();
      alteredFormData = new FormData();

      for (let [key, value] of submittedFormData.entries()) {
        if (origFormData.get(key) !== value) {
          alteredFormData.append(key, value)
        }
      }

      file = coverImageFile.files[0];
      if (file) {
        alteredFormData.set('coverImage', file);
      }

      const projectId = pathname.split('/')[3];
      const response = await fetch(`/api/v1/projects/${projectId}?frontend=true&name=${nameInput.value}`, {
        method: 'PATCH',
        body: alteredFormData,
      })

      if (response.ok) {
        window.location.replace(`/projects/update/${projectId}`);
      }

    } catch(err) {
      console.error(err);
    }
  })

} else if (pathname.startsWith('/projects/post')) {
  submitBtn.addEventListener('click', async (e) => {
    const newProjectFormData = parseProjectFormData();

    try {
      const response = await fetch('/api/v1/projects?frontend=true', {
        method: 'POST',
        body: newProjectFormData
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
    } catch (err) {
      console.error('Issue with article post operation: ', err);
    }
  });
}
