import View from './View.js';
import previewView from './previewView.js';


class BookMarksView extends View {

    // It sets the parentElement in View to _parentElement
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
    _successMessage = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    _generateMarkup() {
        // return this._data.map(result => this._generateMarkupPreview(result)).join('')
        // same as below
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
        //NOTE: PreviewView is a child view of ResultsView and BookmarksView
    }


}

export default new BookMarksView();