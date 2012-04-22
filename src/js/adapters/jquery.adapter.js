/* ========================================================================== */
/* uducada - jquery.adapter.js - https://github.com/m5n/uducada               */
/* ========================================================================== */
/* All jQuery specific code.  No callbacks to uducada objects from here and   */
/* no hardcoded uducada specific attribute names or CSS selectors.            */
/* ========================================================================== */

/*global jQuery */
var uducada = uducada || {};
uducada.jsfwk = (function ($) {
    'use strict';

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function addClassToParent(element, className) {
        element.parent().addClass(className);
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function callFunctionForNestedElements(element, cssSelector, fn) {
        element.find(cssSelector).each(function () {
            fn($(this));
        });
    }

    // dataValue: true object type value (i.e. use true, not 'true')
    function callFunctionForElementsIfDataValueIsNot(cssSelector, dataAttribute, dataValue, fn) {
        $(cssSelector).each(function () {
            var element = $(this);

            // jQuery's data() function automatically converts data type.
            if (element.data(dataAttribute) !== dataValue) {
                fn(element);
            }
        });
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function findInParent(element, cssSelector) {
        return element.parent().find(cssSelector);
    }

    // Retrieves a single data attribute on the given element or CSS selector,
    // converting the string value to the right data type (number, boolean,
    // object (via JSON conversion)).
    // element: JS framework reference (not a DOM elt ref or a css selector)
    function getInterpretedDataValue(element, key) {
        if (typeof element === 'string') {
            // CSS selector so convert to JS framework object.
            element = $(element);
        }

        // jQuery's data() function automatically converts data type.
        return element.data(key);
    }

    // Retrieves data attributes on the given element, converting the string
    // value to the right data type (number, boolean, object (via JSON
    // conversion)).
    // element: JS framework reference (not a DOM elt ref or a css selector)
    // keys: array
    function getInterpretedDataValues(element, keys) {
        var result = {};

        if (typeof element === 'string') {
            // CSS selector so convert to JS framework object.
            element = $(element);
        }

        $.each(keys, function (index, value) {
            // jQuery's data() function automatically converts data type.
            result[value] = element.data(value);
        });

        return result;
    }

    // event: JS framework reference to an event
    function haltEventPropagation(event) {
        event.stopImmediatePropagation();
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function handle(element, eventType, fn) {
        element.bind(eventType, fn);
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function removeClassFromNestedElements(element, cssSelector, className) {
        element.find(cssSelector).removeClass(className);
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    // eventOptions: an array.
    function trigger(element, eventType, eventOptions) {
        $(element).trigger(eventType, eventOptions);
    }

    // Public functions.
    return {
        addClassToParent: addClassToParent,
        callFunctionForNestedElements: callFunctionForNestedElements,
        callFunctionForElementsIfDataValueIsNot: callFunctionForElementsIfDataValueIsNot,
        findInParent: findInParent,
        getInterpretedDataValue: getInterpretedDataValue,
        getInterpretedDataValues: getInterpretedDataValues,
        haltEventPropagation: haltEventPropagation,
        handle: handle,
        removeClassFromNestedElements: removeClassFromNestedElements,
        trigger: trigger
    };
}(jQuery));
