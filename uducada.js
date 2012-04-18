/* uducada v0.1 - https://github.com/m5n/uducada */

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
// =============================================================================
// uducada - jquery-ui.adapter.js - https://github.com/m5n/uducada
// =============================================================================

/*global jQuery */
var uducada = uducada || {};
uducada.uifwk = (function ($) {
    'use strict';

    // Trigger cancel event for non-button actions if needed.
    // TODO: after closing dialog, pressing Esc or Enter or Space triggers
    //       another event, at least in Safari... jQuery UI bug?
    function maybeTriggerCancelEvent(dialogElement, event, triggerFn) {
        if ($(event.srcElement).hasClass('ui-icon-closethick') ||   // Close icon (the 'x') at top-right.
                event.keyCode === $.ui.keyCode.ESCAPE) {            // Escape key.
            triggerFn(dialogElement, uducada.dialog.BUTTON_EVENT_CANCEL);
        }
    }

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
        // TODO: all UI Fwk adapters will have to do this... how to enforce this?
        onClose = function (event) {
            // Must pass back the dialog element and the event object.
            maybeTriggerCancelEvent(dialogElement, event, options.onClick);
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
            dialogClass: options.showCloseIcon ? undefined : 'uducada-hide-close-icon',

            draggable: options.draggable,
            modal: options.modal,
            resizable: options.resizable,
            title: options.title,
            width: options.width
        });
    }

    // Public functions.
    return {
        initDialog: initDialog
    };
}(jQuery));
// =============================================================================
// uducada - dialog.js - https://github.com/m5n/uducada
// =============================================================================

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
        defaults = uducada.jsfwk.getJsonDataAttributeValue('body', 'dialog-defaults');
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
    // element: JS framework reference  (not a DOM elt ref or a css selector)
    // TODO: dialogs should be centered around some parent element; <body> by default.
    function initializeDialog(element) {
        var options,
            bb;

        // Gather options from the DOM.
        options = uducada.jsfwk.getDataAttributeValues(element, [
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

        // Initialize this dialog.
        uducada.uifwk.initDialog(element, options);
    }

    // Initialize default options.
    setDefaults();

    // Initialize all dialogs present in the markup, except those that indicate
    // to skip initialization.
    uducada.jsfwk.callFunctionForNonSkipInitElements('.dialog', initializeDialog);

    // Public functions and variables.
    return {
        BUTTON_EVENT_CANCEL: 'cancel',

        init: initializeDialog
    };
}());
