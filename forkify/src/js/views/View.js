import icons from 'url:../../img/icons.svg';


export default class View {
    _data;

    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            this._clear();
            return this.renderError();
        }

        this._data = data;
        // console.log(this._data)
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        // It gets the appropriate parentElement from the inheriting class
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }


    // Update text and attributes without reloading entire page content
    update(data) {
        this._data = data;
        //page update - compares new html to current one and update only text and attributes that have changed
        const newMarkup = this._generateMarkup();
        // convert new markup to dom object in memory and compare with existing markup
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));

        // select current elements on app page before applying update
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        //Compare each node between the two arrays
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl))

            // Replace current text values with recently updated values from other DOM object
            /***
             * !newEl.isEqualNode(curEl) 
             * return only nodes with updated value between both DOM objects
             * newEl.firstChild.nodeValue, trim() !== ''
             * Extracting only the text from the nodes
             */
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }

            // Updates changed values on attributes
            if (!newEl.isEqualNode(curEl)) {
                // console.log(newEl.attributes);
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value));
            }

        })
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

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

    renderSuccessMessage(message = this._successMessage) {
        const markup = `
            <div class="error">
            <div>
              <svg>
                <use href="${icons}_icon-alert-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

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
}