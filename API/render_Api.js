function renderCards(markup, cardContainer) {
  cardContainer.insertAdjacentHTML('beforeend', markup);
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

export { renderCards, takeMarkup };
