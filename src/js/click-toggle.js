/* ========================================================================== */
/* uducada - click-toggle.js - https://github.com/m5n/uducada                 */
/* ========================================================================== */
/* Support for click toggles.  No references to JS or UI frameworks here!     */
/* A "click toggle" is an element that can trigger a click event (like an     */
/* anchor or a button) and result in another element being shown or hidden,   */
/* that is: "toggled".                                                        */
/* ========================================================================== */

/*global */
var uducada = uducada || {};
uducada.dialog = (function () {
    'use strict';

    // Initialize a single click toggle instance.
    // element: JS framework reference (not a DOM elt ref or a css selector)
    function initializeClickToggle(element) {
        uducada.jsfwk.handle(element, 'click', function () {
            var targetElement = uducada.jsfwk.getElementsByDataValue(element, 'click-toggle');
            if (uducada.jsfwk.hasClass(targetElement, 'dialog')) {
                uducada.uifwk.toggleDialog(targetElement);
            } else {
                uducada.uifwk.toggle(targetElement);
            }
        });
    }

    // Initialize all click toggles present in the markup, except those that
    // indicate to skip initialization.
    uducada.jsfwk.callFunctionForElementsIfDataValueIsNot('[data-click-toggle]', 'skip-init', true, initializeClickToggle);

    // Public functions.
    return {
        init: initializeClickToggle
    };
}());
