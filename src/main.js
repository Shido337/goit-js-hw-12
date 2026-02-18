import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;
form.addEventListener('submit', async event => {
  event.preventDefault();
  query = form.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term',
    });
    return;
  }

  clearGallery();
  page = 1;
  hideLoadMoreButton();
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;
    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      setTimeout(() => {
        createGallery(data.hits);
        showLoadMoreButton();
        hideLoader();
      }, 1000);
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Try again later.',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, page);

    setTimeout(() => {
      createGallery(data.hits);
      const { height } = document
        .querySelector('.gallery-item')
        .getBoundingClientRect();
      window.scrollBy({ top: height * 2, behavior: 'smooth' });
      showLoadMoreButton();
      hideLoader();
    }, 1000);

    if (page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search result.",
      });
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong.' });
  } finally {
    // hideLoader теперь вызывается после показа галереи
  }
});
