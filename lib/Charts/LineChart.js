'use strict';

import {line as d3Line} from 'd3-shape';
import BaseChart from './BaseChart';
import d3Sync from './d3Sync';
import defined from 'terriajs-cesium/Source/Core/defined';

class LineChart extends BaseChart {

    render(chart, chartData, renderContext) {

        const { chartTransform, scales } = renderContext;
        const sx = scales.x, sy = scales.y[chartData.units], color = chartData.color || 'white';
        // If there are undefined or null y-values, just ignore them. This works well for initial and final undefined values,
        // and simply interpolates over intermediate ones. This may not be what we want.
        const path = d3Line() // NOTE: it was originally 'basic', which is not an interpolation
                .x(d => sx(d.x))
                .y(d => sy(d.y))(chartData.points.filter(point => defined(point.y)));
                // consider calling .defined() to allow discontinuous graphs

        d3Sync(chart, [chartData], 'path', (line, enter) => {

            line.attr('d', path)
                .style('fill', 'none')
                .style('stroke', color);

            // Can't do this on a transition call...
            if (typeof line.classed === 'function') {
                line.classed('line', true);
            }
        }, chartTransform);

    }
}

module.exports = LineChart;
