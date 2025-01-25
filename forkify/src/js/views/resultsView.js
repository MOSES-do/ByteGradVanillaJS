import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';



class ResultsView extends View {
    // It sets the parentElement in View to _parentElement
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query! Please try again';
    _successMessage = '';


    _generateMarkup() {
        // return this._data.map(result => this._generateMarkupPreview(result)).join('')
        // same as below
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
        //NOTE: PreviewView is a child view of ResultsView and BookmarksView
    }

}

export default new ResultsView();