/* ========================================================================== */
/* uducada - toggle.js - https://github.com/m5n/uducada                       */
/* ========================================================================== */
/* Support for toggles.  No references to JS or UI frameworks here!           */
/* A "toggle" is an element that can trigger an event (like an anchor or a    */
/* button) and result in another element being shown or hidden (toggled).     */
/* ========================================================================== */

// TODO: data-show-text / data-hide-text

/*global */
var uducada = uducada || {};
uducada.toggle = (function () {
    'use strict';

    var defaultEvent;

    function setDefaults() {
        var defaults;

        // Gather options from the DOM.
        defaults = uducada.jsfwk.getInterpretedDataValue('body', 'toggle-defaults') || {};
        // Expects object with keys:
        // - event: JS framework-specific event string

        // Toggles usually require a user action and the most basic is 'click'.
        defaultEvent = undefined === defaults.event ? 'click' : defaults.event;
    }

    // Initialize a single toggle instance.
    // element: JS framework reference (not a DOM elt ref or a css selector)
    function initializeToggle(element) {
        var options;

        // Gather options from the DOM.
        options = uducada.jsfwk.getInterpretedDataValues(element, [
            'event'
        ]);

        // Use default event value if needed.
        options.event = options.event || defaultEvent;

        uducada.jsfwk.handle(element, options.event, function () {
            var targetElement = uducada.jsfwk.getElementsByDataValue(element, 'toggle');
            if (uducada.jsfwk.hasClass(targetElement, 'dialog')) {
                uducada.uifwk.toggleDialog(targetElement);
            } else {
                uducada.uifwk.toggle(targetElement);
            }
        });
    }

    // Initialize default options.
    setDefaults();

    // Initialize all click toggles present in the markup, except those that
    // indicate to skip initialization.
    uducada.jsfwk.callFunctionForElementsIfDataValueIsNot('[data-toggle]', 'skip-init', true, initializeToggle);

    // Public functions.
    return {
        init: initializeToggle
    };
}());
