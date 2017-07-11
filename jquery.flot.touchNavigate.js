/* global jQuery */

(function($) {
    'use strict';

    var options = {
    };

    function init(plot) {
        plot.hooks.processOptions.push(initTouchNavigation);
    }

    function initTouchNavigation(plot, options) {
        var startPageX = 0,
            startPageY = 0,
            plotState = false,
            scaling = false,
            pan = true,
            prevDist = null;

        function isPinchEvent(e) {
            return e.touches && e.touches.length === 2;
        }

        function onDragStart(e) {
            e.stopPropagation();
            e.preventDefault();

            scaling = isPinchEvent(e);
            if (!scaling) {
                plot.getPlaceholder().css('cursor', plot.getOptions().pan.cursor);
                startPageX = e.touches[0].clientX;
                startPageY = e.touches[0].clientY;
                plotState = plot.navigationState();
                pan = true;
            } else {
                prevDist = pinchDistance(e);
            }
        }

        function onDrag(e) {
            e.stopPropagation();
            e.preventDefault();

            scaling = isPinchEvent(e);

            if (!scaling && pan) {
                plot.smartPan({
                    x: startPageX - (e.touches[0].clientX),
                    y: startPageY - (e.touches[0].clientY)
                }, plotState);
            } else if (scaling) {
                pan = false;
                var dist = pinchDistance(e);
                onZoomPinch(e, dist < prevDist);
                prevDist = dist;
            }
        }

        function onDragEnd(e) {
            if (!isPinchEvent(e)) {
                prevDist = null;
            }
            if (scaling && !isPinchEvent(e)) { //if it was a pinch event and is not anymore it means pinch ended
                pan = false;
            }
        }

        function onZoomPinch(e, zoomOut) {
            e.preventDefault();
            var offset = plot.offset(),
                center = {
                    left: 0,
                    top: 0
                },
                pageX = (e.touches[0].clientX + e.touches[1].clientX) / 2,
                pageY = (e.touches[0].clientY + e.touches[1].clientY) / 2,
                amount = pinchDistance(e) / prevDist;

            center.left = pageX - offset.left;
            center.top = pageY - offset.top;

            if (zoomOut) {
                plot.zoomOut({
                    center: center,
                    amount: 1 / amount
                });
            } else {
                plot.zoom({
                    center: center,
                    amount: amount
                });
            }
        }

        function pinchDistance(e) {
            var dist = Math.sqrt((e.touches[0].clientX - e.touches[1].clientX) * (e.touches[0].clientX - e.touches[1].clientX) +
            (e.touches[0].clientY - e.touches[1].clientY) * (e.touches[0].clientY - e.touches[1].clientY));
            return dist;
        }

        function bindEvents(plot, eventHolder) {
            var o = plot.getOptions();

            if (o.pan.interactive) {
                eventHolder[0].addEventListener("touchstart", onDragStart, false);
                eventHolder[0].addEventListener("touchmove", onDrag, false);
                eventHolder[0].addEventListener("touchend", onDragEnd, false);
            }
        }

        function shutdown(plot, eventHolder) {
            eventHolder[0].removeEventListener("touchstart", onDragStart);
            eventHolder[0].removeEventListener('touchmove', onDrag);
            eventHolder[0].removeEventListener('touchend', onDragEnd);
        }

        if (options.pan.enableTouch === true) {
            plot.hooks.bindEvents.push(bindEvents);
            plot.hooks.shutdown.push(shutdown);
        }
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'navigateTouch',
        version: '0.2'
    });
})(jQuery);
