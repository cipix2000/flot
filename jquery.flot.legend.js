/* Flot plugin for drawing legends.

*/

(function($) {
    var placeholder;

    var options = {
        legend: {
            show: true,
            labelFormatter: null, // fn: string -> string
            container: null, // container (as jQuery object) to put legend in, null means default on top of graph
            position: "ne", // position of default legend container within plot
            margin: 5, // distance from grid edge to default legend container within plot
            backgroundColor: null, // null means auto-detect
            backgroundOpacity: 0.85, // set to 0 to avoid background
            sorted: null // default to no legend sorting
        }
    };

    function insertLegend(plot) {
        var series = plot.getData(),
            plotOffset = plot.getPlotOffset();

        if (options.legend.container != null) {
            $(options.legend.container).html("");
        } else {
            placeholder.find(".legend").remove();
        }

        if (!options.legend.show) {
            return;
        }

        var lf = options.legend.labelFormatter;

        // Build a list of legend entries, with each having a label, a color, and icon options
        var entries = series.map(function(s, i) {
            return {
                label: (lf ? lf(s.label, s) : s.label) || 'Plot ' + (i + 1),
                color: s.color,
                options: {
                    lines: s.lines,
                    points: s.points,
                    bars: s.bars
                }
            };
        });

        // Sort the legend using either the default or a custom comparator
        if (options.legend.sorted) {
            if ($.isFunction(options.legend.sorted)) {
                entries.sort(options.legend.sorted);
            } else if (options.legend.sorted === 'reverse') {
                entries.reverse();
            } else {
                var ascending = options.legend.sorted !== 'descending';
                entries.sort(function(a, b) {
                    return a.label === b.label
                        ? 0
                        : ((a.label < b.label) !== ascending ? 1 : -1 // Logical XOR
                        );
                });
            }
        }

        var html = [],
            entry, labelHtml, shapeHtml,
            maxLabelLength = 0,
            j = 0,
            pos = "",
            p = options.legend.position,
            m = options.legend.margin,
            shape = {
                name: '',
                label: '',
                xPos: '',
                yPos: ''
            };

        html[j++] = '<svg class="legendLayer" style="width:inherit;height:inherit">';
        html[j++] = svgShapeDefs;

        // Generate <use> elements for the list of entries, in their final order
        for (var i = 0; i < entries.length; ++i) {
            entry = entries[i];
            shapeHtml = '';
            shape.label = entry.label;
            shape.xPos = '0em';
            shape.yPos = i * 1.5 + 'em';
            // area
            if (entry.options.lines.show && entry.options.lines.fill) {
                shape.name = 'area';
                shape.fillColor = entry.color;
                shapeHtml += getEntryHtml(shape);
            }
            // bars
            if (entry.options.bars.show) {
                shape.name = 'bar';
                shape.fillColor = entry.color;
                shapeHtml += getEntryHtml(shape);
            }
            // lines
            if (entry.options.lines.show && !entry.options.lines.fill) {
                shape.name = 'lines';
                shape.strokeColor = entry.color;
                shape.strokeWidth = entry.options.lines.lineWidth;
                shapeHtml += getEntryHtml(shape);
            }
            // points
            if (entry.options.points.show) {
                shape.name = entry.options.points.symbol;
                shape.strokeColor = entry.color;
                shape.fillColor = entry.options.points.fillColor;
                shape.strokeWidth = entry.options.points.lineWidth;
                shapeHtml += getEntryHtml(shape);
            }

            maxLabelLength = maxLabelLength < shape.label.length ? shape.label.length : maxLabelLength;
            labelHtml = '<text x="' + shape.xPos + '" y="' + shape.yPos + '" text-anchor="start"><tspan dx="2em" dy="1.2em">' + shape.label + '</tspan></text>'
            html[j++] = '<g>' + shapeHtml + labelHtml + '</g>';
        }

        html[j++] = '</svg>';
        if (m[0] == null) {
            m = [m, m];
        }

        if (p.charAt(0) === 'n') {
            pos += 'top:' + (m[1] + plotOffset.top) + 'px;';
        } else if (p.charAt(0) === 's') {
            pos += 'bottom:' + (m[1] + plotOffset.bottom) + 'px;';
        }

        if (p.charAt(1) === 'e') {
            pos += 'right:' + (m[0] + plotOffset.right) + 'px;';
        } else if (p.charAt(1) === 'w') {
            pos += 'left:' + (m[0] + plotOffset.left) + 'px;';
        }

        var legendEl,
            width = 2 + maxLabelLength / 2,
            height = entries.length * 1.6;
        if (!options.legend.container) {
            legendEl = $('<div class="legend" style="position:absolute;' + pos + '">' + html.join('') + '</div>').appendTo(placeholder);
            legendEl.css('width', width + 'em');
            legendEl.css('height', height + 'em');
            // put the transparent background only when drawing the legend over graph
            if (options.legend.backgroundOpacity !== 0.0) {
                var c = options.legend.backgroundColor;
                if (c == null) {
                    c = options.grid.backgroundColor;
                    if (c && typeof c === 'string') {
                        c = $.color.parse(c);
                    } else {
                        c = $.color.extract(legendEl, 'background-color');
                    }

                    c.a = 1;
                    c = c.toString();
                }

                legendEl.css('background-color', c);
                legendEl.css('opacity', options.legend.backgroundOpacity);
            }
        } else {
            legendEl = $(html.join('')).appendTo(options.legend.container)[0];
            options.legend.container.style.width = width + 'em';
            options.legend.container.style.height = height + 'em';
        }
    }

    // Define the shapes
    var svgShapeDefs = `
        <defs>
            <symbol id="line" fill="none" viewBox="-5 -5 25 25">
                <polyline points="0,15 5,5 10,10 15,0"/>
            </symbol>

            <symbol id="area" stroke-width="1" viewBox="-5 -5 25 25">
                <polyline points="0,15 5,5 10,10 15,0, 15,15, 0,15"/>
            </symbol>

            <symbol id="bars" stroke-width="1" viewBox="-5 -5 25 25">
                <polyline points="1.5,15.5 1.5,12.5, 4.5,12.5 4.5,15.5 6.5,15.5 6.5,3.5, 9.5,3.5 9.5,15.5 11.5,15.5 11.5,7.5 14.5,7.5 14.5,15.5 1.5,15.5"/>
            </symbol>

            <symbol id="circle" viewBox="-5 -5 25 25">
                <circle cx="0" cy="15" r="2.5"/>
                <circle cx="5" cy="5" r="2.5"/>
                <circle cx="10" cy="10" r="2.5"/>
                <circle cx="15" cy="0" r="2.5"/>
            </symbol>

            <symbol id="rectangle" viewBox="-5 -5 25 25">
                <rect x="-2.1" y="12.9" width="4.2" height="4.2"/>
                <rect x="2.9" y="2.9" width="4.2" height="4.2"/>
                <rect x="7.9" y="7.9" width="4.2" height="4.2"/>
                <rect x="12.9" y="-2.1" width="4.2" height="4.2"/>
            </symbol>

            <symbol id="diamond" viewBox="-5 -5 25 25">
                <path d="M-3,15 L0,12 L3,15, L0,18 Z"/>
                <path d="M2,5 L5,2 L8,5, L5,8 Z"/>
                <path d="M7,10 L10,7 L13,10, L10,13 Z"/>
                <path d="M12,0 L15,-3 L18,0, L15,3 Z"/>
            </symbol>

            <symbol id="cross" fill="none" viewBox="-5 -5 25 25">
                <path d="M-2.1,12.9 L2.1,17.1, M2.1,12.9 L-2.1,17.1 Z"/>
                <path d="M2.9,2.9 L7.1,7.1 M7.1,2.9 L2.9,7.1 Z"/>
                <path d="M7.9,7.9 L12.1,12.1 M12.1,7.9 L7.9,12.1 Z"/>
                <path d="M12.9,-2.1 L17.1,2.1 M17.1,-2.1 L12.9,2.1 Z"/>
            </symbol>

            <symbol id="plus" fill="none" viewBox="-5 -5 25 25">
                <path d="M0,12 L0,18, M-3,15 L3,15 Z"/>
                <path d="M5,2 L5,8 M2,5 L8,5 Z"/>
                <path d="M10,7 L10,13 M7,10 L13,10 Z"/>
                <path d="M15,-3 L15,3 M12,0 L18,0 Z"/>
            </symbol>
        </defs>`;

    function getEntryHtml(shape) {
        var html = '',
            name = shape.name,
            x = shape.xPos,
            y = shape.yPos,
            fill = shape.fillColor,
            stroke = shape.strokeColor,
            width = shape.strokeWidth;
        switch (name) {
            case 'circle':
                html = '<use xlink:href="#circle" class="legendIcon" ' +
                    'x="' + x + '" ' +
                    'y="' + y + '" ' +
                    'fill="' + fill + '" ' +
                    'stroke="' + stroke + '" ' +
                    'stroke-width="' + width + '" ' +
                    'width="1.5em" height="1.5em"' +
                    '/>';
                break;
            case 'diamond':
                html = '<use xlink:href="#diamond" class="legendIcon" ' +
                    'x="' + x + '" ' +
                    'y="' + y + '" ' +
                    'fill="' + fill + '" ' +
                    'stroke="' + stroke + '" ' +
                    'stroke-width="' + width + '" ' +
                    'width="1.5em" height="1.5em"' +
                    '/>';
                break;
            case 'cross':
                html = '<use xlink:href="#cross" class="legendIcon" ' +
                    'x="' + x + '" ' +
                    'y="' + y + '" ' +
                    // 'fill="' + fill + '" ' +
                    'stroke="' + stroke + '" ' +
                    'stroke-width="' + width + '" ' +
                    'width="1.5em" height="1.5em"' +
                    '/>';
                break;
            case 'square':
                html = '<use xlink:href="#rectangle" class="legendIcon" ' +
                    'x="' + x + '" ' +
                    'y="' + y + '" ' +
                    'fill="' + fill + '" ' +
                    'stroke="' + stroke + '" ' +
                    'stroke-width="' + width + '" ' +
                    'width="1.5em" height="1.5em"' +
                    '/>';
                break;
            case 'plus':
                html = '<use xlink:href="#plus" class="legendIcon" ' +
                    'x="' + x + '" ' +
                    'y="' + y + '" ' +
                    // 'fill="' + fill + '" ' +
                    'stroke="' + stroke + '" ' +
                    'stroke-width="' + width + '" ' +
                    'width="1.5em" height="1.5em"' +
                    '/>';
                break;
            case 'bar':
                html = '<use xlink:href="#bars" class="legendIcon" ' +
                    'x="' + x + '" ' +
                    'y="' + y + '" ' +
                    'fill="' + fill + '" ' +
                    // 'stroke="' + stroke + '" ' +
                    // 'stroke-width="' + width + '" ' +
                    'width="1.5em" height="1.5em"' +
                    '/>';
                break;
            case 'area':
                html = '<use xlink:href="#area" class="legendIcon" ' +
                    'x="' + x + '" ' +
                    'y="' + y + '" ' +
                    'fill="' + fill + '" ' +
                    // 'stroke="' + stroke + '" ' +
                    // 'stroke-width="' + width + '" ' +
                    'width="1.5em" height="1.5em"' +
                    '/>';
                break;
            case 'line':
                html = '<use xlink:href="#line" class="legendIcon" ' +
                    'x="' + x + '" ' +
                    'y="' + y + '" ' +
                    // 'fill="' + fill + '" ' +
                    'stroke="' + stroke + '" ' +
                    'stroke-width="' + width + '" ' +
                    'width="1.5em" height="1.5em"' +
                    '/>';
                break;
            default:
                // default is circle
                html = '<use xlink:href="#circle" class="legendIcon" ' +
                    'x="' + x + '" ' +
                    'y="' + y + '" ' +
                    'fill="' + fill + '" ' +
                    'stroke="' + stroke + '" ' +
                    'stroke-width="' + width + '" ' +
                    'width="1.5em" height="1.5em"' +
                    '/>';
        }

        return html;
    }

    function init(plot) {
        placeholder = plot.getPlaceholder();
        options = plot.getOptions();

        plot.hooks.setupGrid.push(function (plot) {
            insertLegend(plot);
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'legend',
        version: '1.0'
    });
})(jQuery);
