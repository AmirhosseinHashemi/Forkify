import View from './view.js';
import PreviewView from './previewView.js';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Recipes not found :(\nPlease try another one.';

  // generate one markup as one recipe
  _generateMarkup() {
    return this._data.map(recipe => PreviewView.render(recipe, false)).join('');
  }
}

export default new ResultView();
