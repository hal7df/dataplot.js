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
	
        m_plotArea.width = function () {return this.x.max - this.x.min;};
	m_plotArea.height = function () {return this.y.max - this.y.min;};
	m_window.width = function () { return this.x.max - this.x.min; };
	m_window.height = function () { return this.y.max - this.y.min; };
	
        var calcInterval = function (windowWidth, plotWidth, minGridSpacing) {
            var smallestInterval, preferredInterval = undefined;
            var ticks = 0;
            
            while ((plotWidth/(++ticks)) >= minGridSpacing) {
                    smallestInterval = windowWidth/ticks;
                    
                    if (smallestInterval % 1 == 0)
                            preferredInterval = smallestInterval;
            }
            
            return preferredInterval || smallestInterval;
	};

	var calcWindow = function () {
            //Calculate unit spacing
            m_window.x.spacing = (m_plotArea.width()/m_window.width());
            m_window.y.spacing = (m_plotArea.height()/m_window.height());
            
            //Get the graph tick interval
            var minSpacing = 0.05;
            minSpacing *= m_plotArea.width() > m_plotArea.height() ? 
                            m_plotArea.width() : m_plotArea.height(); 
            m_window.x.interval = calcInterval(m_window.width(),
                                               m_plotArea.width(), minSpacing);
            m_window.y.interval = calcInterval(m_window.height(),
                                               m_plotArea.height(), minSpacing);
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

        var getVisibleRange = function (min, max) {
            var d = max - min;
            var h = 10;

            if ((d - 0) > (Number.EPSILON*8))
                h = ((d/0.9) - d)/2;

            return {
                min: (min - h),
                max: (max + h)
            };
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
	this.setXWindow = function (min,max) {
		m_window.x.min = min;
		m_window.x.max = max;
	};
	this.setYWindow = function (min,max) {
		m_window.y.min = min;
		m_window.y.max = max;
	};
        this.autoscaleX = function (data) {
        };
        this.autoscaleY = function (data) {
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
                    if (x > m_window.x.min && x < m_window.x.max) {
                        m_ctx.beginPath();
                        m_ctx.moveTo(x_(x), y_(m_window.y.min));
                        m_ctx.lineTo(x_(x), y_(m_window.y.max));
                        m_ctx.stroke();
                    }
                    
                    m_ctx.fillText(((x % 1 === 0) ? x : x.toFixed(1)), x_(x),
                                 (y_(m_window.y.min) + 5));
		}
		
		//Draw y-axis grid lines
		m_ctx.textBaseline = "middle";
		m_ctx.textAlign = "right";
		for (var y = m_window.y.min; y <= m_window.y.max; y += m_window.y.interval) {
                    if (y > m_window.y.min && y < m_window.y.max) {
                        m_ctx.beginPath();
                        m_ctx.moveTo(x_(m_window.x.min), y_(y));
                        m_ctx.lineTo(x_(m_window.x.max), y_(y));
                        m_ctx.stroke();
                    }
                    
                    m_ctx.fillText(((y % 1 === 0) ? y : y.toFixed(1)),
                                 (x_(m_window.x.min) - 5), y_(y));
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
