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
