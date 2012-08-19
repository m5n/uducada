/* uducada v0.1 - https://github.com/m5n/uducada */
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
/* ========================================================================== */
/* uducada - jquery-ui.js - https://github.com/m5n/uducada                    */
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
    // TODO LATER: after closing dialog, pressing Esc or Enter or Space triggers another event, at least in Safari... jQuery UI bug?
    function maybeTriggerCancelEvent(dialogElement, event, triggerFn, cancelButtonEventType) {
        if ($(event.srcElement).hasClass('ui-icon-closethick') ||   // Close icon (the 'x') at top-right.
                event.keyCode === $.ui.keyCode.ESCAPE) {            // Escape key.
            // Must pass back the dialog element and the button event type.
            triggerFn(dialogElement, cancelButtonEventType, true);
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
        // TODO LATER: all UI Fwk adapters will have to trigger button:cancel event for non-buttons... how to enforce this?
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
        // Support submit-on-enter option on single-line input fields.
        // Handle this separately from the text change detection events
        // below, so that the submitHandler doesn't get called multiple
        // times.
        formElement.find('input[type="text"]').bind('keypress', function (event) {
            if (event.keyCode === $.ui.keyCode.ENTER) {
                if (options.submitOnEnter) {
                    formElement.submit();
                }
                event.preventDefault();
                return false;
            }
        });

        // Support character count fields with validate-as-you-type behavior.
        formElement.find(options.characterCountFieldCssSelector).each(function () {
            // Evaluate variables up-front, not for every key stroke.
            var inputElement = $(this),
                charCountTypedElement = options.getCharacterCountTypedDisplayElementFunction(inputElement),
                charCountLeftElement = options.getCharacterCountLeftDisplayElementFunction(inputElement),
                charCountLeft0Element = options.getCharacterCountLeft0DisplayElementFunction(inputElement),
                maxCharCount = inputElement.data(options.maxCharacterCountDataOption),
                validationRegex = options.getFormatRegExFunction(inputElement.data(options.formatDataOption));

            // Init maxCharCount as it's optional.
            maxCharCount = maxCharCount ? parseInt(maxCharCount, 10) : undefined;

            // Init count text.
            if (charCountTypedElement) {
                charCountTypedElement.text(inputElement.val().length);
            }
            if (maxCharCount !== undefined) {
                if (charCountLeftElement) {
                    charCountLeftElement.text(maxCharCount - inputElement.val().length);
                }
                if (charCountLeft0Element) {
                    charCountLeft0Element.text(Math.max(maxCharCount - inputElement.val().length, 0));
                }
            }

            // To detect changes in input length, these bindings are needed:
            // - change - to detect context menu paste followed by field blur
            // - keydown - to detect holding down a key to insert characters repeatedly
            // - keyup - to detect keyboard paste followed by Ctrl/Option key release
            inputElement.bind('change keydown keyup', function () {
                // Support character count option.
                if (charCountTypedElement) {
                    charCountTypedElement.text(inputElement.val().length);
                }
                if (maxCharCount !== undefined) {
                    if (charCountLeftElement) {
                        charCountLeftElement.text(maxCharCount - inputElement.val().length);
                    }
                    if (charCountLeft0Element) {
                        charCountLeft0Element.text(Math.max(maxCharCount - inputElement.val().length, 0));
                    }
                }

                // Support validate-as-you-type option.
                if (validationRegex) {
                    options.handleInputValidationFunction(inputElement, inputElement.val(), validationRegex);
                }
            });
        });
    }

    // formElement: JS framework reference (not a DOM elt ref or a css selector) or CSS selector
    function serializeForm(formElement, parentElement) {
        if (typeof formElement === 'string') {
            // CSS selector so convert to JS framework object.
            formElement = $(formElement, parentElement);
        }

        return formElement.serialize();
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

    // element: JS framework reference (not a DOM elt ref or a css selector) or CSS selector
    // parentElement: if element is a CSS selector, this is an optional parent element to find matches in
    function toggle(element, parentElement) {
        if (typeof element === 'string') {
            // CSS selector so convert to JS framework object.
            element = $(element, parentElement);
        }

        element.toggle();
    }

    function toggleDialog(element) {
        if (element.is(':visible')) {
            element.dialog('close');
        } else {
            element.dialog('open');
        }
    }

    // Public functions.
    return {
        getInput: getInput,
        hide: hide,
        initDialog: initDialog,
        initForm: initForm,
        toggleDialog: toggleDialog,
        serializeForm: serializeForm,
        show: show,
        toggle: toggle
    };
}(jQuery));
/* ========================================================================== */
/* uducada - busy-mask.js - https://github.com/m5n/uducada                    */
/* ========================================================================== */
/* Support for busy masks.  No references to JS or UI frameworks here!        */
/* ========================================================================== */

