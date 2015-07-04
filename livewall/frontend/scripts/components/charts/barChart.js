import React      from 'react/addons';
import d3         from 'd3';
import $          from 'jquery';
import _          from 'lodash';

import { colors } from '../../../shared/util/colors.js';

class BarChart {
    constructor(root) {
        this.$root = $(root);
        this.root = d3.select(root);
        this.margins = {
            top: 20,
            bottom: 20,
            left: 20,
            right: 0
        };

        this.bars = this.root.append('g').attr('class', 'bars');
        this.text = this.root.append('g');

        this.colors = [
            colors.vinrouge,
            colors.buttercup,
            colors.sushi,
            colors.puerto_rico,
            colors.curious_blue
        ];

    }

    draw (data) {

        if (_.sum(data, d => d.x) > 0) {
            this.data = data;
            this.before();
            this.update();
        }

    }

    before () {

        this.width  = this.$root.width();
        this.height = this.$root.height();

        this.dimensions = {
            x: [this.margins.left, this.width - this.margins.right],
            y: [this.margins.top, this.height - this.margins.bottom]
        };

        this.xScale = d3.scale.linear()
            .domain(d3.extent(this.data, d => d.x))
            .range(this.dimensions.x);

        this.yScale = d3.scale.linear()
            .domain([0, this.data.length])
            .range(this.dimensions.y);

        this.barMargin = 10;

    }

    update () {

        // bars
        var selection = this.bars.selectAll('.bar')
            .data(this.data);

        var barHeight = ((this.height - (this.margins.left + this.margins.right)) /  this.data.length) - this.barMargin;

        selection.enter()
            .append('rect')
            .attr({
                class: 'bar',
                x: 0,
                y: (d, i) => this.yScale(i),
                width: 0,
                height: barHeight,
                fill: (d, i) => this.colors[i % this.colors.length]
            });

        this.bars.selectAll('.bar')
            .transition()
            .duration(1000)
            .attr({
                class: 'bar',
                x: 0,
                y: (d, i) => this.yScale(i),
                width: d => this.xScale(d.x),
                height: barHeight,
                fill: (d, i) => this.colors[i % this.colors.length]
            });


        selection.exit()
            .remove();

        // text
        var textSelection = this.text.selectAll('.text').data(this.data);

        // enter
        textSelection.enter()
            .append('text')
            .text(d => `${d.y} - ${d.x}`)
            .attr({
                class: 'text',
                y: (d, i) => this.yScale(i) + barHeight / 2 + 5,
                x: 10
            }).style({
                'fill': 'white',
                'text-anchor': (d, i) => {
                    var x = this.xScale(d.x);
                    if (i === 0) {
                        return  'end';
                    } else {
                        return 'start';
                    }
                }
            });

        // update
        this.text.selectAll('.text')
            .transition()
            .duration(1000)
            .text(d => `${d.y} - ${d.x}`)
            .attr({
                class: 'text',
                y: (d, i) => this.yScale(i) + barHeight / 2 + 5,
                x: (d, i) => {
                    var x = this.xScale(d.x);
                    if (i === 0) {
                        return  x - 10;
                    }
                    return x + 10;
                }
            })
            .style({
                'text-anchor': (d, i) => {
                    var x = this.xScale(d.x);
                    if (i === 0) {
                        return  'end';
                    } else {
                        return 'start';
                    }
                }
            });

        textSelection.exit().remove();

    }

}


export default React.createClass({

    componentDidMount: function() {
        this.chart = new BarChart(React.findDOMNode(this.refs.chart));
        this.listener = window.addEventListener('resize', _.debounce(() => {
            this.chart.draw(this.props.data);
        }), 50);
        this.chart.draw(this.props.data);
    },
    componentDidUpdate: function () {
        this.chart.draw(this.props.data);
    },
    componentWillUnmount: function () {
        document.removeEventListener(this.listener);
    },
    render: function () {
        return (
            <div className='bar-chartl' style={{width: '100%'}}>
                <svg style={{
                    height: '300px',
                    width: '100%'
                }} ref='chart'></svg>
            </div>
        );
    }
});
