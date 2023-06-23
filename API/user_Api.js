function toggleLoader(loader) {
  loader.classList.toggle('is-hidden');
}

function showLoadMore(loadMore) {
  loadMore.classList.remove('is-hidden');
}
function hideLoadMore(loadMore) {
  loadMore.classList.add('is-hidden');
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
function removeInfo(amountInfo) {
  amountInfo.classList.add('is-hidden');
}

function addInfo(amountInfo) {
  amountInfo.classList.remove('is-hidden');
}

function clearContainer(cardContainer) {
  cardContainer.innerHTML = '';
}
export {
  toggleLoader,
  showLoadMore,
  hideLoadMore,
  showAnim,
  removeInfo,
  addInfo,
  clearContainer,
};
