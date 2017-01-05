/**
 * DATAPLOT.JS
 * -----------
 * JavaScript library for creating scientific scatter plots and calculating
 * trendlines.
 */

function Graph (canvas) {
	canvas.width = parseInt(window.getComputedStyle(canvas).width);
	canvas.height = parseInt(window.getComputedStyle(canvas).height);
	
	this.ctx = canvas.getContext("2d");
	this.dims = {
		plotArea:{x:{min:0,max:0},y:{min:0,max:0}}
	};
	this.dims.plotArea.width = function () {return this.x.max - this.x.min;};
	this.dims.plotArea.height = function () {return this.y.max - this.y.min;};
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
	this.reset = function () {
		this.ctx.strokeStyle = "#000000";
		this.ctx.fillStyle = "#000000";
		this.ctx.font = "10px sans-serif";
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center";
		this.ctx.lineWidth = "1";
		this.ctx.setLineDash([]);
		
		this._calcPlotArea();
	};
	this.clear = function() {
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(0,0,canvas.width,canvas.height);
		this.reset();
	};
	this.drawGraph = function () {
		this.clear();
		var plotArea = this.dims.plotArea;
		
		//Draw outer bounds
		this.ctx.lineWidth = "2";
		this.ctx.strokeRect(plotArea.x.min,plotArea.y.min, plotArea.width(),
							plotArea.height());
		
		//Calculate label positions
		var plotCenter = {};
		plotCenter.x = this.dims.plotArea.x.min + (this.dims.plotArea.width()/2);
		plotCenter.y = this.dims.plotArea.y.min + (this.dims.plotArea.height()/2);
		
		//Draw title and axis labels
		this.ctx.font = this._labelSizes.title.toString() + "px sans-serif";
		this.ctx.fillText(this._labels.title, plotCenter.x, (this.dims.plotArea.y.min/2));
		this.ctx.font = this._labelSizes.axis.toString() + "px sans-serif";
		this.ctx.fillText(this._labels.x, plotCenter.x,
							(this.dims.plotArea.y.max + ((canvas.height - this.dims.plotArea.y.max)/1.5)));
		this.ctx.save();
		this.ctx.rotate(-Math.PI/2);
		this.ctx.fillText(this._labels.y, -plotCenter.y, this.dims.plotArea.y.min/3);
		this.ctx.restore();
	};
	this._calcPlotArea = function () {
		//Get plot area
		this.dims.plotArea.x.min = (0.075*canvas.width);
		this.dims.plotArea.x.max = (0.975*canvas.width);
		this.dims.plotArea.y.min = (0.075*canvas.height);
		this.dims.plotArea.y.max = (0.925*canvas.height);
		
		//Calculate spacing
		this.window.x.spacing = (this.dims.plotArea.width()/this.window.width());
		this.window.y.spacing = (this.dims.plotArea.height()/this.window.height());
		
		//Set label sizes
		this._labelSizes.title = (this.dims.plotArea.y.min)/2;
		this._labelSizes.axis = (this.dims.plotArea.x.min)/4;
	};
	this._updateSize = function () {
		canvas.width = parseInt(window.getComputedStyle(canvas).width);
		canvas.height = parseInt(window.getComputedStyle(canvas).height);
	}
	
	this._calcPlotArea();
}

var graph = new Graph (document.getElementById("graph"));
graph.setTitle("Unnamed Project");
graph.setXLabel("xxx");
graph.setYLabel("yyy");