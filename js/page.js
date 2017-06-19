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
		//Draw initial graph
		this.readSaveData(document.getElementById("config"));
		this._graph = new Graph (document.getElementById("graph"));
		this.redraw();
		
		//Populate list of point types
		var numPoints = 7; //should match the number of pt-*.svg files in ../img/
		for (var i = 0; i < numPoints; ++i) {
			ajaxGet("https://raw.githubusercontent.com/hal7df/dataplot.js/beta/img/pt-" + i + ".svg", this._savePointType(i));
		}
		
		page.sizeTable();
		page._events.throttle("resize", "throttledResize");
		window.addEventListener("throttledResize", page.sizeTable);
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
						min: parseFloat(inData.elements.namedItem("x-min").value, 10),
						max: parseFloat(inData.elements.namedItem("x-max").value, 10)
					},
					yAxis: {
						label: inData.elements.namedItem("graph-ylabel").value,
						autoscale: inData.elements.namedItem("y-autoscale").checked,
						min: parseFloat(inData.elements.namedItem("y-min").value, 10),
						max: parseFloat(inData.elements.namedItem("y-max").value, 10)
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
		changeBounds: function(event){
			
			//Because of internet exlorer GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			//Paul "Javascript is a lot like what you would expect, and nothing like what you would expect!!!!!!!!!!!! :)"
			event = event || window.event;

			if(event.target.id == "x-min"){
				page._graph.setXWindow(page._data.plot.xAxis.min = parseFloat(event.target.value), page._data.plot.xAxis.max);
			}
			else if(event.target.id == "x-max"){
				page._graph.setXWindow(page._data.plot.xAxis.min, page._data.plot.xAxis.max = parseFloat(event.target.value));
			}
			else if(event.target.id=="y-min"){
				page._graph.setYWindow(page._data.plot.yAxis.min = parseFloat(event.target.value),page._data.plot.yAxis.max);
			}
			else if(event.target.id=="y-max"){
				page._graph.setYWindow(page._data.plot.yAxis.min, page._data.plot.yAxis.max = parseFloat(event.target.value));
			}
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
		},
		mask: function (event) {
			event = event || window.event;
			var key = event.keycode || event.which;
			var validKey = (key >= 48 && key <= 57); //number row
			validKey |= (key >= 96 && key <= 105); //numpad
			validKey |= key === 189 || key === 109 || key == 173; //minus sign
			validKey |= key === 190 || key === 110; //decimal point
			validKey |= key >= 35 && key <= 40; //navigation keys
			validKey |= key === 9 || key === 13; //tab and enter
			validKey |= key === 8 || key === 46; //backspace and delete
			validKey |= key === 85; //letter 'u' (for uncertainty)
			validKey |= ((key === 86 || key === 67 || key == 88) &&
						(event.ctrlKey || event.metaKey)); //clipboard actions
			
			if (!validKey) event.preventDefault();
			if (key == 85) {
				if (event.target.textContent.indexOf('\u00B1') === -1) {
					event.target.textContent += '\u00B1';
					var range = document.createRange();
					var sel = window.getSelection();
					range.setStart(event.target.childNodes[0], event.target.textContent.length);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				}
				event.preventDefault();
			}
		},
		update: function (event) {
			event = event || window.event;
			var row = parseInt(event.target.parentElement.dataset.rownum, 10);
			var data = page._data.data;
			var dataNeeded = event.target.parentElement.dataset.needed;
			var yTest = function (arr) {
				return !(arr[row] === null || arr[row] === undefined);
			};
			
			if (event.target.classList.contains('x')) {
				if (event.target.textContent.length > 0) {
					data.x[row] = parseFloat(event.target.textContent, 10);
					if (dataNeeded) dataNeeded = dataNeeded.replace("x","");
				} else if (data.x[row] !== null || data.x[row] !== undefined)
					data.x[row] = null;
			} else {
				var setnum = event.target.dataset.setnum;
				if (data.y[setnum] === undefined) data.y[setnum] = [];
				if (event.target.textContent.length > 0) {
					data.y[setnum][row] = parseFloat(event.target.textContent, 10);
					if (dataNeeded) dataNeeded = dataNeeded.replace("y","");
				} else if (data.y[setnum][row] !== null || data.x[row] !== undefined)
					data.y[setnum][row] = null;
			}
			
			if (dataNeeded !== undefined && dataNeeded.length === 0) {
				dataNeeded = undefined;
				page.datasets.newRow(event.target.parentElement.parentElement);
			}
			
			event.target.parentElement.dataset.needed = dataNeeded;
		},
		newRow: function (table) {
			var row = document.createElement("tr");
			row.classList.add("new-row");
			row.dataset.rownum = parseInt(table.lastElementChild.dataset.rownum, 10) + 1;
			row.dataset.needed = "xy";
			
			var createCell = function (colnum) {
				var cell = document.createElement("td");
				cell.contentEditable = "true";
				cell.onblur = page.datasets.update;
				cell.onkeydown = page.datasets.mask;
				cell.classList.add(colnum === undefined ? "x" : "y");
				if (colnum !== undefined) cell.dataset.setnum = colnum;
				return cell;
			};
			
			row.appendChild(createCell());
			
			for (var i = 0; i < page._data.data.y.length; ++i)
				row.appendChild(createCell(i));
			
			table.appendChild(row);
		}
	},
	sizeTable: function () {
		var configArea = document.getElementById("data-config-contain");
		var configCard = configArea.firstElementChild;
		var dataCard = configArea.lastElementChild;
		var container = dataCard.firstElementChild;
		var tools = dataCard.lastElementChild;
		var tabBar = container.firstElementChild;
		var table = tabBar.nextElementSibling.firstElementChild;
		var head = table.firstElementChild;
		var body = table.lastElementChild;
		
		var configAreaHeight = parseInt(getComputedStyle(configArea).height);
		var configCardHeight = parseInt(getComputedStyle(configCard).height);
		var cardMargin = parseInt(getComputedStyle(dataCard).marginTop);
		var toolsHeight = parseInt(getComputedStyle(tools).height);
		var tabBarHeight = parseInt(getComputedStyle(tabBar).height);
		var headHeight = parseInt(getComputedStyle(head).height);
		
		body.style.height = (configAreaHeight - 
							(configCardHeight + (4 * cardMargin) + 
									toolsHeight + tabBarHeight + headHeight))
							.toString() + "px";
	},
	_events: {
		getCustom: function (name, params) {
			if (typeof CustomEvent === "function")
				return new CustomEvent(name,params);
			else {
				var evt = document.createEvent(name);
				evt.initCustomEvent(name, params.bubbles, params.cancelable,
									params.detail);
			}
		},
		throttle: function (sourceEvent, destEvent, target) {
			target = target || window;
			var running = false;
			var intermediateListener = function () {
				if (running) return;
				running = true;
				requestAnimationFrame(function () {
					target.dispatchEvent(page._events.getCustom(destEvent));
					running = false;
				});
			}
			target.addEventListener(sourceEvent, intermediateListener);
		}
	},
	_points: [],
	_savePointType: function (index) {
		return function (svg) { page._points[index] = svg; }
	}
};

function ajaxGet (url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status < 400) {
			callback(xhr.responseText);
		}
	};
	xhr.send();
}

window.onload = page.init.bind(page);