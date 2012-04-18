// =============================================================================
// uducada - jquery.adapter.js - https://github.com/m5n/uducada
// =============================================================================

/*global jQuery */
var uducada = uducada || {};
uducada.jsfwk = (function ($) {
    'use strict';

    function callFunctionForNonSkipInitElements(cssSelector, fn) {
        $(cssSelector).each(function () {
            var element = $(this);

            if (!element.data('skip-init')) {
                fn(element);
            }
        });
    }

    function getJsonDataAttributeValue(cssSelector, key) {
        // jQuery automatically converts JSON-like string to an object.
        return $(cssSelector).data(key);
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    // keys: array
    function getDataAttributeValues(element, keys) {
        var result = {};

        $.each(keys, function (index, value) {
            result[value] = element.data(value);
        });

        return result;
    }

    // eventOptions is an array.
    function trigger(element, eventType, eventOptions) {
        $(element).trigger(eventType, eventOptions);
    }

    // Public functions.
    return {
        callFunctionForNonSkipInitElements: callFunctionForNonSkipInitElements,
        getDataAttributeValues: getDataAttributeValues,
        getJsonDataAttributeValue: getJsonDataAttributeValue,
        trigger: trigger
    };
}(jQuery));
