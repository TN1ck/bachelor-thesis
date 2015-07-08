import React               from 'react/addons';
import d3                  from 'd3';

import {icons}               from '../../assets.js';

// import {ReactSourceSelect, ReactSource} from './sources.js';

export default React.createClass({
    displayName: 'award',
    getDefaultProps: function() {
        return {
            image: icons.search,
            rotate: 0,
            translate: {
                x: 0,
                y: 0
            },
            type: 'king',
            scale: 0.8,
            x: 105,
            y: 205,
            fill: "#F6A623",
        }
    },
    render: function () {

        var fillColor = d3.rgb(this.props.fill).darker(0.4);
        var r = fillColor.r / 255;
        var g = fillColor.g / 255;
        var b = fillColor.b / 255;

        // good post on how this works: http://stackoverflow.com/questions/21977929/match-colors-in-fecolormatrix-filter
        var colorID = `color-${this.props.fill.slice(1, -1)}`;
        var colorFilter = <filter
            id={colorID}
            dangerouslySetInnerHTML={
                {
                    __html: `<feColorMatrix
                        color-interpolation-filters="sRGB"
                        in="SourceGraphic"
                        type="matrix"
                        values="
                            0 0 0 0 ${r}
                            0 0 0 0 ${g}
                            0 0 0 0 ${b}
                            0 0 0 1 0"/>`
                }
        }/>

        var filter = <filter
            id="white"
            dangerouslySetInnerHTML={
                {
                    __html: `<feColorMatrix
                        in="SourceGraphic"
                        type="matrix"
                        values="
                            0 0 0 0 1
                            0 0 0 0 1
                            0 0 0 0 1
                            0 0 0 1 0"/>`
                }
            }
        />


        var image = <g dangerouslySetInnerHTML={
            {
                __html: `<image
                    filter="url(#white)"
                    style="transform-origin: 50% 50%;
                           transform: scale(${this.props.scale})"
                    xlink:href="${icons[this.props.image]}"
                    x=${this.props.x} y=${this.props.y}
                    width="90" height="90"/>
                </image>`
            }
        }/>;
        var kingCrown = <g dangerouslySetInnerHTML={
            {
                __html: `<image
                    filter="url(#${colorID})"
                    x="26"
                    y="44"
                    width="248"
                    height="219"
                    xlink:href="${icons.crown_king}">
                </image>`
            }
        }/>;
        var emperorCrown = <g dangerouslySetInnerHTML={
            {
                __html: `<image
                    filter="url(#${colorID})"
                    x="26"
                    y="-14"
                    width="248"
                    height="219"
                    xlink:href="${icons.crown_emperor}">
                </image>`
            }
        }/>;

        var crown;
        var translateY = -60;
        var viewBoxY = 280;

        if (this.props.type === 'king') {
            translateY = -40;
            crown = kingCrown;
        }

        if (this.props.type === 'emperor') {
            translateY = 0;
            crown = emperorCrown;
        }

        if (this.props.center) {
            translateY = 0;
            viewBoxY = 350;
        }


        return (
            <svg width="251px" height="340px" viewBox={`0 40 251 ${viewBoxY}`}>
                <defs>
                    {filter}
                    {colorFilter}
                </defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" >
                    <g id="first-login-copy" transform={`translate(-24.00, ${translateY})`}>
                        <circle id="Oval-1" fill={this.props.fill} cx="150" cy="250" r="100"></circle>
                        {crown}
                        <g>
                            {image}
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
});
