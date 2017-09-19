/* eslint-disable */
/* global $, describe, it, xit, xdescribe, after, afterEach, expect*/

describe("flot touch navigate plugin", function () {
    var placeholder, plot, options;

    beforeEach(function () {
        placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
            .find('#test-container');
        options = {
            xaxes: [{ autoscale: 'exact' }],
            yaxes: [{ autoscale: 'exact' }],
            zoom: { interactive: true, amount: 10 },
            pan: { interactive: true, frameRate: -1, enableTouch: true }
        };
    });

    it('shows that the eventHolder is cleared through shutdown when the plot is replaced', function() {
        plot = $.plot(placeholder, [[]], options);

        var eventPlaceholder = plot.getEventHolder(),
            spy = spyOn(eventPlaceholder, 'removeEventListener').and.callThrough();

        plot = $.plot(placeholder, [[]], options);

        expect(spy).toHaveBeenCalledWith('panstart', jasmine.any(Function))
        expect(spy).toHaveBeenCalledWith('pandrag', jasmine.any(Function));
        expect(spy).toHaveBeenCalledWith('panend', jasmine.any(Function));

    });

    describe('touchZoom', function() {
        it('should zoom the plot',function() {
            plot = $.plot(placeholder, [
                [
                    [-1, 2],
                    [11, 12]
                ]
            ], options);

            var eventHolder = plot.getEventHolder(),
                xaxis = plot.getXAxes()[0],
                yaxis = plot.getYAxes()[0],
                initialXmin = xaxis.min,
                initialXmax = xaxis.max,
                initialYmin = yaxis.min,
                initialYmax = yaxis.max,
                initialCoords = [
                    getPairOfCoords(xaxis, yaxis, 3, 5),
                    getPairOfCoords(xaxis, yaxis, 7, 9)
                ],
                finalCoords = [
                    getPairOfCoords(xaxis, yaxis, 2, 4),
                    getPairOfCoords(xaxis, yaxis, 8, 10)
                ],
                midPointCoords = {
                    x: (xaxis.c2p(finalCoords[0].x - plot.offset().left) + xaxis.c2p(finalCoords[1].x - plot.offset().left)) / 2,
                    y: (yaxis.c2p(finalCoords[0].y - plot.offset().top) + yaxis.c2p(finalCoords[1].y - plot.offset().top)) / 2
                },
                amount = getDistance(finalCoords) / getDistance(initialCoords);

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

            expect(xaxis.min).toBeCloseTo((midPointCoords.x - initialXmin) * (1 - 1/amount) + initialXmin, 6);
            expect(xaxis.max).toBeCloseTo(initialXmax - (initialXmax - midPointCoords.x) * (1 - 1/amount), 6);
            expect(yaxis.min).toBeCloseTo((midPointCoords.y - initialYmin) * (1 - 1/amount) + initialYmin, 6);
            expect(yaxis.max).toBeCloseTo(initialYmax - (initialYmax - midPointCoords.y) * (1 - 1/amount), 6);
        });

        it('for multiple touches should take into account just the first two of them and zoom',function() {
            plot = $.plot(placeholder, [
                [
                    [-1, 2],
                    [11, 12]
                ]
            ], options);

            var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              initialCoords = [
                  getPairOfCoords(xaxis, yaxis, 3, 5),
                  getPairOfCoords(xaxis, yaxis, 7, 9),
                  getPairOfCoords(xaxis, yaxis, 3, 7),
                  getPairOfCoords(xaxis, yaxis, 5, 12)
              ],
              finalCoords = [
                  getPairOfCoords(xaxis, yaxis, 2, 4),
                  getPairOfCoords(xaxis, yaxis, 8, 10),
                  getPairOfCoords(xaxis, yaxis, 3, 9),
                  getPairOfCoords(xaxis, yaxis, 4, 20)
              ],
              midPointCoords = {
                  x: (xaxis.c2p(finalCoords[0].x - plot.offset().left) + xaxis.c2p(finalCoords[1].x - plot.offset().left)) / 2,
                  y: (yaxis.c2p(finalCoords[0].y - plot.offset().top) + yaxis.c2p(finalCoords[1].y - plot.offset().top)) / 2
              },
              amount = getDistance(finalCoords) / getDistance(initialCoords);

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

            expect(xaxis.min).toBeCloseTo((midPointCoords.x - initialXmin) * (1 - 1/amount) + initialXmin, 6);
            expect(xaxis.max).toBeCloseTo(initialXmax - (initialXmax - midPointCoords.x) * (1 - 1/amount), 6);
            expect(yaxis.min).toBeCloseTo((midPointCoords.y - initialYmin) * (1 - 1/amount) + initialYmin, 6);
            expect(yaxis.max).toBeCloseTo(initialYmax - (initialYmax - midPointCoords.y) * (1 - 1/amount), 6);
        });

        it('should ignore a third touch interference',function() {
            plot = $.plot(placeholder, [
                [
                    [-1, 2],
                    [11, 12]
                ]
            ], options);

            var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              initialCoords = [
                  getPairOfCoords(xaxis, yaxis, 3, 5),
                  getPairOfCoords(xaxis, yaxis, 7, 9),
              ],
              intermediateCoords = [
                  getPairOfCoords(xaxis, yaxis, 2, 4),
                  getPairOfCoords(xaxis, yaxis, 8, 10),
                  getPairOfCoords(xaxis, yaxis, 4, 20)
              ],
              finalCoords = [
                  getPairOfCoords(xaxis, yaxis, 2, 4),
                  getPairOfCoords(xaxis, yaxis, 8, 10),
                  getPairOfCoords(xaxis, yaxis, 5, 17)
              ],
              midPointCoords = {
                  x: (xaxis.c2p(finalCoords[0].x - plot.offset().left) + xaxis.c2p(finalCoords[1].x - plot.offset().left)) / 2,
                  y: (yaxis.c2p(finalCoords[0].y - plot.offset().top) + yaxis.c2p(finalCoords[1].y - plot.offset().top)) / 2
              },
              amount = getDistance(finalCoords) / getDistance(initialCoords);

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(intermediateCoords, eventHolder, 'touchmove');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

            expect(xaxis.min).toBeCloseTo((midPointCoords.x - initialXmin) * (1 - 1/amount) + initialXmin, 6);
            expect(xaxis.max).toBeCloseTo(initialXmax - (initialXmax - midPointCoords.x) * (1 - 1/amount), 6);
            expect(yaxis.min).toBeCloseTo((midPointCoords.y - initialYmin) * (1 - 1/amount) + initialYmin, 6);
            expect(yaxis.max).toBeCloseTo(initialYmax - (initialYmax - midPointCoords.y) * (1 - 1/amount), 6);
        });

        it('should pan the plot for two fingers with constant distance',function() {
            plot = $.plot(placeholder, [
                [
                    [-1, 2],
                    [11, 12]
                ]
            ], options);

            var eventHolder = plot.getEventHolder(),
                xaxis = plot.getXAxes()[0],
                yaxis = plot.getYAxes()[0],
                initialXmin = xaxis.min,
                initialXmax = xaxis.max,
                initialYmin = yaxis.min,
                initialYmax = yaxis.max,
                canvasCoords = [ { x : 3, y : 5 }, { x : 7, y : 9 }, { x : 2, y : 4 }, { x : 6, y : 8 }],
                initialCoords = [
                    getPairOfCoords(xaxis, yaxis, canvasCoords[0].x, canvasCoords[0].y),
                    getPairOfCoords(xaxis, yaxis, canvasCoords[1].x, canvasCoords[1].y)
                ],
                finalCoords = [
                  getPairOfCoords(xaxis, yaxis, canvasCoords[2].x, canvasCoords[2].y),
                  getPairOfCoords(xaxis, yaxis, canvasCoords[3].x, canvasCoords[3].y)
                ];

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

            expect(xaxis.min).toBeCloseTo(initialXmin + (canvasCoords[0].x - canvasCoords[2].x), 6);
            expect(xaxis.max).toBeCloseTo(initialXmax + (canvasCoords[0].x - canvasCoords[2].x), 6);
            expect(yaxis.min).toBeCloseTo(initialYmin + (canvasCoords[0].y - canvasCoords[2].y), 6);
            expect(yaxis.max).toBeCloseTo(initialYmax + (canvasCoords[0].y - canvasCoords[2].y), 6);

        });

        it('should not zoom the plot for two fingers with small distance variation',function() {
            plot = $.plot(placeholder, [
                [
                    [-1, 2],
                    [11, 12]
                ]
            ], options);

            var eventHolder = plot.getEventHolder(),
                xaxis = plot.getXAxes()[0],
                yaxis = plot.getYAxes()[0],
                initialXmin = xaxis.min,
                initialXmax = xaxis.max,
                initialYmin = yaxis.min,
                initialYmax = yaxis.max,
                canvasCoords = [ { x : 3, y : 5 }, { x : 7, y : 8.999 }, { x : 2, y : 4 }, { x : 6.001, y : 8 }],
                initialCoords = [
                    getPairOfCoords(xaxis, yaxis, canvasCoords[0].x, canvasCoords[0].y),
                    getPairOfCoords(xaxis, yaxis, canvasCoords[1].x, canvasCoords[1].y)
                ],
                finalCoords = [
                  getPairOfCoords(xaxis, yaxis, canvasCoords[2].x, canvasCoords[2].y),
                  getPairOfCoords(xaxis, yaxis, canvasCoords[3].x, canvasCoords[3].y)
                ];

            var spy = spyOn(plot, 'zoom').and.callThrough();

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

            expect(spy).not.toHaveBeenCalled();
        });

        it('should zoom the plot correctly using pageXY when the canvas is placed in the bottom scrollable area of the page', function () {
              var largeDiv = $('<div style="height: 800px"> </div>');
              $(largeDiv).insertBefore(placeholder);

              plot = $.plot(placeholder, [
                  [
                      [-1, 2],
                      [11, 12]
                  ]
              ], options);

              var eventHolder = plot.getEventHolder(),
                  xaxis = plot.getXAxes()[0],
                  yaxis = plot.getYAxes()[0],
                  initialXmin = xaxis.min,
                  initialXmax = xaxis.max,
                  initialYmin = yaxis.min,
                  initialYmax = yaxis.max,
                  initialCoords = [
                      getPairOfCoords(xaxis, yaxis, 3, 5),
                      getPairOfCoords(xaxis, yaxis, 7, 9)
                  ],
                  finalCoords = [
                      getPairOfCoords(xaxis, yaxis, 2, 4),
                      getPairOfCoords(xaxis, yaxis, 8, 10)
                  ],
                  midPointCoords = {
                          x: (xaxis.c2p(finalCoords[0].x - plot.offset().left) + xaxis.c2p(finalCoords[1].x - plot.offset().left)) / 2,
                          y: (yaxis.c2p(finalCoords[0].y - plot.offset().top) + yaxis.c2p(finalCoords[1].y - plot.offset().top)) / 2
                  },
                  amount = getDistance(finalCoords) / getDistance(initialCoords);

              simulate.sendTouchEvents(initialCoords, plot.getEventHolder(), 'touchstart');
              simulate.sendTouchEvents(finalCoords, plot.getEventHolder(), 'touchmove');
              simulate.sendTouchEvents(finalCoords, plot.getEventHolder(), 'touchend');

              expect(xaxis.min).toBeCloseTo((midPointCoords.x - initialXmin) * (1 - 1/amount) + initialXmin, 6);
              expect(xaxis.max).toBeCloseTo(initialXmax - (initialXmax - midPointCoords.x) * (1 - 1/amount), 6);
              expect(yaxis.min).toBeCloseTo((midPointCoords.y - initialYmin) * (1 - 1/amount) + initialYmin, 6);
              expect(yaxis.max).toBeCloseTo(initialYmax - (initialYmax - midPointCoords.y) * (1 - 1/amount), 6);
          });

        it('should zoom the plot on axis x',function() {
          plot = $.plot(placeholder, [
              [
                  [-1, 2],
                  [11, 12]
              ]
          ], options);

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              initialCoords = [
                  { x: xaxis.p2c(4), y: xaxis.box.top + plot.offset().top + 10 },
                  { x: xaxis.p2c(5), y: xaxis.box.top + plot.offset().top + 10 }
              ],
              finalCoords = [
                  getPairOfCoords(xaxis, yaxis, 2, 4),
                  getPairOfCoords(xaxis, yaxis, 6, 6)
              ],
              midPointCoords = {
                      x: (xaxis.c2p(finalCoords[0].x - plot.offset().left) + xaxis.c2p(finalCoords[1].x - plot.offset().left)) / 2,
                      y: (yaxis.c2p(finalCoords[0].y - plot.offset().top) + yaxis.c2p(finalCoords[1].y - plot.offset().top)) / 2
              },
              amount = getDistance(finalCoords) / getDistance(initialCoords);

          simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
          simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
          simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

          expect(Math.abs(xaxis.min - ((midPointCoords.x - initialXmin) * (1 - 1/amount) + initialXmin))).toBeLessThan(1);
          expect(Math.abs(xaxis.max - (initialXmax - (initialXmax - midPointCoords.x) * (1 - 1/amount)))).toBeLessThan(1);
          expect(yaxis.min).toBeCloseTo(initialYmin, 6);
          expect(yaxis.max).toBeCloseTo(initialYmax, 6);

        });

        it('should zoom the plot on axis y',function() {
            plot = $.plot(placeholder, [
                [
                    [-1, 2],
                    [11, 12]
                ]
            ], options);

            var eventHolder = plot.getEventHolder(),
                xaxis = plot.getXAxes()[0],
                yaxis = plot.getYAxes()[0],
                initialXmin = xaxis.min,
                initialXmax = xaxis.max,
                initialYmin = yaxis.min,
                initialYmax = yaxis.max,
                initialCoords = [
                    { x: xaxis.box.left - 10, y: yaxis.p2c(4) + plot.offset().top},
                    { x: xaxis.box.left - 20, y: yaxis.p2c(5) + plot.offset().top}
                ],
                finalCoords = [
                    getPairOfCoords(xaxis, yaxis, 2, 4),
                    getPairOfCoords(xaxis, yaxis, 6, 6)
                ],
                midPointCoords = {
                        x: (xaxis.c2p(finalCoords[0].x - plot.offset().left) + xaxis.c2p(finalCoords[1].x - plot.offset().left)) / 2,
                        y: (yaxis.c2p(finalCoords[0].y - plot.offset().top) + yaxis.c2p(finalCoords[1].y - plot.offset().top)) / 2
                },
                amount = getDistance(finalCoords) / getDistance(initialCoords);

            simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
            simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

            expect(xaxis.min).toBeCloseTo(initialXmin, 6);
            expect(xaxis.max).toBeCloseTo(initialXmax, 6);
            expect(Math.abs(yaxis.min - ((midPointCoords.y - initialYmin) * (1 - 1/amount) + initialYmin))).toBeLessThan(1);
            expect(Math.abs(yaxis.max - (initialYmax - (initialYmax - midPointCoords.x) * (1 - 1/amount)))).toBeLessThan(1);

          });

        function getDistance(coords) {
            return Math.sqrt((coords[0].x - coords[1].x) * (coords[0].x - coords[1].x) + ((coords[0].y - coords[1].y) * (coords[0].y - coords[1].y)));
        }
    });

    describe('touchDrag', function() {
      it('should drag the plot',function() {

        plot = $.plot(placeholder, [
            [
                [-10, 120],
                [-10, 120]
            ]
        ], options);

        var eventHolder = plot.getEventHolder(),
            xaxis = plot.getXAxes()[0],
            yaxis = plot.getYAxes()[0],
            initialXmin = xaxis.min,
            initialXmax = xaxis.max,
            initialYmin = yaxis.min,
            initialYmax = yaxis.max,
            canvasCoords = [ { x : 1, y : 1 }, { x : 100, y : 100 }],
            pointCoords = [
                    getPairOfCoords(xaxis, yaxis, canvasCoords[0].x, canvasCoords[0].y),
                    getPairOfCoords(xaxis, yaxis, canvasCoords[1].x, canvasCoords[1].y)
            ];

        simulate.touchstart(eventHolder, pointCoords[0].x, pointCoords[0].y);
        simulate.touchmove(eventHolder, pointCoords[1].x, pointCoords[1].y);
        simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

        expect(xaxis.min).toBeCloseTo(initialXmin + (canvasCoords[0].x - canvasCoords[1].x), 6);
        expect(xaxis.max).toBeCloseTo(initialXmax + (canvasCoords[0].x - canvasCoords[1].x), 6);
        expect(yaxis.min).toBeCloseTo(initialYmin + (canvasCoords[0].y - canvasCoords[1].y), 6);
        expect(yaxis.max).toBeCloseTo(initialYmax + (canvasCoords[0].y - canvasCoords[1].y), 6);

      });

      it('should drag the logarithmic plot', function() {
          var d1 = [];
          for (var i = 0; i < 14; i += 0.2) {
              d1.push([i, 1.01 + Math.sin(i)]);
          }

          var plot = $.plot(placeholder, [d1], {
              series: {
                  lines: { show: true },
                  points: { show: true }
              },
              xaxis: { autoscale: 'exact' },
              yaxis: { mode: 'log', showTickLabels: "all", autoscale: 'exact' },
              zoom: { interactive: true },
              pan: { interactive: true, enableTouch: true }
          });

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              canvasCoords = [ { x : 4, y : 0.7 }, { x : 2, y : 10 } ],
              pointCoords = [
                      getPairOfCoords(xaxis, yaxis, canvasCoords[0].x, canvasCoords[0].y),
                      getPairOfCoords(xaxis, yaxis, canvasCoords[1].x, canvasCoords[1].y)
              ];

          simulate.touchstart(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

          expect(xaxis.min).toBeCloseTo(initialXmin + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(xaxis.max).toBeCloseTo(initialXmax + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(yaxis.min).toBeCloseTo((yaxis.c2p(yaxis.p2c(initialYmin) + (pointCoords[0].y - pointCoords[1].y))), 6);
          expect(yaxis.max).toBeCloseTo((yaxis.c2p(yaxis.p2c(initialYmax) + (pointCoords[0].y - pointCoords[1].y))), 6);

      });

      it('should drag the point in the same way for many sequential moves as for one long move',function() {

         //deactivate ticks for precision
        options.yaxes[0].showTickLabels = 'none';
        options.xaxes[0].showTickLabels = 'all';

        plot = $.plot(placeholder, [
            [
                [-10, -10],
                [120, 120]
            ]
        ], options);

        var eventHolder = plot.getEventHolder(),
            xaxis = plot.getXAxes()[0],
            yaxis = plot.getYAxes()[0],
            initialXmin = xaxis.min,
            initialXmax = xaxis.max,
            initialYmin = yaxis.min,
            initialYmax = yaxis.max,
            limit = 5,
            canvasCoords = [],
            pointCoords = [];

        for (var i = 1; i <= limit; i++) {
            canvasCoords[i] = { x: i, y: i };
            pointCoords[i] = getPairOfCoords(xaxis, yaxis, canvasCoords[i].x, canvasCoords[i].y);
        }

        //simulate drag from (1, 1) to (100, 100) sequentially
        simulate.touchstart(eventHolder, pointCoords[1].x, pointCoords[1].y);
        for (var i = 2; i <= limit; i++) {
            simulate.touchmove(eventHolder, pointCoords[i].x, pointCoords[i].y);
        }
        simulate.touchend(eventHolder, pointCoords[limit].x, pointCoords[limit].y);

        // compare axes after sequential drag with axes after direct drag
        expect(Math.abs(xaxis.min - (initialXmin + (canvasCoords[1].x - canvasCoords[limit].x)))).toBeLessThan(1);
        expect(Math.abs(xaxis.max - (initialXmax + (canvasCoords[1].x - canvasCoords[limit].x)))).toBeLessThan(1);
        expect(yaxis.min).toBeCloseTo(initialYmin + (canvasCoords[1].y - canvasCoords[limit].y), 0);
        expect(yaxis.max).toBeCloseTo(initialYmax + (canvasCoords[1].y - canvasCoords[limit].y), 0);

      });

      it('should not pan the plot for a finger outside canvas',function() {
          plot = $.plot(placeholder, [
              [
                  [-10, 120],
                  [-10, 120]
              ]
          ], options);

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              canvasCoords = [ { x : 20, y : 20 }, { x : 120, y : 120 }],
              plotRight = plot.width() + plot.offset().left + plot.offset().right,
              plotBottom = plot.height() + plot.offset().top + plot.offset().bottom,
              pointCoords = [
                  {x: plotRight + canvasCoords[0].x, y: plotBottom + canvasCoords[0].y},
                  {x: plotRight + canvasCoords[1].x, y: plotBottom + canvasCoords[1].y}
              ];

          simulate.touchstart(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

          expect(xaxis.min).toBeCloseTo(initialXmin, 6);
          expect(xaxis.max).toBeCloseTo(initialXmax, 6);
          expect(yaxis.min).toBeCloseTo(initialYmin, 6);
          expect(yaxis.max).toBeCloseTo(initialYmax, 6);
      });

      it('should not pan the plot for a finger which comes from outside canvas',function() {
          plot = $.plot(placeholder, [
              [
                  [-10, 120],
                  [-10, 120]
              ]
          ], options);

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              canvasCoords = [ { x : 20, y : 20 }, { x : 120, y : 120 }],
              plotRight = plot.width() + plot.offset().left + plot.offset().right,
              plotBottom = plot.height() + plot.offset().top + plot.offset().bottom,
              pointCoords = [
                  {x: plotRight + canvasCoords[0].x, y: plotBottom + canvasCoords[0].y},
                  {x: canvasCoords[1].x, y: canvasCoords[1].y}
              ];

          simulate.touchstart(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

          expect(xaxis.min).toBeCloseTo(initialXmin, 6);
          expect(xaxis.max).toBeCloseTo(initialXmax, 6);
          expect(yaxis.min).toBeCloseTo(initialYmin, 6);
          expect(yaxis.max).toBeCloseTo(initialYmax, 6);
      });

      it('for multiple touches should take into account just the first two of them and pan',function() {
          plot = $.plot(placeholder, [
              [
                  [-1, 2],
                  [11, 12]
              ]
          ], options);

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              canvasCoords = [ { x : 3, y : 5 }, { x : 7, y : 9 }, { x : 1, y : 30 },
                 { x : 2, y : 4 }, { x : 6, y : 8 }, { x : 10, y : 11 }],
              initialCoords = [
                  getPairOfCoords(xaxis, yaxis, canvasCoords[0].x, canvasCoords[0].y),
                  getPairOfCoords(xaxis, yaxis, canvasCoords[1].x, canvasCoords[1].y),
                  getPairOfCoords(xaxis, yaxis, canvasCoords[2].x, canvasCoords[2].y)
              ],
              finalCoords = [
                getPairOfCoords(xaxis, yaxis, canvasCoords[3].x, canvasCoords[3].y),
                getPairOfCoords(xaxis, yaxis, canvasCoords[4].x, canvasCoords[4].y),
                getPairOfCoords(xaxis, yaxis, canvasCoords[5].x, canvasCoords[5].y)
              ];

          simulate.sendTouchEvents(initialCoords, eventHolder, 'touchstart');
          simulate.sendTouchEvents(finalCoords, eventHolder, 'touchmove');
          simulate.sendTouchEvents(finalCoords, eventHolder, 'touchend');

          expect(xaxis.min).toBeCloseTo(initialXmin + (canvasCoords[0].x - canvasCoords[3].x), 6);
          expect(xaxis.max).toBeCloseTo(initialXmax + (canvasCoords[0].x - canvasCoords[3].x), 6);
          expect(yaxis.min).toBeCloseTo(initialYmin + (canvasCoords[0].y - canvasCoords[3].y), 6);
          expect(yaxis.max).toBeCloseTo(initialYmax + (canvasCoords[0].y - canvasCoords[3].y), 6);

      });

      it('should drag the plot on the yaxis only', function() {
          plot = $.plot(placeholder, [
              [
                  [0, 0],
                  [10, 10]
              ]
          ], options);

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              pointCoords = [
                      { x: xaxis.box.left - 10, y: yaxis.p2c(4) },
                      { x: xaxis.box.left - 20, y: yaxis.p2c(5) }
              ];

          simulate.touchstart(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

          expect(xaxis.min).toBe(0);
          expect(xaxis.max).toBe(10);
          expect(yaxis.min).toBeCloseTo(yaxis.c2p(yaxis.p2c(initialYmin) + (pointCoords[0].y - pointCoords[1].y)), 6);
          expect(yaxis.max).toBeCloseTo(yaxis.c2p(yaxis.p2c(initialYmax) + (pointCoords[0].y - pointCoords[1].y)), 6);

      });

      it('should drag the plot on the xaxis only', function() {
          plot = $.plot(placeholder, [
              [
                  [0, 0],
                  [10, 10]
              ]
          ], options);

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              pointCoords = [
                      { x: xaxis.p2c(4), y: xaxis.box.top + plot.offset().top + 10 },
                      { x: xaxis.p2c(5), y: xaxis.box.top + plot.offset().top + 15 }
              ];

          simulate.touchstart(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

          expect(xaxis.min).toBeCloseTo(xaxis.c2p(xaxis.p2c(initialXmin) + (pointCoords[0].x - pointCoords[1].x)), 6);
          expect(xaxis.max).toBeCloseTo(xaxis.c2p(xaxis.p2c(initialXmax) + (pointCoords[0].x - pointCoords[1].x)), 6);
          expect(yaxis.min).toBe(0);
          expect(yaxis.max).toBe(10);

      });
    });

    describe('doubleTap', function() {
        it('should recenter the plot',function() {

          plot = $.plot(placeholder, [
              [
                  [-10, 120],
                  [-10, 120]
              ]
          ], options);

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              canvasCoords = [ { x : 1, y : 2 }, { x : 3, y : 5 }],
              pointCoords = [
                      getPairOfCoords(xaxis, yaxis, canvasCoords[0].x, canvasCoords[0].y),
                      getPairOfCoords(xaxis, yaxis, canvasCoords[1].x, canvasCoords[1].y)
              ];

          simulate.touchstart(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

          //check if the drag modified the plot correctly
          expect(xaxis.min).toBeCloseTo(initialXmin + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(xaxis.max).toBeCloseTo(initialXmax + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(yaxis.min).toBeCloseTo(initialYmin + (canvasCoords[0].y - canvasCoords[1].y), 6);
          expect(yaxis.max).toBeCloseTo(initialYmax + (canvasCoords[0].y - canvasCoords[1].y), 6);

          //simulate double tap
          simulate.touchstart(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchstart(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

          //check if axis values returned to initial coordinates
          expect(xaxis.min).toBeCloseTo(initialXmin, 6);
          expect(xaxis.max).toBeCloseTo(initialXmax, 6);
          expect(yaxis.min).toBeCloseTo(initialYmin, 6);
          expect(yaxis.max).toBeCloseTo(initialYmax, 6);

        });

        it('should recenter the plot on axis x',function() {

          plot = $.plot(placeholder, [
              [
                  [-10, -10],
                  [120, 120]
              ]
          ], options);

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              canvasCoords = [ { x : 1, y : 2 }, { x : 3, y : 5 }],
              pointCoords = [
                      getPairOfCoords(xaxis, yaxis, canvasCoords[0].x, canvasCoords[0].y),
                      getPairOfCoords(xaxis, yaxis, canvasCoords[1].x, canvasCoords[1].y)
              ];

          simulate.touchstart(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

          //check if the drag modified the plot correctly
          expect(xaxis.min).toBeCloseTo(initialXmin + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(xaxis.max).toBeCloseTo(initialXmax + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(yaxis.min).toBeCloseTo(initialYmin + (canvasCoords[0].y - canvasCoords[1].y), 6);
          expect(yaxis.max).toBeCloseTo(initialYmax + (canvasCoords[0].y - canvasCoords[1].y), 6);

          //simulate double tap
          simulate.touchstart(eventHolder, xaxis.p2c(5), xaxis.box.top + plot.offset().top + 15);
          simulate.touchend(eventHolder, xaxis.p2c(5), xaxis.box.top + plot.offset().top + 15);
          simulate.touchstart(eventHolder, xaxis.p2c(5), xaxis.box.top + plot.offset().top + 15);
          simulate.touchend(eventHolder, xaxis.p2c(5), xaxis.box.top + plot.offset().top + 15);

          //check if axis values returned to initial coordinates
          expect(xaxis.min).toBeCloseTo(initialXmin, 6);
          expect(xaxis.max).toBeCloseTo(initialXmax, 6);
          expect(yaxis.min).toBeCloseTo(initialYmin + (canvasCoords[0].y - canvasCoords[1].y), 6);
          expect(yaxis.max).toBeCloseTo(initialYmax + (canvasCoords[0].y - canvasCoords[1].y), 6);

        });

        it('should recenter the plot on axis y',function() {

          plot = $.plot(placeholder, [
              [
                  [-10, -10],
                  [120, 120]
              ]
          ], options);

          var eventHolder = plot.getEventHolder(),
              xaxis = plot.getXAxes()[0],
              yaxis = plot.getYAxes()[0],
              initialXmin = xaxis.min,
              initialXmax = xaxis.max,
              initialYmin = yaxis.min,
              initialYmax = yaxis.max,
              canvasCoords = [ { x : 1, y : 2 }, { x : 3, y : 5 }],
              pointCoords = [
                      getPairOfCoords(xaxis, yaxis, canvasCoords[0].x, canvasCoords[0].y),
                      getPairOfCoords(xaxis, yaxis, canvasCoords[1].x, canvasCoords[1].y)
              ];

          simulate.touchstart(eventHolder, pointCoords[0].x, pointCoords[0].y);
          simulate.touchmove(eventHolder, pointCoords[1].x, pointCoords[1].y);
          simulate.touchend(eventHolder, pointCoords[1].x, pointCoords[1].y);

          //check if the drag modified the plot correctly
          expect(xaxis.min).toBeCloseTo(initialXmin + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(xaxis.max).toBeCloseTo(initialXmax + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(yaxis.min).toBeCloseTo(initialYmin + (canvasCoords[0].y - canvasCoords[1].y), 6);
          expect(yaxis.max).toBeCloseTo(initialYmax + (canvasCoords[0].y - canvasCoords[1].y), 6);

          //simulate double tap
          simulate.touchstart(eventHolder, xaxis.box.left - 20, yaxis.p2c(5));
          simulate.touchend(eventHolder,  xaxis.box.left - 20, yaxis.p2c(5));
          simulate.touchstart(eventHolder, xaxis.box.left - 20, yaxis.p2c(5));
          simulate.touchend(eventHolder, xaxis.box.left - 20, yaxis.p2c(5));

          //check if axis values returned to initial coordinates
          expect(xaxis.min).toBeCloseTo(initialXmin + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(xaxis.max).toBeCloseTo(initialXmax + (canvasCoords[0].x - canvasCoords[1].x), 6);
          expect(yaxis.min).toBeCloseTo(initialYmin, 6);
          expect(yaxis.max).toBeCloseTo(initialYmax, 6);

        });
    });

    function getPairOfCoords(xaxis, yaxis, x, y) {
        return {
            x : xaxis.p2c(x) + plot.offset().left,
            y : yaxis.p2c(y) + plot.offset().top
        }
    }
});
