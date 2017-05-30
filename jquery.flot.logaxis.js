/* Pretty handling of log axes.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Copyright (c) 2015 Ciprian Ceteras cipix2000@gmail.com.
Licensed under the MIT license.

Set axis.mode to "log" to enable.
*/

/* global jQuery*/

(function ($) {
    'use strict';

    var options = {
        xaxis: {}
    };

    var defaultTickFormatter;
    var PREFERRED_LOG_TICK_VALUES = (function () {
        var vals = [];
        for (var power = -39; power <= 39; power++) {
            var range = Math.pow(10, power);
            for (var mult = 1; mult <= 9; mult++) {
                var val = range * mult;
                vals.push(val);
            }
        }

        return vals;
    }());

    var logTransform = function (v) {
        if (v < PREFERRED_LOG_TICK_VALUES[0]) {
            v = PREFERRED_LOG_TICK_VALUES[0];
        }

        return Math.log(v);
    };

    var logInverseTransform = function (v) {
        return Math.exp(v);
    };

    var linearTickGenerator = function (plot, min, max, noTicks) {
        var size = plot.computeTickSize(min, max, noTicks);
        var ticks = [],
            start = floorInBase(min, size),
            i = 0,
            v = Number.NaN,
            prev;

        do {
            prev = v;
            v = start + i * size;
            ticks.push(v);
            ++i;
        } while (v < max && v !== prev);
        return ticks;
    };

    var logTickGenerator = function (plot, axis, noTicks) {
        var ticks = [],
            minIdx = -1,
            maxIdx = -1,
            min = axis.min,
            max = axis.max,
            surface = plot.getCanvas();

        if (!noTicks) {
            noTicks = 0.3 * Math.sqrt(axis.direction === "x" ? surface.width : surface.height);
        }

        if (min <= 0) {
            //for empty graph if axis.min is not strictly positive make it 0.1
            if (axis.datamin === null) {
                min = axis.min = 0.1;
            } else {
                min = processAxisOffset(plot, axis);
            }
        }

        PREFERRED_LOG_TICK_VALUES.some(function (val, i) {
            if (val >= min) {
                minIdx = i;
                return true;
            } else {
                return false;
            }
        });

        PREFERRED_LOG_TICK_VALUES.some(function (val, i) {
            if (val >= max) {
                maxIdx = i;
                return true;
            } else {
                return false;
            }
        });

        if (minIdx === -1) {
            minIdx = 0;
        }

        if (maxIdx === -1) {
            maxIdx = PREFERRED_LOG_TICK_VALUES.length - 1;
        }

        var lastDisplayed = null,
            inverseNoTicks = 1 / noTicks,
            tickValue, pixelCoord, tick;

        // Count the number of tick values would appear, if we can get at least
        // nTicks / 4 accept them.
        if (maxIdx - minIdx >= noTicks / 4) {
            for (var idx = maxIdx; idx >= minIdx; idx--) {
                tickValue = PREFERRED_LOG_TICK_VALUES[idx];
                pixelCoord = Math.log(tickValue / min) / Math.log(max / min);
                tick = tickValue;

                if (lastDisplayed === null) {
                    lastDisplayed = {
                        pixelCoord: pixelCoord,
                        idealPixelCoord: pixelCoord
                    };
                } else {
                    if (Math.abs(pixelCoord - lastDisplayed.pixelCoord) >= inverseNoTicks) {
                        lastDisplayed = {
                            pixelCoord: pixelCoord,
                            idealPixelCoord: lastDisplayed.idealPixelCoord - inverseNoTicks
                        };
                    } else {
                        tick = null;
                    }
                }

                if (tick) {
                    ticks.push(tick);
                }
            }
            // Since we went in backwards order.
            ticks.reverse();
        } else {
            ticks = linearTickGenerator(plot, min, max, noTicks);
        }

        return ticks;
    };

    var logTickFormatter = function (value, axis, precision) {
        var tenExponent = value > 0 ? Math.floor(Math.log(value) / Math.LN10) : 0,
            roundWith = Math.pow(10, tenExponent),
            x = Math.round(value / roundWith);

        if (precision) {
            var updatedPrecision = recomputePrecision(value, precision);
            if ((tenExponent >= -4) && (tenExponent <= 4)) {
                return defaultTickFormatter(value, axis, updatedPrecision);
            } else {
                return (value / roundWith).toFixed(updatedPrecision) + 'e' + tenExponent;
            }
        }
        if ((tenExponent >= -4) && (tenExponent <= 4)) {
            //if we have float numbers, return a limited length string(ex: 0.0009 is represented as 0.000900001)
            var formattedValue = tenExponent < 0 ? value.toFixed(-tenExponent) : value.toFixed(tenExponent + 2);
            if (formattedValue.indexOf('.') !== -1) {
                var lastZero = formattedValue.lastIndexOf('0');

                while (lastZero === formattedValue.length - 1) {
                    formattedValue = formattedValue.slice(0, -1);
                    lastZero = formattedValue.lastIndexOf('0');
                }

                //delete the dot if is last
                if (formattedValue.indexOf('.') === formattedValue.length - 1) {
                    formattedValue = formattedValue.slice(0, -1);
                }
            }
            return formattedValue;
        } else {
            return x.toFixed(0) + 'e' + tenExponent;
        }
    };

    // update the axis precision for logaxis format
    var recomputePrecision = function(num, precision) {
        if (num === 0) {
            return 2;
        }

        //for numbers close to zero, the precision from flot will be a big number
        //while for big numbers, the precision will be negative
        var log10Value = Math.log(Math.abs(num)) * Math.LOG10E,
            newPrecision = Math.abs(log10Value + precision);

        return newPrecision <= 20 ? Math.ceil(newPrecision) : 20;
    }

    function processAxisOffset(plot, axis) {
        var series = plot.getData(),
            i, data, j, min = 0.1, step = 2,
            start = axis.direction === "x" ? 0 : 1;

        //the axis will start for 0.1 or the minimum datapoint between 0 and 0.1
        for (i = series.length - 1; i >= 0; i--) {
            data = series[i].datapoints.points;
            for (j = start; j <= data.length - 1; j += step) {
                if (data[j] < min && data[j] > 0) {
                    min = data[j];
                }
            }
        }

        axis.min = min;

        return min;
    }

    // round to nearby lower multiple of base
    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }

    function init(plot) {
        plot.hooks.processOptions.push(function (plot) {
            defaultTickFormatter = plot.defaultTickFormatter;
            $.each(plot.getAxes(), function (axisName, axis) {
                var opts = axis.options;
                if (opts.mode === 'log') {
                    axis.tickGenerator = function (axis) {
                        var noTicks = 11;
                        return logTickGenerator(plot, axis, noTicks);
                    };
                    if (typeof axis.options.tickFormatter !== 'function') {
                        axis.options.tickFormatter = logTickFormatter;
                    }
                    axis.options.transform = logTransform;
                    axis.options.inverseTransform = logInverseTransform;
                    axis.options.autoscaleMargin = 0;
                }
            });
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'log',
        version: '0.1'
    });

    $.plot.logTicksGenerator = logTickGenerator;
    $.plot.logTickFormatter = logTickFormatter;
})(jQuery);
