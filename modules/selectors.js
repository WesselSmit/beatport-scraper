/* To scrape a website you have to rely on the DOM structure,
   the DOM structure of a website is bound to change at some point,
   which will break the scraper code and result in errors.

   The purpose of this module is to make debugging easier when it breaks,
   having all selectors in one place makes it easier to change them. */


/**
 * Collection of DOM selectors
 * @module selectors
 */

module.exports = {
    //! All selectors are subject to change

    /* Container element of pagination links.

       NOTE: Beatports current website has a top and bottom pagination, both are identical.
       Which results in an array containing 2 pagination-container elements. */
    paginationContainer: '.pagination-container',


    /* Pagination Links */
    paginationLinks: 'a.pag-number'
}