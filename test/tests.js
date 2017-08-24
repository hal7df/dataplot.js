QUnit.module("Matrix");

QUnit.test("Default constructor/element getter", function (assert) {
	var m = new Matrix();
	
	assert.strictEqual(m.get(0,0), undefined, "Element (0,0) undefined");
	assert.strictEqual(m.rows, 1, "1 row in matrix");
	assert.strictEqual(m.cols, 1, "1 column in matrix");
	
	assert.throws(function () { m.get(-1, 0); }, RangeError, "Getter bounds test 1");
	assert.throws(function () { m.get(0, -1); }, RangeError, "Getter bounds test 2");
	assert.throws(function () { m.get(1, 0); }, RangeError, "Getter bounds test 3");
	assert.throws(function () { m.get(0, 1); }, RangeError, "Getter bounds test 4");
});

QUnit.test("Custom constructor/element getter", function (assert) {
	var verifyContents = function (mat, val) {
		for (var i = 0; i < mat.rows; ++i) {
			for (var j = 0; j < mat.cols; ++j) {
				assert.strictEqual(mat.get(i,j), val, "Element (" + i + ',' + j + ") equal to " + val);
			}
		}
	}

	var m = new Matrix(2, 2);
	assert.strictEqual(m.rows, 2, "2x2 undefined row check");
	assert.strictEqual(m.cols, 2, "2x2 undefined col check");
	verifyContents(m, undefined);
	
	m = new Matrix(2, 2, false);
	assert.strictEqual(m.rows, 2, "2x2 explicit undefined row check");
	assert.strictEqual(m.cols, 2, "2x2 explicit undefined col check");
	verifyContents(m, undefined);
	
	m = new Matrix(2,2,true);
	assert.strictEqual(m.rows, 2, "2x2 zero row check");
	assert.strictEqual(m.cols, 2, "2x2 zero col check");
	verifyContents(m, 0);
	
	m = new Matrix(5, 9);
	assert.strictEqual(m.rows, 5, "5x9 undefined row check");
	assert.strictEqual(m.cols, 9, "5x9 undefined col check");
	verifyContents(m, undefined);
	
	m = new Matrix(5, 9, true);
	assert.strictEqual(m.rows, 5, "5x9 zero row check");
	assert.strictEqual(m.cols, 9, "5x9 zero col check");
	verifyContents(m, 0);
	
	m = new Matrix(9, 5);
	assert.strictEqual(m.rows, 9, "9x5 undefined row check");
	assert.strictEqual(m.cols, 5, "9x5 undefined col check");
	verifyContents(m, undefined);
	
	m = new Matrix(9, 5, true);
	assert.strictEqual(m.rows, 9, "9x5 zero row check");
	assert.strictEqual(m.cols, 5, "9x5 zero col check");
	verifyContents(m, 0);
	
	assert.throws(function () { m.get(-1, 0); }, RangeError, "Getter bounds test 1");
	assert.throws(function () { m.get(0, -1); }, RangeError, "Getter bounds test 2");
	assert.throws(function () { m.get(10, 0); }, RangeError, "Getter bounds test 3");
	assert.throws(function () { m.get(0, 10); }, RangeError, "Getter bounds test 4");
});

QUnit.test("Get row values", function (assert) {
	var m = new Matrix (5, 5, true);
	var zeroes = [0, 0, 0, 0, 0];
	
	for (var i = 0; i < 5; ++i)
		assert.deepEqual(m.getRow(i), zeroes, "Square row " + i);
	
	m = new Matrix (5, 9, true);
	for (var i = 5; i < 9; ++i) zeroes.push(0);
	
	for (var i = 0; i < 5; ++i)
		assert.deepEqual(m.getRow(i), zeroes, "Rectangular wide row " + i);
	
	m = new Matrix (5, 3, true);
	zeroes = [0, 0, 0];
	
	for (var i = 0; i < 5; ++i)
		assert.deepEqual(m.getRow(i), zeroes, "Rectangular tall row " + i);
	
	assert.throws(function () { m.getRow(-1); }, RangeError, "Bounds test 1");
	assert.throws(function () { m.getRow(10); }, RangeError, "Bounds test 2");
});

QUnit.test("Get column values", function (assert) {
	var m = new Matrix (5, 5, true);
	var zeroes = [0, 0, 0, 0, 0];
	
	for (var i = 0; i < 5; ++i)
		assert.deepEqual(m.getCol(i), zeroes, "Square col " + i);
	
	m = new Matrix (3, 5, true);
	zeroes = [0, 0, 0];
	
	for (var i = 0; i < 5; ++i)
		assert.deepEqual(m.getCol(i), zeroes, "Rectangular wide col " + i);
	
	m = new Matrix (9, 5, true);
	for (var i = 3; i < 9; ++i) zeroes.push(0);
	
	for (var i = 0; i < 5; ++i)
		assert.deepEqual(m.getCol(i), zeroes, "Rectangular tall col " + i);
});

