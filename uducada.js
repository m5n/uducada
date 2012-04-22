/* uducada v0.1 - https://github.com/m5n/uducada */

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
/* ========================================================================== */
/* uducada - jquery-ui.adapter.js - https://github.com/m5n/uducada            */
/* ========================================================================== */
/* All jQuery UI specific code.  No callbacks to uducada objects from here    */
/* and no hardcoded uducada specific attribute names or CSS selectors.        */
/* Since jQuery UI depends on jQuery, direct jQuery calls are ok.             */
/* ========================================================================== */

/*global jQuery */
var uducada = uducada || {};
uducada.uifwk = (function ($) {
    'use strict';

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function getInput(element) {
        return element.val();
    }

    // Trigger cancel event for non-button actions if needed.
    // dialogElement: JS framework reference (not a DOM elt ref or a css selector)
    // event: JS framework reference to an event
    // TODO LATER: after closing dialog, pressing Esc or Enter or Space triggers
    //             another event, at least in Safari... jQuery UI bug?
    function maybeTriggerCancelEvent(dialogElement, event, triggerFn, cancelButtonEventType) {
        if ($(event.srcElement).hasClass('ui-icon-closethick') ||   // Close icon (the 'x') at top-right.
                event.keyCode === $.ui.keyCode.ESCAPE) {            // Escape key.
            // Must pass back the dialog element and the button event type.
            triggerFn(dialogElement, cancelButtonEventType);
        }
    }

    // dialogElement: JS framework reference (not a DOM elt ref or a css selector)
    function initDialog(dialogElement, options) {
        var buttonConfig = [],
            onClose;

        // Generate buttons config.
        $.each(options.buttons, function (index, value) {
            // The "value" variable is an object like { type: 'ok', text: 'Ok' }.
            buttonConfig.push({
                text: value.text,
                click: function () {
                    // Must pass back the dialog element and the button event type.
                    options.onClick(dialogElement, value.type);
                }
            });
        });

        // Events that affect a dialog's visibility but are not triggered via
        // buttons need to be captured too, i.e. the Escape key and close icon.
        // TODO LATER: all UI Fwk adapters will have to do this... how to enforce this?
        onClose = function (event) {
            // Must pass back the dialog element and the event object.
            maybeTriggerCancelEvent(dialogElement, event, options.onClick, options.cancelButtonEventType);
        };

        // Init the dialog.
        dialogElement.dialog({
            autoOpen: options.autoOpen,
            buttons: buttonConfig,

            close: onClose,

            closeOnEscape: options.closeOnEscape,

            // Changing visibility of elements is done via the class attribute
            // to allow a pure CSS implementation.
            // jQuery UI shows a close icon (the 'x') by default, so only add
            // class to hide it.
            dialogClass: options.showCloseIcon ? undefined : options.hideCloseIconCssClass,

            draggable: options.draggable,
            modal: options.modal,
            resizable: options.resizable,
            title: options.title,
            width: options.width
        });
    }

    // formElement: JS framework reference (not a DOM elt ref or a css selector)
    function initForm(formElement, options) {
        formElement.find('input[type="text"]').bind('keypress', function (event) {
            if (event.keyCode === $.ui.keyCode.ENTER) {
                if (options.submitOnEnter) {
                    formElement.submit();
                }
                event.preventDefault();
                return false;
            }
        });
    }

    // element: JS framework reference (not a DOM elt ref or a css selector) or CSS selector
    // parentElement: if element is a CSS selector, this is an optional parent element to find matches in
    function show(element, parentElement) {
        if (typeof element === 'string') {
            // CSS selector so convert to JS framework object.
            element = $(element, parentElement);
        }

        element.show();
    }

    // element: JS framework reference (not a DOM elt ref or a css selector) or CSS selector
    // parentElement: if element is a CSS selector, this is an optional parent element to find matches in
    function hide(element, parentElement) {
        if (typeof element === 'string') {
            // CSS selector so convert to JS framework object.
            element = $(element, parentElement);
        }

        element.hide();
    }

    // Public functions.
    return {
        getInput: getInput,
        hide: hide,
        initDialog: initDialog,
        initForm: initForm,
        show: show
    };
}(jQuery));
/* ========================================================================== */
/* uducada - dialog.js - https://github.com/m5n/uducada                       */
/* ========================================================================== */
/* Support for dialogs.  No references to JS or UI frameworks here!           */
/* ========================================================================== */

