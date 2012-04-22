/* ========================================================================== */
/* uducada - form.js - https://github.com/m5n/uducada                         */
/* ========================================================================== */
/* Support for forms.  No references to JS or UI frameworks here!             */
/* ========================================================================== */

// TODO NOW: allow override of global default on a per-form level
// TODO NOW: what should data-required mean?  Shortcut for data-format and/or visual indicator and use format regex for messaging?
// TODO NOW: required field indicator
// TODO: value changed indicator
// TODO: server-side error display (AJAX)
// TODO LATER: placeholder support for older browsers

/*global */
var uducada = uducada || {};
uducada.form = (function () {
    'use strict';

    var defaultSubmitOnEnter;

    function setDefaults() {
        var defaults;

        // Gather options from the DOM.
        defaults = uducada.jsfwk.getInterpretedDataValue('body', 'form-defaults') || {};
        // Expects object with keys:
        // - submitOnEnter: true | false

        // Automatically submitting a multi-input form by pressing Enter in a
        // single-line text input field is annoying, so don't allow it.
        // Note: since value can be false, don't use value || default here.
        defaultSubmitOnEnter = undefined === defaults.submitOnEnter ? false : defaults.submitOnEnter;
    }

    function getFormatRegex(format) {
        var regex;

        if (format !== undefined) {
            // Be nice and support {,n}; JavaScript does not natively support it.
            format = format.replace(/\{,/g, '{0,');

            format = format.split('/');   // '/regex/mods' --> ['', 'regex', 'mods']
            regex = new RegExp(format[1], format[2]);
        }

        return regex;
    }

    function testInputValueAgainstRegex(inputValue, regex) {
        // Handle multi-line matches within textareas, as 'm' flag is not
        // intended for what we need here, e.g. /^.{0,2}$/m.test('1\n2')
        // returns true.
        inputValue = inputValue.replace(/[\n\r]/g, ' ');

        return regex.test(inputValue);
    }

    // Initialize a single form instance.
    // element: JS framework reference (not a DOM elt ref or a css selector)
    function initializeForm(formElement) {
        var options;

        // Gather options from the DOM.
        options = uducada.jsfwk.getInterpretedDataValues(formElement, [
            'submit-on-enter'
        ]);

        // Support character count fields with validate-as-you-type behavior.
        // Note: don't do this in general because it's annoying for fields that
        // have specific formats or min #char requirements to see the validation
        // message as soon as you start typing something.
        options.characterCountFieldCssSelector = '[data-show-character-count="true"]';
        // element: JS framework reference (not a DOM elt ref or a css selector)
        options.getCharacterCountDisplayElementFunction = function (element) {
            return uducada.jsfwk.findInParent(element, '.count-text .count');
        };
        // Support for validate-as-you-type.
        options.formatDataOption = 'format';
        options.getFormatRegExFunction = getFormatRegex;
        // inputElement: JS framework reference (not a DOM elt ref or a css selector)
        options.handleInputValidationFunction = function (inputElement, inputValue, regex) {
            if (testInputValueAgainstRegex(inputValue, regex)) {
                uducada.jsfwk.removeClassFromElementInParent(inputElement, '.count-text', 'uducada-validation-failed');
            } else {
                uducada.jsfwk.addClassToElementInParent(inputElement, '.count-text', 'uducada-validation-failed');
            }
        };

        // Convert 'submit-on-enter' to camel-case key and use default if needed.
        // Note: since value can be false, don't use value || default here.
        options.submitOnEnter = undefined === options['submit-on-enter'] ? defaultSubmitOnEnter : options['submit-on-enter'];
        delete options['submit-on-enter'];

        // Initialize this form.
        uducada.uifwk.initForm(formElement, options);

        // Handle form submission event.
        // event: JS framework reference to an event
        uducada.jsfwk.handle(formElement, 'submit', function (event) {
            var allValid = true;

            // Remove all previous messages, if any.
            uducada.uifwk.hide('.required-text, .validation-text', formElement);
            uducada.jsfwk.removeClassFromNestedElements(formElement, 'label', 'uducada-validation-failed');

            // Check required fields and format violations, but only surface
            // one error per field max. (What's the use of flagging an invalid
            // format when a required field has no input?)
            uducada.jsfwk.callFunctionForNestedElements(formElement, '[data-required="true"], [data-format]', function (inputElement) {
                var msgElement, regex, format, valid = true;

                if (uducada.jsfwk.getInterpretedDataValue(inputElement, 'required') &&
                        !uducada.uifwk.getInput(inputElement)) {
                    valid = false;
                    msgElement = uducada.jsfwk.findInParent(inputElement, '.required-text');
                } else {
                    format = uducada.jsfwk.getInterpretedDataValue(inputElement, 'format');
                    regex = getFormatRegex(format);
                    if (format !== undefined) {
                        if (!testInputValueAgainstRegex(uducada.uifwk.getInput(inputElement), regex)) {
                            valid = false;
                            msgElement = uducada.jsfwk.findInParent(inputElement, '.validation-text');
                        }
                    }
                }

                if (!valid) {
                    uducada.jsfwk.addClassToParent(inputElement, 'uducada-validation-failed');
                    uducada.uifwk.show(msgElement);
                    allValid = false;
                }
            });

            if (!allValid) {
                uducada.jsfwk.haltEventPropagation(event);
            }

            // Returning a boolean indicating if the form submission should
            // continue is definitely required in jQuery.  Maybe it's not
            // needed in other frameworks, but it doesn't hurt either.
            return allValid;
        });
    }

    // Initialize default options.
    setDefaults();

    // Initialize all form present in the markup, except those that indicate
    // to skip initialization.
    uducada.jsfwk.callFunctionForElementsIfDataValueIsNot('form', 'skip-init', true, initializeForm);

    // Public functions.
    return {
        init: initializeForm
    };
}());
