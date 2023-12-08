import icons from 'url:../../img/icons.svg'; // point to icons file in dist folder

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {object | object[]} data  It recevis recipe objects or array of recipes
   * @param {boolean} render If it is false, then it returns just a markup instead of insert html in the DOM
   * @this {object} View instance
   * @returns {string | undefined} If render is true it returns undefined otherwise a markup string
   * @author Amirhossein Hashemi
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // create new vitual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = newDOM.querySelectorAll('*');

    // current actual DOM
    const currElements = this._parentElement.querySelectorAll('*');

    newElements.forEach((item, i) => {
      if (
        !item.isEqualNode(currElements[i]) &&
        item.firstChild?.nodeValue.trim() !== ''
      ) {
        currElements[i].textContent = item.textContent;
      }

      if (!item.isEqualNode(currElements[i])) {
        Array.from(item.attributes).forEach(att => {
          currElements[i].setAttribute(att.name, att.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // loading animation
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // create html structure of error message
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // create html structure of success message
  renderSuccess(message = this._successMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