/*global clearTimeout, setTimeout */
var uducada = uducada || {};
uducada.busyMask = (function () {
    'use strict';

    // TODO LATER: busy mask should also prevent any keyboard or mouse action from going through
    // TODO LATER: support ability to show more than one mask at a time (i.e. mask is not shared)
    // TODO: if mask ends up only being used with forms, make it a property of form

    var defaultMaskElement,
        defaultMinimumShowTime,
        startShowTime,
        delayedHideTimerId;

    function setDefaults() {
        var defaults;

        // Gather options from the DOM.
        defaults = uducada.jsfwk.getInterpretedDataValue('body', 'busy-mask-defaults') || {};
        // Expects object with keys:
        // - maskElement: CSS selector for element to use as busy mask
        // - minimumShowTime: minimum #milliseconds to show the mask for
        // TODO LATER: add showAfter option to show mask only after N ms has expired?
        // TODO LATER: add hideAfter option to hide the mask after some time, in case there's an error somewhere and the UI would otherwise be unusable
        //             or, show X icon after some time, or a cancel/close equivalent

        // Get a reference to the mask element, if any.
        defaultMaskElement = undefined === defaults.maskElement ? undefined : uducada.jsfwk.findInElement('body', defaults.maskElement);

        // Mask should go away as soon as the job is done, so use default of 0.
        defaultMinimumShowTime = defaults.minimumShowTime || 0;
    }

    function hideMask(elementToCover) {
        if (defaultMaskElement) {
            var endShowTime = new Date().getMilliseconds(),
                diffTime = endShowTime - startShowTime;

            if (diffTime < defaultMinimumShowTime) {
                delayedHideTimerId = setTimeout(function () {
                    uducada.uifwk.hide(defaultMaskElement);
                    uducada.jsfwk.removeClassFromElement(elementToCover, 'uducada-busy');
                }, defaultMinimumShowTime - diffTime);
            } else {
                uducada.uifwk.hide(defaultMaskElement);
                uducada.jsfwk.removeClassFromElement(elementToCover, 'uducada-busy');
            }
        }
    }

    // element: JS framework reference (not a DOM elt ref or a css selector)
    function showMask(elementToCover) {
        if (defaultMaskElement) {
            // Clear the delayed hiding timer, if any.
            if (undefined !== delayedHideTimerId) {
                clearTimeout(delayedHideTimerId);
                delayedHideTimerId = undefined;
            }

            uducada.jsfwk.addClassToElement(elementToCover, 'uducada-busy');
            uducada.jsfwk.coverElementAndShow(defaultMaskElement, elementToCover);

            startShowTime = new Date().getMilliseconds();
        }
    }

    // Initialize default options.
    setDefaults();

    // Note: no skip-init here.

    // Public functions.
    return {
        hide: hideMask,
        show: showMask
    };
}());
/* ========================================================================== */
/* uducada - dialog.js - https://github.com/m5n/uducada                       */
/* ========================================================================== */
/* Support for dialogs.  No references to JS or UI frameworks here!           */
/* ========================================================================== */

// TODO LATER: allow override of global default on a per-dialog level, or set them all on a per-dialog level only?
// TODO LATER: dialogs should be centered around some parent element; <body> by default.
// TODO LATER: provide replacements for alert (default focus = OK button),
//             confirm (default focus on OK button), and
//             prompt (where Enter triggers OK button)
// TODO: keyboard navigation

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
    function triggerEvent(dialogElement, buttonEventType, dialogAlreadyClosed) {
        // TODO: validate form if there's one in the dialog.  If error, don't auto-close dialog.

        if (!dialogAlreadyClosed) {
            uducada.uifwk.toggleDialog(dialogElement);
        }

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

// TODO NOW: allow override of global default on a per-form level, or set them all on a per-form level only?
// TODO NOW: what should data-required mean?  Shortcut for data-format and/or visual indicator and use format regex for messaging?
// TODO NOW: required field indicator
// TODO: value changed indicator
// TODO LATER: placeholder support for older browsers
// TODO: support HTML5 tags + use html5shiv for older browsers

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
        options.characterCountFieldCssSelector = '[data-show-char-count="true"]';
        options.maxCharacterCountDataOption = 'max-char-count';
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
            uducada.jsfwk.removeClassFromNestedElements(formElement, 'label, .input-group', 'uducada-validation-failed');

            // Check required fields and format violations, but only surface
            // one error per field max. (What's the use of flagging an invalid
            // format when a required field has no input?)
            uducada.jsfwk.callFunctionForNestedElements(formElement, '[data-required="true"], [data-format], [data-min-count], [data-max-count]', function (inputElement) {
                var msgElement, regex, format, isGroup, min, max, count, valid = true;

                isGroup = uducada.jsfwk.hasClass(inputElement, 'input-group');
                if (isGroup) {
                    count = (uducada.jsfwk.findInElement(inputElement, 'input:checked') || []).length;
                    if (uducada.jsfwk.getInterpretedDataValue(inputElement, 'required') &&
                            count === 0) {
                        // One of the radio or checkbox inputs must be selected.
                        valid = false;
                        msgElement = uducada.jsfwk.findInElement(inputElement, '.required-text');
                    } else {
                        // Min/max count validation.
                        min = uducada.jsfwk.getInterpretedDataValue(inputElement, 'min-count') || 0;
                        max = uducada.jsfwk.getInterpretedDataValue(inputElement, 'max-count') || Number.MAX_VALUE;
                        if (count < min || count > max) {
                            valid = false;
                            msgElement = uducada.jsfwk.findInElement(inputElement, '.validation-text');
                        }
                    }
                } else {
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
                }

                if (!valid) {
                    if (isGroup) {
                        uducada.jsfwk.addClassToElement(inputElement, 'uducada-validation-failed');
                    } else {
                        uducada.jsfwk.addClassToParent(inputElement, 'uducada-validation-failed');
                    }
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
