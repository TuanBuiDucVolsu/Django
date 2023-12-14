/**
 * LeftSidebar
 * @param {*} $
 */
!function ($) {
    'use strict';

    var Chart = function () {};

    /**
     * Dynamic Chart
     */
    Chart.prototype.lineChart = function(selector, data, options={}) {
        const chartOpts = {
            series: data,
            chart: {
                type: 'line',
                height: 350,
                zoom: {
                    enabled: false
                },
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 5,
                colors: undefined,
                strokeWidth: 0,
                fillOpacity: 1,
                discrete: [],
                shape: "circle",
                radius: 2,
                offsetX: 0,
                offsetY: 0,
                onClick: undefined,
                onDblClick: undefined,
                showNullDataPoints: true,
                hover: {
                    size: undefined,
                    sizeOffset: 3
                }
            }
        };
        Object.keys(options).forEach((key) => {
            if (key == 'title') {
                chartOpts['title'] = {
                    text: options[key],
                };
                return;
            }
            if (key == 'height') {
                chartOpts['chart']['height'] = options[key];
                return;
            }
            chartOpts[key] = options[key];
        });

        const chart = new ApexCharts(selector, chartOpts);
        chart.render();
    },

    Chart.prototype.init = function() {
        var self = this;
    },

    $.Chart = new Chart, $.Chart.Constructor = Chart
}(window.jQuery)
