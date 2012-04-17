// uducada - adapter for jQuery - https://github.com/m5n/uducada

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
        trigger: trigger
    };
}(jQuery));
