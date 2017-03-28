var page = {
	init: function () {
		this.readSaveData(document.getElementById("config"));
		this._graph = new Graph (document.getElementById("graph"));
	},
	redraw: function () {
		this._graph.setTitle(this._data.plot.title);
		this._graph.setXLabel(this._data.plot.xAxis.label);
		this._graph.setYLabel(this._data.plot.yAxis.label);
		this._graph.drawGraph();
	}
	readSaveData: function (inData) {
		if (inData.nodeType) {			
			this._data = {
				plot: {
					title: inData.elements.namedItem("graph-title").value,
					xAxis: {
						label: document.getElementById("x-name").textContent,
						autoscale: inData.elements.namedItem("autoscale-x").checked,
						min: inData.elements.namedItem("x-min").value,
						max: inData.elements.namedItem("x-max").value
					},
					yAxis: {
						label: inData.elements.namedItem("graph-ylabel").value,
						autoscale: inData.elements.namedItem("autoscale-y").checked,
						min: inData.elements.namedItem("y-min").value,
						max: inData.elements.namedItem("y-max").value
					}
				},
				data: {
					x: [],
					y: []
				}
			};
		}
		else {
			this._data = inData;
			this.redraw();

			var config = document.getElementById("config").elements;
			config.namedItem("graph-title").value = this._data.plot.title;
			document.getElementById("x-name").textContent = this._data.plot.xAxis.label;
			config.namedItem("autoscale-x").checked = this._data.plot.xAxis.autoscale;
			config.namedItem("x-min").value = this._data.plot.xAxis.min;
			config.namedItem("x-max").value = this._data.plot.xAxis.max;
			config.namedItem("graph-ylabel").value = this._data.plot.yAxis.label;
			config.namedItem("autoscale-y").value = this._data.plot.yAxis.autoscale;
			config.namedItem("y-min").value = this._data.plot.yAxis.min;
			config.namedItem("y-max").value = this._data.plot.yAxis.max;
		}
	},
	settings: {
		title: function (event) {
			event = event || window.event;
			page._graph.setTitle(page._data.plot.title = event.target.value);
			page._graph.drawGraph();
		},
		yLabel: function (event) {
			event = event || window.event;
			page._graph.setYLabel(page._data.plot.yAxis.label = event.target.value);
			page._graph.drawGraph();
		}
	},
	datasets: {
		xLabel: function (event) {
			event = event || window.event;
			page._graph.setXLabel(page._data.plot.xAxis.label = event.target.textContent);
			page._graph.drawGraph();
		}
	}
};

window.onload = page.init.bind(page);