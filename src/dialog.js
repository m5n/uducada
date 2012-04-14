// uducada - dialog - https://github.com/m5n/uducada

/*global jQuery */
(function ($) {
    'use strict';

    // Trigger a specific button event, making the type easily accessible.
    function triggerEvent(element, type) {
        element.trigger('button:' + type, [ type ]);
    }

    // Trigger cancel event for non-button actions if needed.
    function maybeTriggerCancelEvent(event) {
        if ($(event.srcElement).hasClass('ui-icon-closethick') ||   // The "X" icon at top-right.
                event.keyCode === $.ui.keyCode.ESCAPE) {            // Escape key.
            triggerEvent($(event.target), 'cancel');
        }
    }

    // TODO: after closing dialog, pressing Esc or Enter or Space triggers
    //       another event, at least in Safari... jQuery UI bug?

    // Initialize all dialogs present in the markup.
    $('.dialog').each(function () {
        var element = $(this),
            buttonData,
            buttonConfig = [];

        // Process buttons, if any.
        buttonData = element.data('buttons');
        if (buttonData) {
            // Generate buttons config.
            $.each(buttonData.split(','), function (index, value) {
                // The "value" variable has the format "event:text".
                var buttonOptions = value.split(':');

                buttonConfig.push({
                    text: buttonOptions[1],
                    click: function () {
                        triggerEvent(element, buttonOptions[0]);
                    }
                });
            });
        }

        // Init the dialog.
        // TODO: add on-demand / delayed init.
        element.dialog({
            autoOpen: false,   // Since this is a global init, must be false.
            buttons: buttonConfig,
            close: maybeTriggerCancelEvent,
            dialogClass: 'uducada-dialog' +   // TODO: remove if this class is never used.
                (element.hasClass('hide-x-icon') ? ' uducada-hide-x-icon' : ''),
            modal: element.data('modal'),
            title: element.data('title'),
            width: element.data('width')
        });
    });
}(jQuery));

