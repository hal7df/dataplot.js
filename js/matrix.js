/**
 * Matrix -- represents a matrix of numerical values.
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
function Matrix (h, w, zero) {
	h = h === undefined ? 1 : h;
	w = w === undefined ? 1 : w;
	zero = zero === undefined ? false : zero;
	
	var epsilonEquals = function (a, b, factor) {
		factor = factor === undefined ? 100 : factor
		var epsilon = (Number.EPSILON || Math.pow(2, -52)) * factor;
		return (Math.abs(a - b) < epsilon);
	}
	
	this.rows = h;
	this.cols = w;
	this.data = [];
	
	for (var i = 0; i < h; ++i) {
		this.data.push(new Array(w));
		
		for (var j = 0; (zero && j < this.data[i].length); ++j)
			this.data[i][j] = 0;
	}
	
	this.set = function (row, col, value) {
		this._checkIndex(row,col);
		if (typeof value !== "number")
			throw new TypeError ("`value' must be a number");
		
		this.data[row][col] = value;
	};
	this.setRow = function (row, rowValues) {
		this._checkRow(row);
		
		if (rowValues.constructor !== Array)
			throw new TypeError ("`rowValues' must be an array of numbers");
		
		if (rowValues.length !== this.cols)
			throw new RangeError("Row must be of length " + this.cols.toString());
		
		this.data[row] = rowValues.slice(0);
	};
	this.setCol = function (col, colValues) {
		this._checkCol(col);
		
		if (colValues.constructor !== Array)
			throw new TypeError("`colValues' must be an array of numbers.");
		
		if (colValues.length !== this.rows)
			throw new RangeError("Column must be of length " + this.rows.toString());
		
		for (var row = 0; row < this.rows; ++row)
			this.data[row][col] = colValues[row];
	};
	this.get = function (row, col) {
		this._checkIndex(row,col);
		return this.data[row][col];
	};
	this.getRow = function (row) {
		this._checkRow(row);
		return this.data[row];
	};
	this.getCol = function (col) {
		this._checkCol(col);
		var column = new Array ();
		for (var row = 0; row < this.rows; ++row) column.push(this.data[row][col]);
		return column;
	};
	this.print = function () {
		console.log(this.data);
	};
	this.equals = function (other, epsilonFactor) {
		epsilonFactor = epsilonFactor === undefined ? 100 : epsilonFactor
		if (other.rows !== this.rows || other.cols !== this.cols) return false;
		
		for (var row = 0; row < this.rows; ++row) {
			for (var col = 0; col < this.cols; ++col) {
				if (!epsilonEquals(this.get(row,col), other.get(row,col), epsilonFactor))
					return false;
			}
		}
		
		return true;
	};
	this.rref = function (augment) {
		if (augment && augment.rows !== this.rows)
			throw new RangeError ("Augment dimension mismatch");
		
		var result = {
				"rref":Matrix.copy(this),
				"augment":(augment !== undefined) ? Matrix.copy(augment) : augment
		};
		
		var diagLength = Math.min(result.rref.rows, result.rref.cols);
		var scaleFactor;
		
		//Loop over diagonal entries
		for (var i = 0; i < diagLength; ++i) {
			//Find the leading one for this diagonal index
			var leadingOne = i;
			
			while (leadingOne < diagLength && epsilonEquals(result.rref.get(leadingOne,i), 0))
				++leadingOne;
			
			//A leading one was found, continue with elimination
			if (leadingOne < result.rref.rows) {
				if (leadingOne !== i && leadingOne < result.rref.rows) {
					result.rref._swapRows(i,leadingOne);
					
					if (augment) result.augment._swapRows(i,leadingOne);
				}
				
				//Scale row to get the leading one
				var scaleFactor = result.rref.get(i,i);
				
				//Determine whether division or multiplication by inverse
				//will preserve the most digits
				if (Math.abs(scaleFactor) >= 1) {
    				result.rref._divideRow(i, scaleFactor);
    				if (augment) result.augment._divideRow(i, scaleFactor);
				} else {
				    scaleFactor = 1./scaleFactor;
				    result.rref._scaleRow(i, scaleFactor);
				    if (augment) result.augment._scaleRow(i, scaleFactor)
				}
				
				//Zero out rest of column
				for (var row = 0; row < result.rref.rows; ++row) {
					if (row === i) continue;
					
					scaleFactor = -1*(result.rref.get(row,i));
					
					if (scaleFactor !== 0) {
						result.rref._addRow(row, result.rref.getRow(i), scaleFactor);
						if (augment)
							result.augment._addRow(row, result.augment.getRow(i), scaleFactor);
					}
				}
			}
		}
		
		return result;
	};
	this.transpose = function () {
		var transMatrx = new Matrix (this.cols, this.rows);
		
		for (var row = 0; row < this.rows; ++row) {
			transMatrx.setCol(row, this.getRow(row));
		}
		
		return transMatrx;
	};
	this.inverse = function () {
		if (this.rows !== this.cols) throw new RangeError("Matrix not square");
		
		if (this.rows === 1 && this.cols === 1)
			return Matrix.rowFromArray([(1./this.get(0,0))]);
		else {
			var eye = Matrix.identity(this.rows);
			var rrefData = this.rref(eye);
			
			if (rrefData.rref.equals(eye)) return rrefData.augment;
			else throw new Error ("Matrix not invertible");
		}
	};
	this.scale = function (scaleFactor) {
		var scaled = new Matrix (this.rows, this.cols);
		
		for (var row = 0; row < this.rows; ++row) {
			scaled.setRow(row, this.getRow(row).map(function (x) {
				return x * scaleFactor; 
			}));
		}
		
		return scaled;
	};
	this.multiply = function (other) {
		if (typeof other === "number")
			throw new TypeError ("Use Matrix.scale for scalar multiplication");
		else if (this.cols !== other.rows)
			throw new RangeError ("Dimension mismatch");
		
		var multiplied = new Matrix (this.rows, other.cols);
		
		for (var row = 0; row < this.rows; ++row) {
			for (var col = 0; col < other.cols; ++col) {
				multiplied.set(row, col, Matrix.dot(this.getRow(row), other.getCol(col)));
			}
		}
		
		return multiplied;
	};
	this._checkRow = function (row) {
		if (row < 0 || row >= this.rows)
			throw new RangeError("Row index out of range");
	};
	this._checkCol = function (col) {
		if (col < 0 || col >= this.cols)
			throw new RangeError("Column index out of range");
	};
	this._checkIndex = function (row, col) {
		this._checkRow(row);
		this._checkCol(col);
	}
	this._scaleRow = function (row, scaleFactor) {
		this._checkRow(row);
		
		this.data[row] = this.data[row].map(function (x) {
			return x * scaleFactor; 
		});
	};
	this._divideRow = function (row, divisor) {
		this._checkRow(row);
		
		this.data[row] = this.data[row].map(function (x) {
			return x / divisor;
		});
	}
	this._addRow = function (row, added, scaleFactor) {
		this._checkRow(row);
		if (added.length !== this.cols)
			throw new RangeError ("Added row must be of length " + cols.toString());
		
		scaleFactor = scaleFactor === undefined ? 1 : scaleFactor;
		for (var col = 0; col < this.cols; ++col)
			this.data[row][col] += added[col] * scaleFactor;
	};
	this._swapRows = function (row1, row2) {
		this._checkRow(row1);
		this._checkRow(row2);
		
		var tmp = this.getRow(row1).slice();
		this.setRow(row1,this.getRow(row2));
		this.setRow(row2,tmp);
	};
}

Matrix.copy = function (matrix) {
	var clone = new Matrix (matrix.rows, matrix.cols);
	for (var row = 0; row < clone.rows; ++row)
		clone.setRow(row, matrix.getRow(row));
	return clone;
};
Matrix.colFromArray = function (vec) {
	colVec = new Matrix (vec.length, 1);
	colVec.setCol(0, vec);
	return colVec;
};
Matrix.rowFromArray = function (vec) {
	rowVec = new Matrix (1, vec.length);
	rowVec.setRow(0, vec);
	return rowVec;
};
Matrix.dot = function (vec1, vec2) {
	if (vec1.length !== vec2.length)
		throw new RangeError ("Input vectors of unequal lengths");
	
	return (vec1.reduce(function (sum, value, i) {
		return sum += value * vec2[i];
	}, 0));
};
Matrix.identity = function (w) {
	var eye = new Matrix(w,w,true);
	
	for (var i = 0; i < w; ++i) eye.set(i,i,1);
	
	return eye;
};