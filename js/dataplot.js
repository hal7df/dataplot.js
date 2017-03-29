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
	this.ctx = canvas.getContext("2d");
	this.plotArea = {x:{min:0,max:0},y:{min:0,max:0}};
	this.plotArea.width = function () {return this.x.max - this.x.min;};
	this.plotArea.height = function () {return this.y.max - this.y.min;};
	this._window = {
			x:{min:0, max:10, interval: 1},
			y:{min:0, max:10, interval: 1}
	};
	this._window.width = function () { return this.x.max - this.x.min; };
	this._window.height = function () { return this.y.max - this.y.min; };
	this._labels = {x:"", y:"", title:""};
	this._labelSizes = {};
	
	this.setTitle = function (title)  { this._labels.title = title; };
	this.setXLabel = function (xlabel) { this._labels.x = xlabel; };
	this.setYLabel = function (ylabel) { this._labels.y = ylabel; };
	this.setXWindow = function (min,max) {
		this._window.x.min = min;
		this._window.x.max = max;
	};
	this.setYWindow = function (min,max) {
		this._window.y.min = min;
		this._window.y.max = max;
	};
	this.clear = function () {
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(0,0,canvas.width,canvas.height);
		this._reset();
	};
	this.drawGraph = function () {
		this.clear();
		
		//Draw outer bounds
		this.ctx.lineWidth = "2";
		this.ctx.strokeRect(this.plotArea.x.min,this.plotArea.y.min,
							this.plotArea.width(), this.plotArea.height());
		
		//Calculate label positions
		var plotCenter = {};
		plotCenter.x = this.plotArea.x.min + (this.plotArea.width()/2);
		plotCenter.y = this.plotArea.y.min + (this.plotArea.height()/2);
		
		//Draw title and axis labels
		this.ctx.font = this._labelSizes.title.toString() + "px sans-serif";
		this.ctx.fillText(this._labels.title, plotCenter.x, (this.plotArea.y.min/2));
		this.ctx.font = this._labelSizes.axis.toString() + "px sans-serif";
		this.ctx.fillText(this._labels.x, plotCenter.x,
							(this.plotArea.y.max + ((canvas.height - this.plotArea.y.max)/1.5)));
		this.ctx.save();
		this.ctx.rotate(-Math.PI/2);
		this.ctx.fillText(this._labels.y, -plotCenter.y, this.plotArea.y.min/2);
		this.ctx.restore();
		
		//Initialize context for grid lines
		this.ctx.strokeStyle = "#878787";
		this.ctx.lineWidth = "1";
		this.ctx.setLineDash([3,3]);
		this.ctx.font = (this._labelSizes.axis/1.5).toString() + "px sans-serif";
		
		//Draw x-axis grid lines
		this.ctx.textBaseline = "top";
		for (var x = this._window.x.min; x <= this._window.x.max; x += this._window.x.interval) {
			if (x > this._window.x.min && x < this._window.x.max) {
				this.ctx.beginPath();
				this.ctx.moveTo(this._x(x),this._y(this._window.y.min));
				this.ctx.lineTo(this._x(x),this._y(this._window.y.max));
				this.ctx.stroke();
			}
			
			this.ctx.fillText(x % 1 === 0 ? x : x.toFixed(1), this._x(x),
								this._y(this._window.y.min) + 5);
		}
		
		//Draw y-axis grid lines
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "right";
		for (var y = this._window.y.min; y <= this._window.y.max; y += this._window.y.interval) {
			if (y > this._window.y.min && y < this._window.y.max) {
				this.ctx.beginPath();
				this.ctx.moveTo(this._x(this._window.x.min),this._y(y));
				this.ctx.lineTo(this._x(this._window.x.max),this._y(y));
				this.ctx.stroke();
			}
			
			this.ctx.fillText(y % 1 === 0 ? y : y.toFixed(1),
								this._x(this._window.x.min) - 5, this._y(y));
		}
		
		//Reset context
		this._reset();
	};
	this.plotImage = function (img, x, y) {
		if (this._x(x) < 0 || this._y(y) < 0) return;
		
		this.ctx.drawImage(img, this._x(x) - (img.width/2),
							this._y(y) - (img.height/2));
	};
	this.startLine = function (x, y, color) {
		if (this._x(x) < 0 || this._y(y) < 0) return;
		
		this.ctx.strokeStyle = color === undefined ? "#000000" : color;
		this.ctx.lineWidth = "1";
		this.ctx.setLineDash([]);
		this.ctx.beginPath();
		this.ctx.moveTo(this._x(x), this._y(y));
	};
	this.addLinePoint = function (x, y) {
		if (this._x(x) < 0 || this._y(y) < 0) return;
		
		this.ctx.lineTo(this._x(x), this._y(y));
	};
	this.drawLine = function () {
		this.ctx.stroke();
	};
	this.updateSize = function () {
		//Update canvas size
		canvas.width = parseInt(window.getComputedStyle(canvas).width);
		canvas.height = parseInt(window.getComputedStyle(canvas).height);
		
		//Set plot area
		this.plotArea.x.min = (0.075*canvas.width);
		this.plotArea.x.max = (0.975*canvas.width);
		this.plotArea.y.min = (0.075*canvas.height);
		this.plotArea.y.max = (0.925*canvas.height);

		//Set label sizes
		this._labelSizes.title = (this.plotArea.y.min)/2;
		this._labelSizes.axis = (canvas.height - this.plotArea.y.max)/3;
	};
	this._reset = function () {
		this.ctx.strokeStyle = "#000000";
		this.ctx.fillStyle = "#000000";
		this.ctx.font = "10px sans-serif";
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center";
		this.ctx.lineWidth = "1";
		this.ctx.setLineDash([]);
		
		this._calcWindow();
	};
	this._calcWindow = function () {
		//Calculate unit spacing
		this._window.x.spacing = (this.plotArea.width()/this._window.width());
		this._window.y.spacing = (this.plotArea.height()/this._window.height());
		
		//Get the graph tick interval
		var minSpacing = 0.05;
		minSpacing *= this.plotArea.width() > this.plotArea.height() ? 
				this.plotArea.width() : this.plotArea.height(); 
		this._window.x.interval = this._calcInterval(this._window.width(),
														this.plotArea.width(),
														minSpacing);
		this._window.y.interval = this._calcInterval(this._window.height(),
														this.plotArea.height(),
														minSpacing);
	};
	this._calcInterval = function (windowWidth, plotWidth, minGridSpacing) {
		var smallestInterval, preferredInterval = undefined;
		var ticks = 0;
		
		while ((plotWidth/(++ticks)) >= minGridSpacing) {
			smallestInterval = windowWidth/ticks;
			
			if (smallestInterval % 1 == 0)
				preferredInterval = smallestInterval;
		}
		
		return preferredInterval || smallestInterval;
	};
	this._x = function (x) {
		if (x >= this._window.x.min && x <= this._window.x.max)
			return this.plotArea.x.min + (x * (this.plotArea.width()/this._window.width()));
		else return -1;
	};
	this._y = function (y) {
		if (y >= this._window.y.min && y <= this._window.y.max)
			return this.plotArea.y.max - (y * (this.plotArea.height()/this._window.height()));
		else return -1;
	}
	
	this.updateSize();
	this._calcWindow();
}