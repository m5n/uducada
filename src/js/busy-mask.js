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
