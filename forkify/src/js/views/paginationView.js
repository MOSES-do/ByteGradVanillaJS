import View from './View.js';
import icons from 'url:../../img/icons.svg';



class PaginationView extends View {
    // It sets the parentElement in View to _parentElement
    _parentElement = document.querySelector('.pagination');

    _generatePageButton(navDirection, iconDirection, currentPage, numPages) {
        // refactor button
        let pageNum = currentPage === 1 && numPages > 1 ? currentPage + 1 :
            currentPage === numPages && numPages > 1 ? currentPage - 1 :
                currentPage < numPages ? currentPage - 1 : '';

        if (pageNum >= 1 && numPages > 1) {
            return `
                <button data-goto="${pageNum}" class="btn--inline pagination__btn--${navDirection}">
                    <span>Page ${pageNum}
                 </span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-${iconDirection}"></use>
                    </svg>
                </button >
            `;
        }
    }

    _generateMarkup() {
        const currentPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        console.log(numPages)
        // Page 1, and other pages
        if (currentPage === 1 && numPages > 1)
            return this._generatePageButton('next', 'right', currentPage, numPages);

        // Last page
        if (currentPage === numPages && numPages > 1)
            return this._generatePageButton('prev', 'left', currentPage, numPages);

        // Other page
        if (currentPage < numPages) {
            return `
            ${this._generatePageButton('prev', 'left', currentPage, numPages)};
                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currentPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }

        // Page 1, and no other page
        return '';
    }

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn--inline');

            if (!btn) return;

            const goToPage = +btn.dataset.goto;
            // console.log(goToPage);
            handler(goToPage);
        });
    }
}


export default new PaginationView();