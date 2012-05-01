/* ========================================================================== */
/* uducada - form.js - https://github.com/m5n/uducada                         */
/* ========================================================================== */
/* Support for forms.  No references to JS or UI frameworks here!             */
/* ========================================================================== */

// TODO NOW: allow override of global default on a per-form level, or set them all on a per-form level only?
// TODO NOW: what should data-required mean?  Shortcut for data-format and/or visual indicator and use format regex for messaging?
// TODO NOW: required field indicator
// TODO: value changed indicator
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
        options.maxCharacterCountDataOption = 'max-character-count';
        // element: JS framework reference (not a DOM elt ref or a css selector)
        options.getCharacterCountTypedDisplayElementFunction = function (inputElement) {
            return uducada.jsfwk.findInParent(inputElement, '.count-text .count-typed');
        };
        options.getCharacterCountLeftDisplayElementFunction = function (inputElement) {
            return uducada.jsfwk.findInParent(inputElement, '.count-text .count-left');
        };
        options.getCharacterCountLeft0DisplayElementFunction = function (inputElement) {
            return uducada.jsfwk.findInParent(inputElement, '.count-text .count-left0');
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

        // Handle form submission event to do client-side validation.
        // event: JS framework reference to an event
        uducada.jsfwk.handle(formElement, 'submit', function (event) {
            var allValid = true,
                options;

            // Remove all previous messages, if any.
            uducada.uifwk.hide('.required-text, .validation-text, .error-text, .generic-error-text', formElement);
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

            if (allValid) {
                // Prevent the default page-level form submit based on the HTML
                // action and method attributes.
                uducada.jsfwk.preventDefaultEventAction(event);

                // Show busy mask.
                uducada.busyMask.show(formElement);

                options = uducada.jsfwk.getAttributeValues(formElement, ['action', 'method']);
                uducada.jsfwk.makeAjaxRequest(formElement, options.method, options.action, uducada.uifwk.serializeForm(formElement), 'submit:success', 'submit:failure');
            } else {
                uducada.jsfwk.haltEventPropagation(event);
            }

            // Returning a boolean indicating if the form submission should
            // continue is definitely required in jQuery.  Maybe it's not
            // needed in other frameworks, but it doesn't hurt either.
            return allValid;
        });

        // Handle form submission success event.
        // event: JS framework reference to an event
        uducada.jsfwk.handle(formElement, 'submit:success', function () {
            // Remove busy mask.
            uducada.busyMask.hide(formElement);

            // TODO: if this form is inside of a dialog, close the dialog? --> close-dialog-on-success option, default should be true (auto-close)
        });

        // Handle form submission failure event.
        // event: JS framework reference to an event
        uducada.jsfwk.handle(formElement, 'submit:failure', function (event, xhr) {
            var data,
                dd,
                element,
                handled = true;

            // Remove busy mask.
            uducada.busyMask.hide(formElement);

            try {
                // AJAX response should be a serialized JSON string of form:
                // { fieldName1: errorMsg1, fieldName2: errorMsg2, ... }
                // or a regular string indicating a non-field-specific error.
                data = uducada.jsfwk.getAjaxResponseTextAsJson(xhr);
                if (data) {
                    for (dd in data) {
                        if (data.hasOwnProperty(dd)) {
                            element = uducada.jsfwk.findInParent(
                                uducada.jsfwk.findInElement(formElement, '[name="' + dd + '"]'),
                                'error-text'
                            );
                            if (!element) {
                                // Create target element.
                                element = uducada.jsfwk.createElement('span', {'class': 'error-text'});
                                uducada.jsfwk.appendToParent(
                                    element,
                                    uducada.jsfwk.findInElement(formElement, '[name="' + dd + '"]')
                                );
                            }
                            // Else target element already exists.
                            uducada.jsfwk.setText(element, data[dd]);
                            uducada.jsfwk.addClassToParent(element, 'uducada-server-error');
                            uducada.uifwk.show(element);
                        }
                    }
                } else {
                    // Unexpected error / response not in a format that Uducada
                    // understands; handle below.
                    handled = false;
                }
            } catch (exception) {
                data = uducada.jsfwk.getAjaxResponseTextAsString(xhr);
                if (data && data.length > 0) {
                    element = uducada.jsfwk.findInElement(formElement, '.error-text.uducada-server-error');
                    if (!element) {
                        // Create target element.
                        element = uducada.jsfwk.createElement('span', {'class': 'error-text uducada-server-error'});
                        uducada.jsfwk.insertBeforeNestedElement(element, formElement, '.generic-error-text');
                    }
                    // Else target element already exists.
                    uducada.jsfwk.setText(element, data);
                    uducada.uifwk.show(element);
                } else {
                    // Unexpected error / response not in a format that Uducada
                    // understands; handle below.
                    handled = false;
                }
            }

            if (!handled) {
                // Show user-defined generic error message.
                uducada.uifwk.show(uducada.jsfwk.findInElement(formElement, '.generic-error-text'));
            }
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