QUnit.test("Set element value", function (assert) {
	var m = new Matrix (2, 2, true);
	
	m.set(0,0,2);
	assert.strictEqual(m.get(0,0), 2, "(0,0) basic element check");
	
	m.set(0,1,7);
	assert.strictEqual(m.get(0,1), 7, "(0,1) basic element check");
	
	m.set(1,0,42);
	assert.strictEqual(m.get(1,0), 42, "(1,0) basic element check");
	
	m.set(1,1,475.33);
	assert.strictEqual(m.get(1,1), 475.33, "(1,1) basic element check");
	
	m = new Matrix (5, 9, true);
	
	for (var i = 0; i < 5; ++i) {
		for (var j = 0; j < 9; ++j) {
			m.set(i, j, i*j);
			assert.strictEqual(m.get(i,j), i*j, '(' + i + ',' + j + ") rectangular element check (multiply)");
			m.set(i, j, (i+1)/(j+1));
			assert.strictEqual(m.get(i,j), (i+1)/(j+1), '(' + i + ',' + j + ") rectangular element check (divide)");
		}
	}
	
	assert.throws(function () { m.set(-1, 0, 0); }, RangeError, "Bounds test 1");
	assert.throws(function () { m.set(0, -1, 0); }, RangeError, "Bounds test 2");
	assert.throws(function () { m.set(10, 0, 0); }, RangeError, "Bounds test 3");
	assert.throws(function () { m.set(0, 10, 0); }, RangeError, "Bounds test 4");
});

QUnit.test("Set row values", function (assert) {
	var m = new Matrix (5, 5);
	var row = [0, 1, 2, 3, 4];
	var col = [0, 5, 10, 15, 20];
	var adder = function (delta) {
		return function (x) { return x + delta; };
	};
	
	for (var i = 0; i < 5; ++i) {
		m.setRow(i, row.map(adder(i * 5)));
		assert.deepEqual(m.getRow(i), row.map(adder(i * 5)), "Square row " + i);
	}
	
	for (var i = 0; i < 5; ++i)
		assert.deepEqual(m.getCol(i), col.map(adder(i)), "Square col " + i);
		
	assert.throws(function () { m.setRow(-1, row); }, RangeError, "Bounds test 1");
	assert.throws(function () { m.setRow(10, row); }, RangeError, "Bounds test 2");
	assert.throws(function () { m.setRow(3, "Hello"); }, TypeError, "Type test");
	assert.throws(function () { m.setRow(4, []); }, RangeError, "Length test");
});

QUnit.test("Set column values", function (assert) {
	var m = new Matrix (5, 5);
	var col = [0, 1, 2, 3, 4];
	var row = [0, 5, 10, 15, 20];
	var adder = function (delta) {
		return function (x) { return x + delta; };
	};
	
	for (var i = 0; i < 5; ++i) {
		m.setRow(i, col.map(adder(i * 5)));
		assert.deepEqual(m.getRow(i), col.map(adder(i * 5)), "Square row " + i);
	}
	
	for (var i = 0; i < 5; ++i)
		assert.deepEqual(m.getCol(i), row.map(adder(i)), "Square col " + i);
	
	assert.throws(function () { m.setCol(-1, col); }, RangeError, "Bounds test 1");
	assert.throws(function () { m.setCol(10, col); }, RangeError, "Bounds test 2");
	assert.throws(function () { m.setCol(3, "Hello"); }, TypeError, "Type test");
	assert.throws(function () { m.setCol(4, []); }, RangeError, "Length test");
});

QUnit.test("Equality", function (assert) {
	var m1 = new Matrix (5, 5);
	var m1clone = new Matrix (5, 5);
	var m2 = new Matrix (5, 5);
	var m3 = new Matrix (5, 3);
	var m4 = new Matrix (3, 5);
	var m5 = new Matrix (3, 3);
	var base = [0, 1, 2, 3, 4];
	var adder = function (delta) {
		return function (x) { return x + delta; };
	};
	
	for (var i = 0; i < 5; ++i) {
		m1.setRow(i, base.map(adder(i * 5)));
		m1clone.setRow(i, base.map(adder(i * 5)));
		m2.setCol(i, base.map(adder(i * 5)));
		
		if (i < 3) {
			m3.setCol(i, base.map(adder(i * 5)));
			m4.setRow(i, base.map(adder(i * 5)));
			m5.setRow(i, base.map(adder(i * 5)).splice(2));
		}
	}
	
	assert.ok(m1.equals(m1clone), "Equal matrices");
	assert.notOk(m1.equals(m2), "Unequal matrices of congruent dimensions");
	assert.notOk(m1.equals(m3), "Unequal matrices of unequal width");
	assert.notOk(m1.equals(m4), "Unequal matrices of unequal height");
	assert.notOk(m1.equals(m5), "Unequal matrices of unequal dimensions");
});

QUnit.test("Row reduction", function (assert) {
	var m1 = new Matrix (5, 5);
	var rref1 = new Matrix (5, 5, true);
	var testResult;
	var base = [0, 1, 2, 3, 4];
	var adder = function (delta) {
		return function (x) { return x + delta; };
	};
	
	for (var i = 0; i < 5; ++i) m1.setRow(i, base.map(adder(i * 5)));
	
	rref1.setRow(0, [1, 0, -1, -2, -3]);
	rref1.setRow(1, [0, 1, 2, 3, 4]);
	
	testResult = m1.rref();
	assert.ok(rref1.equals(testResult.rref), "RREF #1";
});