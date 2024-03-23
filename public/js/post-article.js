const articleForm = document.querySelector('.post-article__form')
const submitBtn = document.querySelector('.post-article__btn')

const titleInput = document.querySelector('input#name');
const summaryPoints = document.querySelector('textarea#summaryPoints');
const articleBodyFile = document.querySelector('input#body');
const categories = document.querySelector('textarea#categories');
const authors = document.querySelector('textarea#authors');

submitBtn.addEventListener('click', async (e) => {
  let articleBody = {};

  articleBody.name = titleInput.value;
  articleBody.summaryPoints = summaryPoints.value.split('\n');
  articleBody.categories = categories.value.split('\n');
  articleBody.authors = authors.value.split('\n');

  file = articleBodyFile.files[0];
  if (file) {
    try {
      articleBody.body = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  try {
    const response = await fetch('/api/v1/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(articleBody)
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

  } catch (err) {
    console.error('Issue with article post operation: ', err);
  }
})
