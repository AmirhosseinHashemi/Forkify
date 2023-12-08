import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Your recipe successfully added :)';

  _btnOpenModal = document.querySelector('.nav__btn--add-recipe');
  _btnCloseModal = document.querySelector('.btn--close-modal');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');

  constructor() {
    super();
    this.addHandlerCloseModal();
    this.addHandlerShowModal();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addHandlerShowModal() {
    this._btnOpenModal.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerCloseModal() {
    this._btnCloseModal.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerAddRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // destructure data from api into array
      const dataArr = [...new FormData(this)];

      // conver array of data into an object
      const dataObj = Object.fromEntries(dataArr);

      handler(dataObj);
    });
  }
}

export default new AddRecipeView();
