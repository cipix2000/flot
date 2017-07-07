describe('flot', function() {
    describe('setRange', function() {
        var placeholder, plot;

        var options = {
            series: {
                shadowSize: 0, // don't draw shadows
                lines: { show: false },
                points: { show: true, fill: false, symbol: 'circle' }
            }
        };

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should keep the axis min and max for none autoscaling if no data is set', function () {
            options.xaxis = {autoscale: 'none', min: 0, max: 50};
            options.yaxis = {autoscale: 'none', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should swap the axis min and max for min > max', function () {
            options.xaxis = {autoscale: 'none', min: 50, max: 0};
            options.yaxis = {autoscale: 'none', min: 100, max: 0};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for exact autoscaling if no data is set', function () {
            options.xaxis = {autoscale: 'exact', min: 0, max: 50};
            options.yaxis = {autoscale: 'exact', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for grow-exact autoscaling if no data is set', function () {
            options.xaxis = {autoscale: 'exact', growOnly: true, min: 0, max: 50};
            options.yaxis = {autoscale: 'exact', growOnly: true, min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for loose autoscaling if no data is set', function () {
            options.xaxis = {autoscale: 'loose', min: 0, max: 50};
            options.yaxis = {autoscale: 'loose', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for grow-loose autoscaling if no data is set', function () {
            options.xaxis = {autoscale: 'loose', growOnly: true, min: 0, max: 50};
            options.yaxis = {autoscale: 'loose', growOnly: true, min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should keep the axis min and max for window autoscaling if no data is set', function () {
            options.xaxis = {autoscale: 'sliding-window', min: 0, max: 50};
            options.yaxis = {autoscale: 'sliding-window', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should not shift the axis min and max for window autoscaling if data is in window', function () {
            options.xaxis = {autoscale: 'sliding-window', min: 0, max: 10};
            options.yaxis = {autoscale: 'sliding-window', min: 0, max: 10};
            // default window size is 100
            plot = $.plot(placeholder, [[]], options);
            plot.setData([[[0, 0], [50, 50], [100, 100]]]);
            plot.setupGrid();
            plot.draw();
            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(100);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should shift the axis min and max for window autoscaling if data is bigger than window', function () {
            options.xaxis = {autoscale: 'sliding-window', min: 0, max: 10};
            options.yaxis = {autoscale: 'sliding-window', min: 0, max: 10};
            // default window size is 100
            plot = $.plot(placeholder, [[]], options);
            plot.setData([[[0, 0], [100, 100], [200, 200]]]);
            plot.setupGrid();
            plot.draw();
            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(100);
            expect(axes.xaxis.max).toBe(200);
            expect(axes.yaxis.min).toBe(100);
            expect(axes.yaxis.max).toBe(200);
        });

        it('should widen the axis max if axis min is the same as axis max', function () {
            options.xaxis = {min: 0, max: 0};
            options.yaxis = {min: 2, max: 2};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(1);
            expect(axes.yaxis.min).toBe(2);
            expect(axes.yaxis.max).toBe(2.01);
        });

        it('should widen the axis min and max if both are null', function () {
            options.xaxis = {};
            options.yaxis = {};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(-0.01);
            expect(axes.xaxis.max).toBe(0.01);
            expect(axes.yaxis.min).toBe(-0.01);
            expect(axes.yaxis.max).toBe(0.01);
        });

        it('should widen the axis min if is null', function () {
            options.xaxis = {max: 1};
            options.yaxis = {max: 0};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();

            expect(axes.xaxis.min).toBe(-1);
            expect(axes.xaxis.max).toBe(1);
            expect(axes.yaxis.min).toBe(-1);
            expect(axes.yaxis.max).toBe(0);
        });

        it('should not change the axis min and max for none autoscaling if data is set', function () {
            options.xaxis = {autoscale: 'none', min: 0, max: 50};
            options.yaxis = {autoscale: 'none', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();
            plot.setData([[[0, 1], [1, 2]]]);
            plot.setupGrid();
            plot.draw();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(50);
            expect(axes.yaxis.min).toBe(0);
            expect(axes.yaxis.max).toBe(100);
        });

        it('should change the axis min and max for exact autoscaling if data is set', function () {
            options.xaxis = {autoscale: 'exact', min: 0, max: 50};
            options.yaxis = {autoscale: 'exact', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();
            plot.setData([[[0, 1], [1, 2]]]);
            plot.setupGrid();
            plot.draw();

            expect(axes.xaxis.min).toBe(0);
            expect(axes.xaxis.max).toBe(1);
            expect(axes.yaxis.min).toBe(1);
            expect(axes.yaxis.max).toBe(2);
        });

        it('should change the axis min and max for loose autoscaling if data is set', function () {
            options.xaxis = {autoscale: 'loose', min: 0, max: 50};
            options.yaxis = {autoscale: 'loose', min: 0, max: 100};
            plot = $.plot(placeholder, [[]], options);

            var axes = plot.getAxes();
            plot.setData([[[0, 0], [10, 100]]]);
            plot.setupGrid();
            plot.draw();

            expect(axes.xaxis.min).toBe(-1);
            expect(axes.xaxis.max).toBe(11);
            expect(axes.yaxis.min).toBe(-20);
            expect(axes.yaxis.max).toBe(120);
        });
    });

    describe('computeRangeForDataSeries', function() {
        var placeholder, plot;

        var options = {
            series: {
                shadowSize: 0, // don't draw shadows
                lines: { show: false },
                points: { show: true, fill: false, symbol: 'circle' }
            }
        };

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should return Infinity and -Infinity for the minimum and the maximum respectively of x and y for an empty series', function () {
            plot = $.plot(placeholder, [[]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0]);

            expect(limits.xmin).toBe(Infinity);
            expect(limits.xmax).toBe(-Infinity);
            expect(limits.ymin).toBe(Infinity);
            expect(limits.ymax).toBe(-Infinity);
        });

        it('should return the minimum and the maximum of x and y for a series', function () {
            plot = $.plot(placeholder, [[[0, 1], [1, 2], [2, 3]]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0]);

            expect(limits.xmin).toBe(0);
            expect(limits.xmax).toBe(2);
            expect(limits.ymin).toBe(1);
            expect(limits.ymax).toBe(3);
        });

        it('should return the minimum and the maximum of x and y for an xy series', function () {
            plot = $.plot(placeholder, [[[10, 1], [11, 2], [12, 3]]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0]);

            expect(limits.xmin).toBe(10);
            expect(limits.xmax).toBe(12);
            expect(limits.ymin).toBe(1);
            expect(limits.ymax).toBe(3);
        });

        it('should not compute the minimum and the maximum when autoscale="none"', function () {
            options.xaxis = {autoscale: 'none'};
            options.yaxis = {autoscale: 'none'};
            plot = $.plot(placeholder, [[[0, 1], [1, 2], [2, 3]]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0]);

            expect(limits.xmin).toBe(Infinity);
            expect(limits.xmax).toBe(-Infinity);
            expect(limits.ymin).toBe(Infinity);
            expect(limits.ymax).toBe(-Infinity);
        });

        it('should compute the minimum and the maximum when autoscale="none" and force=true', function () {
            options.xaxis = {autoscale: 'none'};
            options.yaxis = {autoscale: 'none'};
            plot = $.plot(placeholder, [[[0, 1], [1, 2], [2, 3]]], options);

            var series = plot.getData();
            var limits = plot.computeRangeForDataSeries(series[0], true);

            expect(limits.xmin).toBe(0);
            expect(limits.xmax).toBe(2);
            expect(limits.ymin).toBe(1);
            expect(limits.ymax).toBe(3);
        });
    });

    describe('adjustSeriesDataRange', function() {
        var placeholder, plot;

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
            plot = $.plot(placeholder, [[]], {});
        });

        it('should set the minimum to zero if needed when {lines|bars}.show=true and {lines|bars}.zero=true', function () {
            [true, false].forEach(function(show) {
                var series = {
                        lines: { show: show, zero: show },
                        bars: { show: !show, zero: !show },
                        datapoints: { pointsize: 1 }
                    },
                    limits = {xmin: 10, ymin: 11, xmax: 12, ymax: 13};

                limits = plot.adjustSeriesDataRange(series, limits);

                expect(limits.ymin).toBe(0);
                expect(limits.ymax).toBe(13);
            });
        });

        it('should set the maximum to zero if needed when {lines|bars}.show=true and {lines|bars}.zero=true', function () {
            [true, false].forEach(function(show) {
                var series = {
                        lines: { show: show, zero: show },
                        bars: { show: !show, zero: !show },
                        datapoints: { pointsize: 1 }
                    },
                    limits = {xmin: 10, ymin: -11, xmax: 12, ymax: -9};

                limits = plot.adjustSeriesDataRange(series, limits);

                expect(limits.ymin).toBe(-11);
                expect(limits.ymax).toBe(0);
            });
        });

        it('should not change the limits of the y when {lines|bars}.show=true, {lines|bars}.zero=true, but datapoints.pointsize>2', function () {
            [true, false].forEach(function(show) {
                var series = {
                        lines: { show: show, zero: show },
                        bars: { show: !show, zero: !show },
                        datapoints: { pointsize: 3 }
                    },
                    limits = {xmin: 10, ymin: -11, xmax: 12, ymax: -9};

                limits = plot.adjustSeriesDataRange(series, limits);

                expect(limits.ymin).toBe(-11);
                expect(limits.ymax).toBe(-9);
            });
        });

        it('should change the limits of x to fit the width of the bars', function () {
            var series = {
                    lines: { show: false },
                    bars: { show: true, align: 'center', barWidth: 6 }
                },
                limits = {xmin: 10, ymin: 11, xmax: 12, ymax: 13};

            limits = plot.adjustSeriesDataRange(series, limits);

            expect(limits.xmin).toBe(10 - 6 / 2);
            expect(limits.xmax).toBe(12 + 6 / 2);
        });
    });

    describe('setupTickFormatter', function() {
        var placeholder, plot, sampledata = [[0, 1], [1, 1.1], [2, 1.2]];

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should set a default tick formatter to each default axis', function () {
            plot = $.plot(placeholder, [sampledata], { });

            plot.getXAxes().concat(plot.getYAxes()).forEach(function(axis) {
                expect(typeof axis.tickFormatter).toBe('function');
            });
        });

        it('should set a default tick formatter to each specified axis', function () {
            plot = $.plot(placeholder, [sampledata], {
                xaxis: { autoscale: 'exact' },
                yaxes: [
                    { autoscale: 'exact' },
                    { autoscale: 'none', min: -1, max: 1 }
                ]
            });

            plot.getXAxes().concat(plot.getYAxes()).forEach(function(axis) {
                expect(typeof axis.tickFormatter).toBe('function');
            });
        });

        it('should set and use the specified tick formatter', function () {
            var formatters = [
                jasmine.createSpy('formatter'),
                jasmine.createSpy('formatter'),
                jasmine.createSpy('formatter')
            ];
            plot = $.plot(placeholder, [sampledata], {
                xaxis: { autoscale: 'exact', tickFormatter: formatters[0] },
                yaxes: [
                    { autoscale: 'exact', tickFormatter: formatters[1] },
                    { autoscale: 'none', min: -1, max: 1, tickFormatter: formatters[2], show: true }
                ]
            });

            formatters.forEach(function(formatter) {
                expect(formatter).toHaveBeenCalled();
            });
        });

        it('should leave the formatter set to the axis unchanged when updating the plot', function () {
            var formatter = jasmine.createSpy('formatter');
            plot = $.plot(placeholder, [sampledata], { });

            // the absolute/relative time plugin is setting the tickFormatter
            //directly to the axes just like here:
            plot.getXAxes()[0].tickFormatter = formatter;

            plot.setData([sampledata, sampledata]);
            plot.setupGrid();
            plot.draw();

            expect(plot.getXAxes()[0].tickFormatter).toBe(formatter);
        });
    });

    describe('computeTickSize', function() {
        var placeholder;
        var plot;
        var sampledata = [[0, 1], [1, 1.1], [2, 1.2]];

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('should return the correct size', function () {
            plot = $.plot(placeholder, [sampledata], {});

            var testVector = [
                [1, 10, 10, 1],
                [1, 1.01, 10, 0.001],
                [0.99963, 0.99964, 5, 0.000002],
                [1, 1.1, 5, 0.02],
                [0, 10000, 5, 2000],
                [0, 10, 4, 2.5],
                [0, 750, 10, 100],
                [0, 740, 10, 50]
            ];

            testVector.forEach(function (t) {
                var min = t[0],
                    max = t[1],
                    ticks = t[2],
                    expectedValue = t[3],
                    size = plot.computeTickSize(min, max, ticks);

                expect(size).toEqual(expectedValue);
            });
        });

        it('should depend on tickDecimals when specified', function() {
            plot = $.plot(placeholder, [sampledata], {});

            var testVector = [
                [1, 10, 10, 3, 1],
                [1, 1.01, 10, 2, 0.01],
                [0.99963, 0.99964, 5, 3, 0.001],
                [1, 1.1, 5, 1, 0.1],
                [0, 10000, 5, 1, 2000],
                [1, 1.00000000000001, 10, 5, 0.00001],
                [0, 10, 4, 0, 2],
                [0, 750, 10, 1, 100],
                [0, 740, 10, 10, 50],
                [0, 1000, 4, 2, 250]
            ];

            testVector.forEach(function(t) {
                var min = t[0],
                    max = t[1],
                    ticks = t[2],
                    tickDecimals = t[3],
                    expectedValue = t[4];

                var size = plot.computeTickSize(min, max, ticks, tickDecimals);

                expect(size).toEqual(expectedValue);
            });
        });
    });

    describe('defaultTickGenerator', function() {
        var placeholder;

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('works for the maximum axis interval', function () {
            var plot = $.plot(placeholder, [[[0, -Number.MAX_VALUE], [1, Number.MAX_VALUE]]], {});

            var yaxis = plot.getYAxes()[0];

            expect(yaxis.ticks).not.toEqual([]);
        });
    });

    describe('decimation', function () {
        var placeholder;

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('calls the "decimate" function of data series when the plot type is line', function () {
            var expected = [1, 2, 3, 3];
            var decimate = jasmine.createSpy('decimate').and.returnValue(expected);
            var data = [{data: [], decimate: decimate}];

            $.plot(placeholder, data, {series: {lines: {show: true}}});

            expect(decimate).toHaveBeenCalled();
        });

        it('calls the "decimatePoints" function of data series when the plot type is points', function () {
            var expected = [1, 2, 3, 3];
            var decimatePoints = jasmine.createSpy('decimate').and.returnValue(expected);
            var data = [{data: [], decimatePoints: decimatePoints}];

            $.plot(placeholder, data, {series: {lines: {show: false}, points: {show: true}}});

            expect(decimatePoints).toHaveBeenCalled();
        });

        it('calls the "decimate" function of data series when the plot type is bars', function () {
            var expected = [1, 2, 3, 3];
            var decimateBars = jasmine.createSpy('decimate').and.returnValue(expected);
            var data = [{data: [], decimate: decimateBars}];

            $.plot(placeholder, data, {series: {lines: {show: false}, bars: {show: true}}});

            expect(decimateBars).toHaveBeenCalled();
        });
    });

    describe('setData', function () {
        var placeholder;
        var data = [[[1, 2], [3, 4]]];

        beforeEach(function() {
            placeholder = setFixtures('<div id="test-container" style="width: 600px;height: 400px">')
                .find('#test-container');
        });

        it('stores data in the internal buffer', function () {
            var expected = [1, 2, 3, 4];

            var plot = $.plot(placeholder, [], {});
            plot.setData(data);

            var series = plot.getData();
            expect(series.length).toEqual(1);
            expect(series[0].data).toEqual(data[0]);
            expect(series[0].datapoints.points).toEqual(expected);
            expect(series[0].datapoints.pointsize).toEqual(2);
        });

        it('reuses the internal buffer', function () {
            var plot = $.plot(placeholder, [[]], {});
            var buffer = plot.getData()[0].datapoints.points;

            plot.setData(data);

            expect(plot.getData()[0].datapoints.points).toBe(buffer);
        });

        it('expands the internal buffer as neccessary', function () {
            var plot = $.plot(placeholder, [[[3, 4]]], {});
            expect(plot.getData()[0].datapoints.points.length).toBe(2);

            plot.setData(data);
            expect(plot.getData()[0].datapoints.points.length).toBe(4);
        });

        it('shrinks the internal buffer as neccessary', function () {
            var plot = $.plot(placeholder, [[[3, 4], [5, 6], [6, 7], [8, 9]]], {});
            expect(plot.getData()[0].datapoints.points.length).toBe(8);

            plot.setData(data);
            expect(plot.getData()[0].datapoints.points.length).toBe(4);
        });
    });
});
