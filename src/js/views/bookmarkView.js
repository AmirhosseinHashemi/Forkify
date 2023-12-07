import View from './view.js';
import PreviewView from './previewView.js';

class BookMarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarked yet. Select a recipe you like ;)';

  // generate one markup as one recipe
  _generateMarkup() {
    return this._data.map(recipe => PreviewView.render(recipe, false)).join('');
  }

  addHandlerBookmark(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookMarkView();
