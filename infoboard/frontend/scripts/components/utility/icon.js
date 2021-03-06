import React               from 'react/addons';
import d3                  from 'd3';

import {icons}             from '../../assets.js';

/**
 * Component to create Icons as well as Badges
 */
export default React.createClass({
    displayName: 'Icon',

    propTypes: {
        image: React.PropTypes.string,
        type: React.PropTypes.string,
        scale: React.PropTypes.number,
        x: React.PropTypes.number,
        y: React.PropTypes.number,
        rotate: React.PropTypes.number,
        fill: React.PropTypes.string
    },

    // create a psoude-uuid for the ids
    uuid: function () {
        return `${this.props.fill}_${this.props.type}_${this.props.image}`;
    },

    getDefaultProps: function() {
        // default props
        return {
            image: icons.query,
            rotate: 0,
            type: 'none',
            scale: 1.0,
            x: 105,
            y: 205,
            fill: '#F6A623'
        };
    },

    render: function () {

        var uuid = this.uuid();

        // make the fill slighly darker
        var fillColor = d3.rgb(this.props.fill).darker(0.4);
        var r = fillColor.r / 255;
        var g = fillColor.g / 255;
        var b = fillColor.b / 255;

        /* To speed up the creation of badges we implement a colorFilter which
           will be used to color the given icon-pictures.
           A good post on how this works can be found here:
           http://stackoverflow.com/questions/21977929/match-colors-in-fecolormatrix-filter
        */

        // the id of the filter, we need to strip the #
        var colorID = `${uuid}_color_${this.props.fill.slice(1, -1)}`;
        var colorFilter = (
            <filter
                id={colorID}
                /* react does not currently support a wide variety of svg-attributes
                   this is a way to be able to still use them */
                dangerouslySetInnerHTML={
                    {
                        __html: `<feColorMatrix
                            color-interpolation-filters="sRGB"
                            type="matrix"
                            values="0 0 0 0 ${r}, 0 0 0 0 ${g}, 0 0 0 0 ${b}, 0 0 0 1 0">
                            </feColorMatrix>`
                    }
            }/>
        );

        // white-color-filter
        var whiteID = `${uuid}_white`;
        var whiteFilter = (
            <filter
                id={whiteID}
                dangerouslySetInnerHTML={
                    {
                        __html: `<feColorMatrix
                            type="matrix"
                            values="0 0 0 0 1, 0 0 0 0 1, 0 0 0 0 1, 0 0 0 1 0">
                                </feColorMatrix>`
                    }
                }
            />
        );

        // the icon with the white-color-filter applied
        var image = (
            <g dangerouslySetInnerHTML={
                {
                    __html: `<image
                        filter="url(#${whiteID})"
                        style="transform-origin: 50% 50%;
                               transform: scale(${this.props.scale})"
                        xlink:href="${icons[this.props.image]}"
                        x=${this.props.x} y=${this.props.y}
                        width="90" height="90"/>
                    </image>`
                }
            }/>
        );

        // the crown with the colorFilter applied
        var kingCrown = (
            <g dangerouslySetInnerHTML={
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
            }/>
        );

        // the emperorCrown with the colorFilter applied
        var emperorCrown = (
            <g dangerouslySetInnerHTML={
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
            }/>
        );

        var crown;
        var translateY = -60;
        var viewBoxY = 280;

        // change the position of the svg according to the selelted crown
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
            <svg
                width='251px'
                height='340px'
                viewBox={`0 40 251 ${viewBoxY}`}
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'>
                <defs>
                    {whiteFilter}
                    {colorFilter}
                </defs>
                <g>
                    <g transform={`translate(-24.00, ${translateY})`}>
                        <circle fill={this.props.fill} cx='150' cy='250' r='100'></circle>
                        <g>
                            {image}
                        </g>
                        {crown}
                    </g>
                </g>
            </svg>
        );
    }
});
