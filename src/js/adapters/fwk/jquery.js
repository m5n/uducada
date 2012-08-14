/* ========================================================================== */
/* uducada - jquery.js - https://github.com/m5n/uducada                       */
/* ========================================================================== */
/* All jQuery specific code.  No callbacks to uducada objects from here and   */
/* no hardcoded uducada specific attribute names or CSS selectors.            */
/* ========================================================================== */

/*global jQuery */
var uducada = uducada || {};
uducada.jsfwk = (function ($) {
    'use strict';

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function addClassToElement(element, className) {
        element.addClass(className);
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function addClassToElementInParent(element, cssSelector, className) {
        element.parent().find(cssSelector).addClass(className);
    }

    function addClassToNestedElement(element, cssSelector, className) {
        element.find(cssSelector).addClass(className);
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function removeClassFromElementInParent(element, cssSelector, className) {
        element.parent().find(cssSelector).removeClass(className);
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function addClassToParent(element, className) {
        element.parent().addClass(className);
    }

    function appendToParent(newElement, childElement) {
        childElement.parent().append(newElement);
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

    function createElement(tagName, attributes) {
        var attributeString = '';

        attributes = attributes || {};

        $.each(attributes, function (key, value) {
            attributeString += ' ' + key + '="' + value + '"';
        });

        return $('<' + tagName + attributeString + '"></' + tagName + '>');
    }

    function coverElementAndShow(otherElement, elementToCover) {
        otherElement.css({
            width: elementToCover.width() + 'px',
            height: elementToCover.height() + 'px',
            position: 'absolute',
            top: elementToCover.position().top + 'px',
            left: elementToCover.position().left + 'px'
        }).show();
    }

    // element: JS framework reference or CSS selector (not a DOM element reference)
    function findInElement(element, cssSelector) {
        var result;

        if (typeof element === 'string') {
            // CSS selector so convert to JS framework object.
            element = $(element);
        }

        result = element.find(cssSelector);
        if (result.length === 0) {
            result = undefined;
        }

        return result;
    }

    // element: JS framework reference or CSS selector (not a DOM element reference)
    function findInParent(element, cssSelector) {
        return findInElement(element.parent(), cssSelector);
    }

    // xhr: JS framework reference
    // May throw a JSON parse exception
    function getAjaxResponseTextAsJson(xhr) {
        return jQuery.parseJSON(xhr.responseText);
    }

    // xhr: JS framework reference
    function getAjaxResponseTextAsString(xhr) {
        return xhr.responseText;
    }

    // Retrieves standard attributes on the given element as strings.
    // element: JS framework reference or CSS selector (not a DOM element reference)
    // keys: array
    function getAttributeValues(element, keys) {
        var result = {};

        if (typeof element === 'string') {
            // CSS selector so convert to JS framework object.
            element = $(element);
        }

        $.each(keys, function (index, value) {
            // Note: jQuery's attr() function does not convert data type (which
            // is in agreement with this function's purpose).
            result[value] = element.attr(value);
        });

        return result;
    }

    // Retrieves a single data attribute on the given element or CSS selector,
    // converting the string value to the right data type (number, boolean,
    // object (via JSON conversion)).
    // element: JS framework reference or CSS selector (not a DOM element reference)
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
    // element: JS framework reference or CSS selector (not a DOM element reference)
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

    // Retrieves a single data attribute on the given element or CSS selector,
    // converting the string value to the right data type (number, boolean,
    // object (via JSON conversion)).
    // element: JS framework reference or CSS selector (not a DOM element reference)
    function getElementsByDataValue(element, key) {
        var cssSelector = getInterpretedDataValue(element, key);
        return $(cssSelector);
    }

    // event: JS framework reference to an event
    function haltEventPropagation(event) {
        event.stopImmediatePropagation();
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function handle(element, eventType, fn) {
        element.bind(eventType, fn);
    }

    function hasClass(element, className) {
        return element.hasClass(className);
    }

    function insertBeforeNestedElement(newElement, parentElement, childCssSelector) {
        var element = parentElement.find(childCssSelector);
        if (element.length > 0) {
            newElement.insertBefore(element);
        } else {
            throw new Error('No such element: ' + childCssSelector);
        }
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function makeAjaxRequest(element, type, url, data, successEvent, failureEvent) {
        $.ajax({
            type: type,
            dataType: 'json',
            url: url,
            data: data,
            context: element
        }).done(function () {
            element.trigger(successEvent, arguments);
        }).fail(function () {
            element.trigger(failureEvent, arguments);
        });
    }

    // event: JS framework reference to an event
    function preventDefaultEventAction(event) {
        event.preventDefault();
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function removeClassFromElement(element, className) {
        element.removeClass(className);
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function removeClassFromNestedElements(element, cssSelector, className) {
        element.find(cssSelector).removeClass(className);
    }

    function setText(element, text) {
        element.text(text);
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    // eventOptions: an array.
    function trigger(element, eventType, eventOptions) {
        element.trigger(eventType, eventOptions);
    }

    // Public functions.
    return {
        addClassToElement: addClassToElement,
        addClassToElementInParent: addClassToElementInParent,
        addClassToNestedElement: addClassToNestedElement,
        addClassToParent: addClassToParent,
        appendToParent: appendToParent,
        callFunctionForNestedElements: callFunctionForNestedElements,
        callFunctionForElementsIfDataValueIsNot: callFunctionForElementsIfDataValueIsNot,
        createElement: createElement,
        coverElementAndShow: coverElementAndShow,
        findInElement: findInElement,
        findInParent: findInParent,
        getAjaxResponseTextAsJson: getAjaxResponseTextAsJson,
        getAjaxResponseTextAsString: getAjaxResponseTextAsString,
        getAttributeValues: getAttributeValues,
        getElementsByDataValue: getElementsByDataValue,
        getInterpretedDataValue: getInterpretedDataValue,
        getInterpretedDataValues: getInterpretedDataValues,
        haltEventPropagation: haltEventPropagation,
        handle: handle,
        hasClass: hasClass,
        insertBeforeNestedElement: insertBeforeNestedElement,
        makeAjaxRequest: makeAjaxRequest,
        preventDefaultEventAction: preventDefaultEventAction,
        removeClassFromElement: removeClassFromElement,
        removeClassFromElementInParent: removeClassFromElementInParent,
        removeClassFromNestedElements: removeClassFromNestedElements,
        setText: setText,
        trigger: trigger
    };
}(jQuery));
