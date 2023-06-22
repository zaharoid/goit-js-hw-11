import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SmoothScroll from 'smoothscroll-for-websites';

import imgApi from '../API/img_API';

const refs = {
  form: document.querySelector('#search-form'),
  cardContainer: document.querySelector('.gallery'),
  input: document.querySelector('.form-input'),
  loadMore: document.querySelector('.load-more'),
  loader: document.querySelector('.loader'),
  amountInfo: document.querySelector('.amount-info'),
};

const cardsApi = new imgApi();

SmoothScroll({ stepSize: 50, animationTime: 800 });

let pages = 0;

let gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

refs.form.addEventListener('submit', onSubmitForm);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSubmitForm(e) {
  e.preventDefault();

  try {
    removeInfo();
    clearContainer();
    hideLoadMore();

    if (e.currentTarget.elements.searchQuery.value === '') {
      Notiflix.Notify.warning('Type something in the search box');
      return;
    }

    cardsApi.query = e.currentTarget.elements.searchQuery.value;

    cardsApi.resetPage();

    toggleLoader();

    const cards = await cardsApi.fetchImgs();
    if (cards.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${cards.totalHits} images.`);
    }

    if (cards.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      toggleLoader();
      return;
    }

    setPageLimit(cards);

    const markup = takeMarkup(cards.hits);
    renderCards(markup);

    gallery.refresh();

    showAnim();

    toggleLoader();

    if (pages >= cardsApi.page) {
      showLoadMore();
    }
    console.log(pages);
    console.log(cardsApi.page);
    if (pages < cardsApi.page) {
      addInfo();
    }
  } catch (error) {
    toggleLoader();

    return console.log(error);
  }
}

async function onLoadMore() {
  try {
    toggleLoader();
    hideLoadMore();

    if (pages <= cardsApi.page) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results. :("
      );

      hideLoadMore();
      toggleLoader();
      const cards = await cardsApi.fetchImgs();

      const markup = takeMarkup(cards.hits);
      renderCards(markup);
      showAnim();
      addInfo();
      return;
    }

    const cards = await cardsApi.fetchImgs();

    const markup = takeMarkup(cards.hits);
    renderCards(markup);

    gallery.refresh();

    showAnim();

    toggleLoader();

    showLoadMore();
  } catch (error) {
    toggleLoader();
    console.log(error);
  }
}

function takeMarkup(cards) {
  const markup = cards
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
        return `<a class="gallery-item" href="${largeImageURL}">
        <img
          class="gallery__image"
          src="${webformatURL}"
          title="${tags}"
          width="325"
          height="220"
          loading="lazy"
        />
        <div class="info">
          <div class="info-item">
            
              <b class="info-title">Likes</b>
              <p class="info-text">${likes}</p>
            
          </div>
          <div class="info-item">
            
              <b class="info-title">Views</b>
              <p class="info-text">${views}</p>
            
          </div>
          <div class="info-item">
            
              <b class="info-title">Comments</b>
              <p class="info-text">${comments}</p>
            
          </div>
          <div class="info-item">
            
              <b class="info-title">Downloads</b>
              <p class="info-text">${downloads}</p>
            
          </div>
        </div>
      </a>`;
      }
    )
    .join('');
  return markup;
}

function renderCards(markup) {
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
}

function clearContainer() {
  refs.cardContainer.innerHTML = '';
}

function setPageLimit({ totalHits }) {
  pages = Math.ceil(totalHits / 40);
}

function toggleLoader() {
  refs.loader.classList.toggle('is-hidden');
}

function showLoadMore() {
  refs.loadMore.classList.remove('is-hidden');
}
function hideLoadMore() {
  refs.loadMore.classList.add('is-hidden');
}

function showAnim() {
  const cards = document.querySelectorAll('.gallery-item');
  cards.forEach(card => {
    const cardHeight = card.offsetHeight;

    const cardOffset = getElementOffset(card).top;

    const animStart = 4;
    let animPoint = window.innerHeight - cardHeight / animStart;

    if (
      window.scrollY > cardOffset - animPoint &&
      window.scrollY < cardOffset + cardHeight
    ) {
      card.classList.add('is-active');
    } else {
      card.classList.add('is-active');
    }
  });
}

function getElementOffset(el) {
  let top = 0;
  let left = 0;
  let element = el;

  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    top,
    left,
  };
}
function removeInfo() {
  refs.amountInfo.classList.add('is-hidden');
}

function addInfo() {
  refs.amountInfo.classList.remove('is-hidden');
}
