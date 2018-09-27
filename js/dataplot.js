/**
 * DATAPLOT.JS
 * -----------
 * JavaScript library for creating scientific scatter plots and calculating
 * trendlines.
 * 
 * http://stackoverflow.com/a/3908185/2384510 for drawing on invisible canvases
 *  
 * Copyright 2017 Paul Bonnen
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Graph (canvas) {
    /* Private members */
    var m_ctx = canvas.getContext("2d");
    var m_plotArea = {x:{min:0,max:0},y:{min:0,max:0}};
    var m_lables = {x:"", y:"", title:""};
    var m_labelSizes = {};
    var m_window = {
        x:{min:0, max:10, interval: 1},
        y:{min:0, max:10, interval: 1}
    };

    m_plotArea.width = function () { return this.x.max - this.x.min; };
    m_plotArea.height = function () { return this.y.max - this.y.min; };
    m_window.width = function () { return this.x.max - this.x.min; };
    m_window.height = function () { return this.y.max - this.y.min; };

    var formatTickLabel = function (val, axis) { 
        var windowWidth = ((axis === "x") ? m_window.width()
                                          : m_window.height());
        var tickPrecision = Math.floor(Math.log10(windowWidth) - 1);

        if (tickPrecision > 5 || tickPrecision < -2) return val.toExponential(1);
        else if (tickPrecision < 0) return val.toFixed(-tickPrecision);

        return val.toFixed(0);
    };

    var calcInterval = function (windowWidth, plotWidth, textWidth) {
        const MAX_NUM_TICKS = 20;
        const MIN_NUM_TICKS = 5;
        var maxTicks = Math.min(Math.floor(plotWidth/(textWidth * 1.5)),
                                MAX_NUM_TICKS);
        var tickPrecision = Math.pow(10.,
                                     Math.floor(Math.log10(windowWidth) - 1));
        var best = { interval: 0, mod: Number.POSITIVE_INFINITY };

        for (var ticks = maxTicks; ticks >= MIN_NUM_TICKS; --ticks) {
            var interval = (windowWidth/ticks);
            var mod = interval % tickPrecision;

            if (mod < best.mod)
                best = { interval: interval, mod: mod };
        }

        best.interval = Math.round(best.interval/tickPrecision) * tickPrecision;

        return best.interval;
    };

    var calcWindow = function () {
        var getTextWidth = function (x) {
            m_ctx.font = (m_labelSizes.axis/1.5).toString() + "px sans-serif";
            var metrics = m_ctx.measureText(formatTickLabel(x, 'x'));
            m_ctx.font = "10px sans-serif";

            return metrics.width;
        };
        
        //Calculate unit spacing
        m_window.x.spacing = (m_plotArea.width()/m_window.width());
        m_window.y.spacing = (m_plotArea.height()/m_window.height());
        
        //Get the graph tick interval
        textWidth = Math.max(getTextWidth(m_window.x.min, true),
                             getTextWidth(m_window.x.max, true));
        m_window.x.interval = calcInterval(m_window.width(),
                                           m_plotArea.width(), textWidth);
        m_window.y.interval = calcInterval(m_window.height(),
                                           m_plotArea.height(),
                                           (m_labelSizes.axis/1.5));
    };

    var reset = function () {
        m_ctx.strokeStyle = "#000000";
        m_ctx.fillStyle = "#000000";
        m_ctx.font = "10px sans-serif";
        m_ctx.textBaseline = "middle";
        m_ctx.textAlign = "center";
        m_ctx.lineWidth = "1";
        m_ctx.setLineDash([]);
        
        calcWindow();
    };

    var calcAutoscale = function (data) {
        var dataFilter = function (arr, val) {
            if (val !== undefined && val !== null)
                arr.push(val);

            return arr;
        };
        if (data.reduce(dataFilter, []).length === 0)
            return { min: -10, max: 10 };

        var min, max, r, d, h = 10;

        // Get min and max of data range
        min = data.reduce(function (min, cur) {
            return Math.min(min, cur);
        }, Number.POSITIVE_INFINITY);
        max = data.reduce(function(max, cur) {
            return Math.max(max, cur);
        }, Number.NEGATIVE_INFINITY);

        r = max - min;

        // Compute amount of space between min/max and the window bounds
        if ((r - 0) > (Number.EPSILON*8))
            h = ((r/0.9) - r)/2;

        max += h;
        min -= h;

        /* Compute scale precision
         * This algorithm assumes the scale precision is one order of
         * magnitude more precise than the most significant figure of
         * the range. (This should result in ~10 scale lines)
         */
        d = Math.pow(10., ((r === 0) ? 0 : Math.floor(Math.log10(r) - 1)));

        // Snap min and max to the scale precision
        max = Math.ceil(max / d) * d;
        min = Math.floor(min / d) * d;

        return { min: min, max: max };
    };

    var x_ = function (x) {
        if (x >= m_window.x.min && x <= m_window.x.max) {
            return m_plotArea.x.min + ((x - m_window.x.min) * (m_plotArea.width()/m_window.width()));
        }
        else return -1;
    };

    var y_ = function (y) {
            if (y >= m_window.y.min && y <= m_window.y.max) {
                return m_plotArea.y.max - ((y - m_window.y.min) * (m_plotArea.height()/m_window.height()));
            }
            else return -1;
    };

    /* Public members */
    this.setTitle = function (title)  { m_lables.title = title; };
    this.setXLabel = function (xlabel) { m_lables.x = xlabel; };
    this.setYLabel = function (ylabel) { m_lables.y = ylabel; };
    this.getXWindow = function () { 
        return {
            min: m_window.x.min,
            max: m_window.x.max
        };
    };
    this.getYWindow = function () {
        return {
            min: m_window.y.min,
            max: m_window.y.max
        };
    }
    this.setXWindow = function (min,max) {
        m_window.x.min = min;
        m_window.x.max = max;
    };
    this.setYWindow = function (min,max) {
        m_window.y.min = min;
        m_window.y.max = max;
    };
    this.autoscaleX = function (data) {
        var range = calcAutoscale(data);

        m_window.x.min = range.min;
        m_window.x.max = range.max;
    };
    this.autoscaleY = function (data) {
        var range = calcAutoscale(data.reduce(function(arr, val) {
            return arr.concat(val);
        }, []));

        m_window.y.min = range.min;
        m_window.y.max = range.max;
    };
    this.clear = function () {
        m_ctx.fillStyle = "#ffffff";
        m_ctx.fillRect(0,0,canvas.width,canvas.height);
        reset();
    };
    this.drawGraph = function () {
        this.clear();
        
        //Draw outer bounds
        m_ctx.lineWidth = "2";
        m_ctx.strokeRect(m_plotArea.x.min, m_plotArea.y.min, m_plotArea.width(),
                       m_plotArea.height());
        
        //Calculate label positions
        var plotCenter = {};
        plotCenter.x = m_plotArea.x.min + (m_plotArea.width()/2);
        plotCenter.y = m_plotArea.y.min + (m_plotArea.height()/2);
        
        //Draw title and axis m_lables
        m_ctx.font = m_labelSizes.title.toString() + "px sans-serif";
        m_ctx.fillText(m_lables.title, plotCenter.x, (m_plotArea.y.min/2));
        m_ctx.font = m_labelSizes.axis.toString() + "px sans-serif";
        m_ctx.fillText(m_lables.x, plotCenter.x,
                     (m_plotArea.y.max + ((canvas.height - m_plotArea.y.max)/1.5)));

        m_ctx.save();
        m_ctx.rotate(-Math.PI/2);
        m_ctx.fillText(m_lables.y, -plotCenter.y, m_plotArea.y.min/2);
        m_ctx.restore();
        
        //Initialize context for grid lines
        m_ctx.strokeStyle = "#878787";
        m_ctx.lineWidth = "1";
        m_ctx.setLineDash([3,3]);
        m_ctx.font = (m_labelSizes.axis/1.5).toString() + "px sans-serif";
        
        //Draw x-axis grid lines
        m_ctx.textBaseline = "top";
        for (var x = m_window.x.min; x <= m_window.x.max;
             x += m_window.x.interval) {
            if (x > m_window.x.min &&
                x < (m_window.x.max - (m_window.x.interval/50))) {
                m_ctx.beginPath();
                m_ctx.moveTo(x_(x), y_(m_window.y.min));
                m_ctx.lineTo(x_(x), y_(m_window.y.max));
                m_ctx.stroke();
            }
            
            m_ctx.fillText(formatTickLabel(x, 'x'), x_(x),
                         (y_(m_window.y.min) + 5));
        }
        
        //Draw y-axis grid lines
        m_ctx.textBaseline = "middle";
        m_ctx.textAlign = "right";
        for (var y = m_window.y.min; y <= m_window.y.max; y += m_window.y.interval) {
            if (y > m_window.y.min &&
                y < m_window.y.max - (m_window.y.interval/50)) {
                m_ctx.beginPath();
                m_ctx.moveTo(x_(m_window.x.min), y_(y));
                m_ctx.lineTo(x_(m_window.x.max), y_(y));
                m_ctx.stroke();
            }
            
            m_ctx.fillText(formatTickLabel(y, 'y'), (x_(m_window.x.min) - 5),
                           y_(y));
        }
        
        //Reset context
        reset();
    };
    this.plotImage = function (img, x, y) {
        if (x_(x) < 0 || y_(y) < 0) return;
        
        m_ctx.drawImage(img, x_(x) - (img.width/2),
                        y_(y) - (img.height/2));
    };
    this.startLine = function (x, y, color) {
        if (x_(x) < 0 || y_(y) < 0) return;
        
        m_ctx.strokeStyle = (color === undefined ? "#000000" : color);
        m_ctx.lineWidth = "1";
        m_ctx.setLineDash([]);
        m_ctx.beginPath();
        m_ctx.moveTo(x_(x), y_(y));
    };
    this.addLinePoint = function (x, y) {
        if (x_(x) < 0 || y_(y) < 0) return;
        
        m_ctx.lineTo(x_(x), y_(y));
    };
    this.drawLine = function () {
        m_ctx.stroke();
    };
    this.updateSize = function () {
        //Update canvas size
        canvas.width = parseInt(window.getComputedStyle(canvas).width);
        canvas.height = parseInt(window.getComputedStyle(canvas).height);
        
        //Set plot area
        m_plotArea.x.min = (0.075*canvas.width);
        m_plotArea.x.max = (0.975*canvas.width);
        m_plotArea.y.min = (0.075*canvas.height);
        m_plotArea.y.max = (0.925*canvas.height);

        //Set label sizes
        m_labelSizes.title = (m_plotArea.y.min)/2;
        m_labelSizes.axis = (canvas.height - m_plotArea.y.max)/3;
    };

    this.updateSize();
    calcWindow();
}
