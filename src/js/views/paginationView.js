import icons from 'url:../../img/icons.svg'; // point to icons file in dist folder
import View from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btnClicked = e.target.closest('.btn--inline');
      if (!btnClicked) return;

      const goTo = +btnClicked.dataset.goto;
      handler(goTo);
    });
  }

  _generateMarkup() {
    // compute number of pages we can have
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    const currentPage = this._data.page;

    // diffrent scenarioes for pagination :
    // at first page
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next', currentPage + 1);
    }

    // at last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev', currentPage - 1);
    }

    // at middle page
    if (currentPage < numPages) {
      return `${this._generateMarkupButton(
        'next',
        currentPage + 1
      )}${this._generateMarkupButton('prev', currentPage - 1)}`;
    }

    // we have only one page - for some recipes
    return '';
  }

  _generateMarkupButton(className, number) {
    return `
        <button data-goTo="${number}" class="btn--inline pagination__btn--${className}">
         <svg class="search__icon">
            <use href="${icons}#icon-arrow-
            ${className === 'prev' ? 'left' : 'right'}"></use>
         </svg>
         <span>Page ${number}</span>
        </button>`;
  }
}

export default new PaginationView();
