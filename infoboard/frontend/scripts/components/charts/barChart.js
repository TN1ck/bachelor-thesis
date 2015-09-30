import React      from 'react/addons';
import d3         from 'd3';
import $          from 'jquery';
import _          from 'lodash';

import { colors } from '../../../shared/util/colors.js';

/**
 * Simple Barchart
 */
class BarChart {

    /**
     * Initialize the Barchart
     *
     * @param {Node} The Node the chart will be appended to
     */
    constructor(root) {
        this.$root = $(root);
        this.root = d3.select(root);

        // margins
        this.margins = {
            top: 20,
            bottom: 20,
            left: 20,
            right: 0
        };

        this.bars = this.root.append('g').attr('class', 'bars');
        this.text = this.root.append('g');

        // used colors
        this.colors = [
            colors.crimson,
            colors.vinrouge,
            colors.buttercup,
            colors.sushi,
            colors.puerto_rico,
            colors.curious_blue
        ];

    }

    /**
     * Draw the chart with the provided data
     *
     * @param {Object[]} The data to be plotted, the data has the format:
     * [{x: 0, y: 'name'}, {x: 1, y: 'name 2'}, ... ]
     */
    draw (data) {

        // Make sure there is actually any data
        if (_.sum(data, d => d.x) > 0) {
            this.data = data;
            this.before();
            this.update();
        }

    }

    /**
     * Set up scales and dimensions
     */
    before () {

        this.width  = this.$root.width();
        this.height = this.$root.height();

        // range of the scales
        this.dimensions = {
            x: [this.margins.left, this.width - this.margins.right],
            y: [this.margins.top, this.height - this.margins.bottom]
        };

        // x-scale
        this.xScale = d3.scale.linear()
            .domain(d3.extent(this.data, d => d.x))
            .range(this.dimensions.x);

        // y-scale
        this.yScale = d3.scale.linear()
            .domain([0, this.data.length])
            .range(this.dimensions.y);

        // space between bars
        this.barMargin = 10;

    }

    /**
     * Update all elements according to the set data
     */
    update () {

        // bars
        var selection = this.bars.selectAll('.barchart__bar')
            .data(this.data);

        // calculate the `height` of the bars, do not confuse this with a columnchart
        var barHeight = (
            (this.height - (this.margins.left + this.margins.right)
        ) /  this.data.length) - this.barMargin;

        // ENTER BARS
        selection.enter()
            .append('rect')
            .attr({
                class: 'barchart__bar',
                x: 0,
                y: (d, i) => this.yScale(i),
                width: 0, // start at 0 to have a nice animation
                height: barHeight,
                fill: (d, i) => this.colors[i % this.colors.length]
            });

        // UPDATE BARS
        this.bars.selectAll('.barchart__bar')
            .transition()
            .duration(1000)
            .attr({
                class: 'barchart__bar',
                x: 0,
                y: (d, i) => this.yScale(i),
                width: d => this.xScale(d.x),
                height: barHeight,
                fill: (d, i) => this.colors[i % this.colors.length]
            });

        // EXIT BARS
        selection.exit()
            .remove();

        // text
        var textSelection = this.text.selectAll('.barchart__text').data(this.data);

        var largerThanCenter = (d) => {
            var max = this.xScale.domain()[1];
            return ((d.x * 2) >= max);
        };

        // ENTER TEXT
        textSelection.enter()
            .append('text')
            .text(d => `${d.y} - ${d.x}`)
            .attr({
                class: 'barchart__text',
                y: (d, i) => this.yScale(i) + barHeight / 2 + 5,
                x: 10
            }).style({
                'text-anchor': (d) => {
                    return largerThanCenter(d) ? 'end' : 'start';
                }
            });

        // UPDATE TEXT
        this.text.selectAll('.barchart__text')
            .transition()
            .duration(1000)
            .text(d => {
                var sign = d.negative ? -1 : 1;
                return `${d.y} ${d3.format('+')(sign * d.x)}`;
            })
            .attr({
                class: (d) => {
                    return `barchart__text barchart__text--${largerThanCenter(d) ? 'inner' : 'outer'}`;
                },
                y: (d, i) => this.yScale(i) + barHeight / 2 + 5,
                x: (d) => {
                    var x = this.xScale(d.x);
                    return largerThanCenter(d) ? x - 10 : x + 10;
                }
            })
            .style({
                'text-anchor': (d) => {
                    return largerThanCenter(d) ? 'end' : 'start';
                }
            });

        // EXIT TEXT
        textSelection.exit().remove();

    }

}

/**
 * Wraps the barchart into a reusable React-Component
 */
export default React.createClass({
    displayName: 'BarChart',

    propTypes: {
        data: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    componentDidMount: function() {
        this.chart = new BarChart(React.findDOMNode(this.refs.chart));
        // update the chart when the window resizes
        this.listener = window.addEventListener('resize', _.debounce(() => {
            this.chart.draw(this.props.data);
        }), 50);
        this.chart.draw(this.props.data);
    },

    componentDidUpdate: function () {
        this.chart.draw(this.props.data);
    },

    componentWillUnmount: function () {
        document.removeEventListener('resize', this.listener);
    },

    render: function () {
        return (
            <div className='barchart' style={{width: '100%'}}>
                <svg style={{
                    height: '300px',
                    width: '100%'
                }} ref='chart'></svg>
            </div>
        );
    }
});
