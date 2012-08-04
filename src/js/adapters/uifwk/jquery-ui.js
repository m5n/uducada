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
    // TODO LATER: after closing dialog, pressing Esc or Enter or Space triggers another event, at least in Safari... jQuery UI bug?
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

    // Public functions.
    return {
        getInput: getInput,
        hide: hide,
        initDialog: initDialog,
        initForm: initForm,
        serializeForm: serializeForm,
        show: show
    };
}(jQuery));
