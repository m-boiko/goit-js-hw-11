import Notiflix from 'notiflix';
import NewApiImageService from './search';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';

const formEl = document.querySelector('.search-form');
const divEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let isShown = 0;

const ImageCard = new NewApiImageService();

formEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(e) {
  e.preventDefault();
  isShown = 0;
  divEl.innerHTML = '';
  ImageCard.resetPage();
  ImageCard.query = e.target.elements.searchQuery.value.trim();
  fetchImages();
}

function onLoadMore() {
  ImageCard.incrementPage();
  fetchImages();
}

async function fetchImages() {
  loadMoreBtn.classList.add('is-hidden');

  const response = await ImageCard.fetchImage();
  const { hits, total } = response;

  if (!hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  renderGallery(hits);

  isShown += hits.length;

  if (isShown < total) {
    loadMoreBtn.classList.remove('is-hidden');
  }
  if (isShown >= total) {
    Notiflix.Notify.info(
      `We are sorry, but you have reached the end of search results.`
    );
  }
}

function renderGallery(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
            <a class="gallery__link" href="${largeImageURL}">
                <div class="photo-card">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${downloads}
                        </p>
                    </div>
                </div>
            </a>
        `;
      }
    )
    .join('');

  divEl.insertAdjacentHTML('beforeend', markup);
  const simpleLightBox = new SimpleLightbox('.gallery a');
}
