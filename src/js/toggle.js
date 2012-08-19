/* ========================================================================== */
/* uducada - toggle.js - https://github.com/m5n/uducada                       */
/* ========================================================================== */
/* Support for toggles.  No references to JS or UI frameworks here!           */
/* A "toggle" is an element that can trigger an event (like an anchor or a    */
/* button) and result in another element being shown or hidden (toggled).     */
/* ========================================================================== */

// TODO: data-show-text / data-hide-text
// TODO: data-event (default click)

/*global */
var uducada = uducada || {};
uducada.toggle = (function () {
    'use strict';

    // Initialize a single toggle instance.
    // element: JS framework reference (not a DOM elt ref or a css selector)
    function initializeToggle(element) {
        uducada.jsfwk.handle(element, 'click', function () {
            var targetElement = uducada.jsfwk.getElementsByDataValue(element, 'toggle');
            if (uducada.jsfwk.hasClass(targetElement, 'dialog')) {
                uducada.uifwk.toggleDialog(targetElement);
            } else {
                uducada.uifwk.toggle(targetElement);
            }
        });
    }

    // Initialize all click toggles present in the markup, except those that
    // indicate to skip initialization.
    uducada.jsfwk.callFunctionForElementsIfDataValueIsNot('[data-toggle]', 'skip-init', true, initializeToggle);

    // Public functions.
    return {
        init: initializeToggle
    };
}());
