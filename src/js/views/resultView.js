import icons from 'url:../../img/icons.svg'; // point to icons file in dist folder
import View from './view.js';

class ResultView extends View {
  _parentElement = document.querySelector('.results');

  // generate one markup as one recipe
  _generateMarkup() {
    return this._data.map(recipe => this._generateMarkupItem(recipe)).join('');
  }

  _generateMarkupItem(recipe) {
    return `
        <li class="preview">
            <a class="preview__link" href=#${recipe.id}>
            <figure class="preview__fig">
                <img src=${recipe.image} alt=${recipe.title} />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
            </div>
            </a>
        </li>
    `;
  }
}

export default new ResultView();
