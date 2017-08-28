/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("flot navigate plugin", function () {
    var placeholder, plot, options;

    beforeEach(function () {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
        options = {
            xaxes: [{ autoscale: 'exact' }],
            yaxes: [{ autoscale: 'exact' }],
            zoom: { interactive: true, amount: 10 },
            pan: { interactive: true, frameRate: -1 }
        };
    });

    it('provides a zoom, zoomOut, pan, smartPan functions', function () {
        plot = $.plot(placeholder, [
            []
        ], options);

        expect(typeof plot.zoom).toBe('function');
        expect(typeof plot.zoomOut).toBe('function');
        expect(typeof plot.pan).toBe('function');
        expect(typeof plot.smartPan).toBe('function');
    });

    describe('zoom', function () {
        it('uses the provided amount', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.zoom({
                amount: 2
            });

            expect(xaxis.min).toBe(2.5);
            expect(xaxis.max).toBe(7.5);
            expect(yaxis.min).toBeCloseTo(2.5, 7);
            expect(yaxis.max).toBeCloseTo(7.5, 7);

        });

        it('uses the amount configured in the plot if none is provided', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.zoom();

            expect(xaxis.min).toBe(4.5);
            expect(xaxis.max).toBe(5.5);
            expect(yaxis.min).toBeCloseTo(4.5, 7);
            expect(yaxis.max).toBeCloseTo(5.5, 7);

        });

        it('uses the provided center', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            plot.zoom({
                amount: 2,
                center: {
                    left: 0,
                    top: plot.height()
                }
            });

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(5);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(5);

        });

        it('uses the provided axes', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            plot.zoom({
                amount: 2,
                center: {
                    left: 0,
                    top: plot.height()
                },
                axes: plot.getXAxes()
            });

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(5);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });

        it ('doesn\'t got to Infinity and beyond', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [-1, -10e200 ],
                    [1, 10e200]
                ]
            ], options);

            plot.zoom({
                amount: 10e-200
            });

            yaxis = plot.getYAxes()[0];

            expect(yaxis.min).not.toBe(-Infinity);
            expect(yaxis.max).not.toBe(Infinity);

        });

        it('generates subunitary ticks for X axis', function () {
            var xaxis, ticks, middle;

            plot = $.plot(placeholder, [
                [
                    [3, 0],
                    [9, 10]
                ]
            ], options);

            plot.zoom({
                amount: 4,
                center: {
                    left: 0,
                    top: plot.height()
                }
            });

            xaxis = plot.getXAxes()[0];
            expect(xaxis.min).toBe(3);
            expect(xaxis.max).toBe(4.5);

            ticks = xaxis.ticks;
            middle = Math.floor(ticks.length / 2);
            expect(ticks[middle- 1].v).toBe(3.6);
            expect(ticks[middle].v).toBe(3.8);
            expect(ticks[middle + 1].v).toBe(4);

        });

    });

    describe('zoomOut', function () {
        it('uses the provided amount', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.zoomOut({
                amount: 0.5
            });

            expect(xaxis.min).toBe(2.5);
            expect(xaxis.max).toBe(7.5);
            expect(yaxis.min).toBeCloseTo(2.5, 7);
            expect(yaxis.max).toBeCloseTo(7.5, 7);

        });

        it('uses the amount configured in the plot if none is provided', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.zoom();

            expect(xaxis.min).toBe(4.5);
            expect(xaxis.max).toBe(5.5);
            expect(yaxis.min).toBeCloseTo(4.5, 7);
            expect(yaxis.max).toBeCloseTo(5.5, 7);

        });

        it('uses the provided center', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);


            plot.zoomOut({
                amount: 0.5,
                center: {
                    left: 0,
                    top: plot.height()
                }
            });

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(5);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(5);

        });

        it ('doesn\'t got to Infinity and beyond', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [-1, -10e200 ],
                    [1, 10e200]
                ]
            ], options);

            plot.zoomOut({
                amount: 10e200
            });

            yaxis = plot.getYAxes()[0];

            expect(yaxis.min).not.toBe(-Infinity);
            expect(yaxis.max).not.toBe(Infinity);

        });

        it ('can be disabled per axis', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            xaxis.options.disableZoom = true;

            plot.zoomOut({
                amount: 0.5
            });

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBeCloseTo(2.5, 7);
            expect(yaxis.max).toBeCloseTo(7.5, 7);

        });
    });

    describe('smartPan', function () {
        it('uses the provided x delta', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.smartPan({
                x: -plot.width(),
                y: 0
            }, plot.navigationState());

            expect(xaxis.min).toBe(-10);
            expect(xaxis.max).toBe(0);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });

        it('uses the provided y delta', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.smartPan({
                x: 0,
                y: plot.height(),
            }, plot.navigationState());

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBe(-10);
            expect(yaxis.max).toBe(0);

        });

        it('snaps to the x direction when delta y is small', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.smartPan({
                x: -plot.width(),
                y: 1
            }, plot.navigationState());

            expect(xaxis.min).toBe(-10);
            expect(xaxis.max).toBe(0);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });

        it('snaps to the y direction when delta x is small', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.smartPan({
                x: 1,
                y: plot.height(),
            }, plot.navigationState());

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBe(-10);
            expect(yaxis.max).toBe(0);

        });

        it('restore xaxis offset on snap on y direction if returns from diagonal snap', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            plot.smartPan({
                x: plot.width(),
                y: plot.height(),
            }, plot.navigationState());

            expect(xaxis.min).toBe(10);
            expect(xaxis.max).toBe(20);
            expect(yaxis.min).toBe(-10);
            expect(yaxis.max).toBe(0);

            var initialState = plot.navigationState();
            initialState.diagMode = true;

            plot.smartPan({
                x: 2,
                y: - plot.height() + 2,
            }, initialState);


            expect(xaxis.min).toBe(10);
            expect(xaxis.max).toBe(20);
        });

        it ('can be disabled per axis', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            xaxis.options.disablePan = true;

            plot.smartPan({
                x: plot.width(),
                y: plot.height(),
            }, plot.navigationState());

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBe(-10);
            expect(yaxis.max).toBe(0);
        });

        it('can pan close to 0 for logaxis', function () {
            var xaxis, yaxis;

            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], {
                xaxes: [{ autoscale: 'exact', mode : 'log'}],
                yaxes: [{ autoscale: 'exact' }],
                zoom: { interactive: true, amount: 10 },
                pan: { interactive: true, frameRate: -1 }
            });

            xaxis = plot.getXAxes()[0];
            yaxis = plot.getYAxes()[0];

            expect(xaxis.min).toBe(0.1);
            expect(xaxis.max).toBe(10);

            plot.smartPan({
                x: -plot.width(),
                y: 0
            }, plot.navigationState());

            expect(xaxis.min).toBeCloseTo(0.001, 4);
            expect(xaxis.max).toBeCloseTo(0.1, 4);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });
    });

    describe('mousePan', function() {
        it ('pans on xaxis only', function () {
            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            var xaxis = plot.getXAxes()[0],
                yaxis = plot.getYAxes()[0],
                initialXmin = xaxis.min,
                initialXmax = xaxis.max,
                eventHolder = plot.getEventHolder(),
                pointCoords = [
                        { x: xaxis.p2c(4), y: xaxis.box.top + plot.offset().top + 10 },
                        { x: xaxis.p2c(5), y: xaxis.box.top + plot.offset().top + 15 }
                ];

            simulate.mouseDown(eventHolder, pointCoords[0].x, pointCoords[0].y);
            simulate.mouseMove(eventHolder, pointCoords[0].x, pointCoords[0].y);
            simulate.mouseMove(eventHolder, pointCoords[1].x, pointCoords[1].y);
            simulate.mouseUp(eventHolder, pointCoords[1].x, pointCoords[1].y);

            expect(xaxis.min).toBeCloseTo(xaxis.c2p(xaxis.p2c(initialXmin) + (pointCoords[0].x - pointCoords[1].x)), 0);
            expect(xaxis.max).toBeCloseTo(xaxis.c2p(xaxis.p2c(initialXmax) + (pointCoords[0].x - pointCoords[1].x)), 0);
            expect(yaxis.min).toBe(0);
            expect(yaxis.max).toBe(10);

        });

        it ('pans on yaxis only', function () {
            plot = $.plot(placeholder, [
                [
                    [0, 0],
                    [10, 10]
                ]
            ], options);

            var xaxis = plot.getXAxes()[0],
                yaxis = plot.getYAxes()[0],
                initialYmin = yaxis.min,
                initialYmax = yaxis.max,
                eventHolder = plot.getEventHolder(),
                pointCoords = [
                        { x: xaxis.box.left - 10, y: yaxis.p2c(4) },
                        { x: yaxis.p2c(3), y: yaxis.p2c(8) }
                ];

            simulate.mouseDown(eventHolder, pointCoords[0].x, pointCoords[0].y);
            simulate.mouseMove(eventHolder, pointCoords[0].x, pointCoords[0].y);
            simulate.mouseMove(eventHolder, pointCoords[1].x, pointCoords[1].y);
            simulate.mouseUp(eventHolder, pointCoords[1].x, pointCoords[1].y);

            expect(xaxis.min).toBe(0);
            expect(xaxis.max).toBe(10);
            expect(yaxis.min).toBeCloseTo(yaxis.c2p(yaxis.p2c(initialYmin) + (pointCoords[0].y - pointCoords[1].y)), 0);
            expect(yaxis.max).toBeCloseTo(yaxis.c2p(yaxis.p2c(initialYmax) + (pointCoords[0].y - pointCoords[1].y)), 0);

        });
    });
});
