import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SmoothScroll from 'smoothscroll-for-websites';

import imgApi from '../API/img_API';
import * as userApi from '../API/user_Api';
import * as renderApi from '../API/render_Api';

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
    userApi.removeInfo(refs.amountInfo);
    userApi.clearContainer(refs.cardContainer);
    userApi.hideLoadMore(refs.loadMore);

    if (e.currentTarget.elements.searchQuery.value === '') {
      Notiflix.Notify.warning('Type something in the search box');
      return;
    }

    cardsApi.query = e.currentTarget.elements.searchQuery.value;

    cardsApi.resetPage();

    userApi.toggleLoader(refs.loader);

    const cards = await cardsApi.fetchImgs();
    if (cards.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${cards.totalHits} images.`);
    }

    if (cards.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      userApi.toggleLoader(refs.loader);
      return;
    }

    setPageLimit(cards);

    const markup = renderApi.takeMarkup(cards.hits);
    renderApi.renderCards(markup, refs.cardContainer);

    gallery.refresh();

    userApi.showAnim();

    userApi.toggleLoader(refs.loader);

    if (pages >= cardsApi.page) {
      userApi.showLoadMore(refs.loadMore);
    }

    if (pages < cardsApi.page) {
      userApi.addInfo(refs.amountInfo);
    }
  } catch (error) {
    userApi.toggleLoader(refs.loader);

    return console.log(error);
  }
}

async function onLoadMore() {
  try {
    userApi.toggleLoader(refs.loader);
    userApi.hideLoadMore(refs.loadMore);

    if (pages <= cardsApi.page) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results. :("
      );

      userApi.hideLoadMore(refs.loadMore);
      userApi.toggleLoader(refs.loader);
      const cards = await cardsApi.fetchImgs();

      const markup = renderApi.takeMarkup(cards.hits);
      renderApi.renderCards(markup, refs.cardContainer);
      gallery.refresh();
      userApi.showAnim();
      userApi.addInfo(refs.amountInfo);
      return;
    }

    const cards = await cardsApi.fetchImgs();

    const markup = renderApi.takeMarkup(cards.hits);
    renderApi.renderCards(markup, refs.cardContainer);

    gallery.refresh();

    userApi.showAnim();

    userApi.toggleLoader(refs.loader);

    userApi.showLoadMore(refs.loadMore);
  } catch (error) {
    userApi.toggleLoader(refs.loader);
    console.log(error);
  }
}

function setPageLimit({ totalHits }) {
  pages = Math.ceil(totalHits / 40);
}
