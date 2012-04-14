// uducada - dialog - https://github.com/m5n/uducada

/*global $ */
(function () {
    'use strict';

    // Trigger cancel event when Escape button is pressed or X is clicked.
    function triggerCancelEvent(event) {
        if ($(event.srcElement).hasClass('ui-icon-closethick') ||
                event.keyCode === $.ui.keyCode.ESCAPE) {
            $(event.target).trigger('dialog-button-cancel');
        }
    }

    $('.dialog').each(function () {
        var elt = $(this),
            buttonsData,
            buttons = {};

        // Generate custom button events.
        buttonsData = elt.data('dialog-buttons');
        if (buttonsData) {
            $.each(buttonsData.split(','), function (index, value) {
                buttons[value] = function () {
                    elt.trigger('dialog-button-' + value);
                };
            });
        }

        elt.dialog({
            modal: elt.data('dialog-ismodal'),
            title: elt.data('dialog-title'),
            buttons: buttons,
            close: triggerCancelEvent
        });
    });
}());

