/**
 * Page-specific scripts
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

var page = {
	init: function () {
		this.readSaveData(document.getElementById("config"));
		this._graph = new Graph (document.getElementById("graph"));
		this.redraw();
	},
	redraw: function () {
		this._graph.setTitle(this._data.plot.title);
		this._graph.setXLabel(this._data.plot.xAxis.label);
		this._graph.setYLabel(this._data.plot.yAxis.label);
		this._graph.drawGraph();
	},
	readSaveData: function (inData) {
		if (inData.nodeType) {			
			this._data = {
				plot: {
					title: inData.elements.namedItem("graph-title").value,
					xAxis: {
						label: document.getElementById("x-name").textContent,
						autoscale: inData.elements.namedItem("x-autoscale").checked,
						min: parseInt(inData.elements.namedItem("x-min").value, 10),
						max: parseInt(inData.elements.namedItem("x-max").value, 10)
					},
					yAxis: {
						label: inData.elements.namedItem("graph-ylabel").value,
						autoscale: inData.elements.namedItem("y-autoscale").checked,
						min: parseInt(inData.elements.namedItem("y-min").value, 10),
						max: parseInt(inData.elements.namedItem("y-max").value, 10)
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
			config.namedItem("graph-title").parentElement.classList.add("is-dirty");
			document.getElementById("x-name").textContent = this._data.plot.xAxis.label;
			config.namedItem("x-autoscale").checked = this._data.plot.xAxis.autoscale;
			if (!this._data.plot.xAxis.autoscale) {
				config.namedItem("x-min").value = this._data.plot.xAxis.min;
				config.namedItem("x-min").parentElement.classList.add("is-dirty");
				config.namedItem("x-max").value = this._data.plot.xAxis.max;
				config.namedItem("x-max").parentElement.classList.add("is-dirty");
			}
			config.namedItem("graph-ylabel").value = this._data.plot.yAxis.label;
			config.namedItem("graph-ylabel").parentElement.classList.add("is-dirty");
			config.namedItem("y-autoscale").value = this._data.plot.yAxis.autoscale;
			if (!this._data.plot.yAxis.autoscale) {
				config.namedItem("y-min").value = this._data.plot.yAxis.min;
				config.namedItem("y-min").parentElement.classList.add("is-dirty");
				config.namedItem("y-max").value = this._data.plot.yAxis.max;
				config.namedItem("y-min").parentElement.classList.add("is-dirty");
			}
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
		},
		autoscale: function (event) {
			event = event || window.event
			var min = event.target.parentElement.nextElementSibling.firstElementChild;
			var max = min.parentElement.nextElementSibling.firstElementChild;
			var axis = page._data.plot[event.target.id.split('-')[0] === 'x' ? "xAxis" : "yAxis"];
			
			min.disabled = event.target.checked;
			max.disabled = event.target.checked;
			
			if (event.target.checked) {
				axis.min = parseInt(min.value = "", 10);
				axis.max = parseInt(max.value = "", 10);
			}
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