// TODO LATER: dialogs should be centered around some parent element; <body> by default.
// TODO LATER: provide replacements for alert (default focus = OK button),
//             confirm (default focus on OK button), and
//             prompt (where Enter triggers OK button)

/*global */
var uducada = uducada || {};
uducada.dialog = (function () {
    'use strict';

    var defaultButtonTextLookup,   // Map button type -> text.
        defaultCloseOnEscape,
        defaultDraggable,
        defaultResizable,
        defaultShowCloseIcon;

    // Trigger a specific button event on the dialog element, making the button
    // event type easily accessible.
    function triggerEvent(dialogElement, buttonEventType) {
        uducada.jsfwk.trigger(dialogElement, 'button:' + buttonEventType, [ buttonEventType ]);
    }

    // 'k1:v1,k2:v2,...' --> [ {type: k1, text: v1}, {type: k2, text: v2}, ... ]
    function parseButtonConfigString(str, errorOnMissingText) {
        var items,
            pair,
            ii,
            result = [];

        // Be careful, ''.split(',') === [''], so an array of length 1!
        items = (str && str.length > 0) ? str.split(',') : [];   // 'k1:v1,k2:v2,...' --> ['k1:v1','k2:v2',...]
        for (ii = 0; ii < items.length; ii += 1) {
            pair = items[ii].split(':');   // 'k1:v1' --> ['k1', 'v1']
            if (errorOnMissingText && pair.length < 2) {
                throw new Error('Text missing for button event type "' + pair[0] + '"');
            }

            result.push({
                type: pair[0],
                text: pair.length > 1 ? pair[1] : undefined
            });
        }
        return result;
    }

    function setDefaults() {
        var defaults,
            items,
            ii;

        // Gather options from the DOM.
        defaults = uducada.jsfwk.getInterpretedDataValue('body', 'dialog-defaults') || {};
        // Expects object with keys:
        // - buttonText: string of format 'ok:Ok,cancel:Cancel,...'
        // - closeOnEscape: true | false
        // - draggable: true | false
        // - resizable: true | false
        // - showCloseIcon: true | false

        defaultButtonTextLookup = {};
        items = parseButtonConfigString(defaults.buttonText || '', true);
        for (ii = 0; ii < items.length; ii += 1) {
            defaultButtonTextLookup[items[ii].type] = items[ii].text;
        }

        // Keyboard navigation is good, so the Escape key should close a dialog.
        // Note: since value can be false, don't use value || default here.
        defaultCloseOnEscape = undefined === defaults.closeOnEscape ? true : defaults.closeOnEscape;

        // Dialogs obstruct parts of the page, so it's good to allow users to
        // move a dialog out of the way.
        // Note: since value can be false, don't use value || default here.
        defaultDraggable = undefined === defaults.draggable ? true : defaults.draggable;

        // Dialogs obstruct parts of the page, so it's good to allow users to
        // resize a dialog as they see fit.
        // Note: since value can be false, don't use value || default here.
        defaultResizable = undefined === defaults.resizable ? true : defaults.resizable;

        // Having all dialog actions (buttons) in close proximity is better, so
        // by default, do not provide a close icon (the 'x') to close a dialog.
        // Note: since value can be false, don't use value || default here.
        defaultShowCloseIcon = defaults.showCloseIcon || false;
    }

    // Initialize a single dialog instance.
    // element: JS framework reference (not a DOM elt ref or a css selector)
    function initializeDialog(element) {
        var options,
            bb;

        // Gather options from the DOM.
        options = uducada.jsfwk.getInterpretedDataValues(element, [
            'buttons',
            'close-on-escape',
            'draggable',
            'modal',
            'resizable',
            'show-close-icon',
            'title',
            'width'
        ]);

        // Since this is a global init, never open dialogs on init.
        // If you need to open a dialog on init / page load, use the methods
        // your UI framework of choice provides.
        options.autoOpen = false;

        // Convert button config string to an actual object.
        options.buttons = parseButtonConfigString(options.buttons, false);
        // Add missing text if a default is set.  Complain if there is not.
        for (bb = 0; bb < options.buttons.length; bb += 1) {
            if (!options.buttons[bb].text) {
                options.buttons[bb].text = defaultButtonTextLookup[options.buttons[bb].type];
                if (!options.buttons[bb].text) {
                    throw new Error('Missing or no default text for button event type "' + options.buttons[bb].type + '"');
                }
            }
        }

        // Events that affect a dialog's visibility but are not triggered via
        // buttons need to be captured too, i.e. the Escape key and close icon.
        // Make those trigger the cancel button event.
        options.cancelButtonEventType = 'cancel';

        // Convert 'close-on-escape' to camel-case key and use default if needed.
        // Note: since value can be false, don't use value || default here.
        options.closeOnEscape = undefined === options['close-on-escape'] ? defaultCloseOnEscape : options['close-on-escape'];
        delete options['close-on-escape'];

        // Use default draggable value if needed.
        // Note: since value can be false, don't use value || default here.
        options.draggable = undefined === options.draggable ? defaultDraggable : options.draggable;

        // Button clicks fire custom events, so capture them.
        options.onClick = triggerEvent;

        // Use default resizable value if needed.
        // Note: since value can be false, don't use value || default here.
        options.resizable = undefined === options.resizable ? defaultResizable : options.resizable;

        // Convert 'show-close-icon' to camel-case key and use default value if needed.
        // Note: since value can be false, don't use value || default here.
        options.showCloseIcon = undefined === options['show-close-icon'] ? defaultShowCloseIcon : options['show-close-icon'];
        delete options['show-close-icon'];
        // For UI frameworks that do not have an option to hide the close icon,
        // a custom CSS class is used.  Frameworks that do support such an
        // option can ignore this option and just use options.showCloseIcon.
        options.hideCloseIconCssClass = 'uducada-hide-close-icon';

        // Initialize this dialog.
        uducada.uifwk.initDialog(element, options);
    }

    // Initialize default options.
    setDefaults();

    // Initialize all dialogs present in the markup, except those that indicate
    // to skip initialization.
    uducada.jsfwk.callFunctionForElementsIfDataValueIsNot('.dialog', 'skip-init', true, initializeDialog);

    // Public functions.
    return {
        init: initializeDialog
    };
}());
/* ========================================================================== */
/* uducada - form.js - https://github.com/m5n/uducada                         */
/* ========================================================================== */
/* Support for forms.  No references to JS or UI frameworks here!             */
/* ========================================================================== */

// TODO NOW: what should data-required mean?  Visual indicator only and use format regex for messaging?
/* TODO:
- placeholder support
- required field indicator
- server-side error display (AJAX)
- char count/limit
- value changed indicator
*/

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

    // Initialize a single form instance.
    // element: JS framework reference (not a DOM elt ref or a css selector)
    function initializeForm(formElement) {
        var options;

        // Gather options from the DOM.
        options = uducada.jsfwk.getInterpretedDataValues(formElement, [
            'submit-on-enter'
        ]);

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
                    if (format !== undefined) {
                        // Be nice and support {,n} too (JavaScript does not natively support it).
                        format = format.replace(/\{,/g, '{0,');

                        format = format.split('/');   // '/regex/mods' --> ['', 'regex', 'mods']
                        regex = new RegExp(format[1], format[2]);
                        if (!regex.test(uducada.uifwk.getInput(inputElement))) {
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
