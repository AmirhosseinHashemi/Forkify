import View from './view.js';

class searchView extends View {
  #parentElement = document.querySelector('.search');

  // receive search input value
  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  // handle submit form event
  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  // clear search input
  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }
}

export default new searchView();
