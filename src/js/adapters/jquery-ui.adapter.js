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
        // Support submit-on-enter option.
        formElement.find('input[type="text"]').bind('keypress', function (event) {
            if (event.keyCode === $.ui.keyCode.ENTER) {
                if (options.submitOnEnter) {
                    formElement.submit();
                }
                event.preventDefault();
                return false;
            }
        });

        // Support character count option.
        formElement.find(options.characterCountFieldCssSelector).each(function () {
            var inputElement = $(this),
                countElement = options.getCharacterCountDisplayElementFunction(inputElement);

            // Init count text.
            countElement.text(inputElement.val().length);

            // Handle changes in length.
            // Various bindings are needed:
            // change - to detect context menu paste followed by blur
            // keyup - to detect keyboard paste
            // keydown - to detect continuous keydown
            inputElement.bind('change keydown keyup', function () {
                countElement.text(inputElement.val().length);
            });
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
