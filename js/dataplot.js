/**
 * DATAPLOT.JS
 * -----------
 * JavaScript library for creating scientific scatter plots and calculating
 * trendlines.
 * 
 * http://stackoverflow.com/a/3908185/2384510 for drawing on invisible canvases
 */

function Graph (canvas) {
	canvas.width = parseInt(window.getComputedStyle(canvas).width);
	canvas.height = parseInt(window.getComputedStyle(canvas).height);
	
	this.ctx = canvas.getContext("2d");
	this.plotArea = {x:{min:0,max:0},y:{min:0,max:0}};
	this.plotArea.width = function () {return this.x.max - this.x.min;};
	this.plotArea.height = function () {return this.y.max - this.y.min;};
	this.window = {
			x:{min:0, max:10, interval: 1},
			y:{min:0, max:10, interval: 1}
	};
	this.window.width = function () { return this.x.max - this.x.min; };
	this.window.height = function () { return this.y.max - this.y.min; };
	this._labels = {x:"", y:"", title:""};
	this._labelSizes = {};
	
	this.setTitle = function(title)  { this._labels.title = title; };
	this.setXLabel = function(xlabel) { this._labels.x = xlabel; };
	this.setYLabel = function(ylabel) { this._labels.y = ylabel; };
	this.clear = function() {
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
		for (var x = this.window.x.min; x <= this.window.x.max; x += this.window.x.interval) {
			if (x > this.window.x.min && x < this.window.x.max) {
				this.ctx.beginPath();
				this.ctx.moveTo(this._x(x),this._y(this.window.y.min));
				this.ctx.lineTo(this._x(x),this._y(this.window.y.max));
				this.ctx.stroke();
			}
			
			this.ctx.fillText(x % 1 === 0 ? x : x.toFixed(1), this._x(x),
								this._y(this.window.y.min) + 5);
		}
		
		//Draw y-axis grid lines
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "right";
		for (var y = this.window.y.min; y <= this.window.y.max; y += this.window.y.interval) {
			if (y > this.window.y.min && y < this.window.y.max) {
				this.ctx.beginPath();
				this.ctx.moveTo(this._x(this.window.x.min),this._y(y));
				this.ctx.lineTo(this._x(this.window.x.max),this._y(y));
				this.ctx.stroke();
			}
			
			this.ctx.fillText(y % 1 === 0 ? y : y.toFixed(1),
								this._x(this.window.x.min) - 5, this._y(y));
		}
		
		//Reset context
		this._reset();
	};
	this._reset = function () {
		this.ctx.strokeStyle = "#000000";
		this.ctx.fillStyle = "#000000";
		this.ctx.font = "10px sans-serif";
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center";
		this.ctx.lineWidth = "1";
		this.ctx.setLineDash([]);
		
		this._calcPlotArea();
	};
	this._calcPlotArea = function () {
		//Get plot area
		this.plotArea.x.min = (0.075*canvas.width);
		this.plotArea.x.max = (0.975*canvas.width);
		this.plotArea.y.min = (0.075*canvas.height);
		this.plotArea.y.max = (0.925*canvas.height);
		
		//Calculate spacing
		this.window.x.spacing = (this.plotArea.width()/this.window.width());
		this.window.y.spacing = (this.plotArea.height()/this.window.height());
		
		//Set label sizes
		this._labelSizes.title = (this.plotArea.y.min)/2;
		this._labelSizes.axis = (canvas.height - this.plotArea.y.max)/3;
	};
	this._updateSize = function () {
		canvas.width = parseInt(window.getComputedStyle(canvas).width);
		canvas.height = parseInt(window.getComputedStyle(canvas).height);
	};
	this._x = function (x) {
		if (x >= this.window.x.min && x <= this.window.x.max)
			return this.plotArea.x.min + (x * (this.plotArea.width()/this.window.width()));
		else return -canvas.width;
	};
	this._y = function (y) {
		if (y >= this.window.y.min && y <= this.window.y.max)
			return this.plotArea.y.max - (y * (this.plotArea.height()/this.window.height()));
		else return -canvas.height;
	}
	
	this._calcPlotArea();
}

var graph = new Graph (document.getElementById("graph"));

function initGraph () {
	graph = new Graph (document.getElementById("graph"));
	graph.setTitle("Unnamed Project");
	graph.setXLabel("x");
	graph.setYLabel("y");
	graph.drawGraph();
}

window.onload = initGraph;