QUnit.module("Matrix");

QUnit.test("Default constructor/element getter", function (assert) {
    var m = new Matrix();

    assert.strictEqual(m.get(0, 0), undefined, "Element (0,0) undefined");
    assert.strictEqual(m.rows, 1, "1 row in matrix");
    assert.strictEqual(m.cols, 1, "1 column in matrix");

    assert.throws(function () {
        m.get(-1, 0);
    }, RangeError, "Getter bounds test 1");
    assert.throws(function () {
        m.get(0, -1);
    }, RangeError, "Getter bounds test 2");
    assert.throws(function () {
        m.get(1, 0);
    }, RangeError, "Getter bounds test 3");
    assert.throws(function () {
        m.get(0, 1);
    }, RangeError, "Getter bounds test 4");
});

QUnit.test("Custom constructor/element getter", function (assert) {
    var verifyContents = function (mat, val) {
        for (var i = 0; i < mat.rows; ++i) {
            for (var j = 0; j < mat.cols; ++j) {
                assert.strictEqual(mat.get(i, j), val, "Element (" + i + ','
                                                       + j + ") equal to "
                                                       + val);
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

    m = new Matrix(2, 2, true);
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

    assert.throws(function () {
        m.get(-1, 0);
    }, RangeError, "Getter bounds test 1");
    assert.throws(function () {
        m.get(0, -1);
    }, RangeError, "Getter bounds test 2");
    assert.throws(function () {
        m.get(10, 0);
    }, RangeError, "Getter bounds test 3");
    assert.throws(function () {
        m.get(0, 10);
    }, RangeError, "Getter bounds test 4");
});

QUnit.test("Get row values", function (assert) {
    var m = new Matrix(5, 5, true);
    var zeroes = [0, 0, 0, 0, 0];

    for (var i = 0; i < 5; ++i)
        assert.deepEqual(m.getRow(i), zeroes, "Square row " + i);

    m = new Matrix(5, 9, true);
    for (var i = 5; i < 9; ++i)
        zeroes.push(0);

    for (var i = 0; i < 5; ++i)
        assert.deepEqual(m.getRow(i), zeroes, "Rectangular wide row " + i);

    m = new Matrix(5, 3, true);
    zeroes = [0, 0, 0];

    for (var i = 0; i < 5; ++i)
        assert.deepEqual(m.getRow(i), zeroes, "Rectangular tall row " + i);

    assert.throws(function () {
        m.getRow(-1);
    }, RangeError, "Bounds test 1");
    assert.throws(function () {
        m.getRow(10);
    }, RangeError, "Bounds test 2");
});

QUnit.test("Get column values", function (assert) {
    var m = new Matrix(5, 5, true);
    var zeroes = [0, 0, 0, 0, 0];

    for (var i = 0; i < 5; ++i)
        assert.deepEqual(m.getCol(i), zeroes, "Square col " + i);

    m = new Matrix(3, 5, true);
    zeroes = [0, 0, 0];

    for (var i = 0; i < 5; ++i)
        assert.deepEqual(m.getCol(i), zeroes, "Rectangular wide col " + i);

    m = new Matrix(9, 5, true);
    for (var i = 3; i < 9; ++i)
        zeroes.push(0);

    for (var i = 0; i < 5; ++i)
        assert.deepEqual(m.getCol(i), zeroes, "Rectangular tall col " + i);
});

QUnit.test("Set element value", function (assert) {
      var m = new Matrix(2, 2, true);

      m.set(0, 0, 2);
      assert.strictEqual(m.get(0, 0), 2,
                         "(0,0) basic element check");

      m.set(0, 1, 7);
      assert.strictEqual(m.get(0, 1), 7,
                         "(0,1) basic element check");

      m.set(1, 0, 42);
      assert.strictEqual(m.get(1, 0), 42,
                         "(1,0) basic element check");

      m.set(1, 1, 475.33);
      assert.strictEqual(m.get(1, 1), 475.33,
                         "(1,1) basic element check");

      m = new Matrix(5, 9, true);

      for (var i = 0; i < 5; ++i) {
          for (var j = 0; j < 9; ++j) {
              m.set(i, j, i * j);
              assert
                      .strictEqual(
                                   m.get(i, j),
                                   i * j,
                                   '('
                                           + i
                                           + ','
                                           + j
                                           + ") rectangular element check (multiply)");
              m.set(i, j, (i + 1) / (j + 1));
              assert
                      .strictEqual(
                                   m.get(i, j),
                                   (i + 1) / (j + 1),
                                   '('
                                           + i
                                           + ','
                                           + j
                                           + ") rectangular element check (divide)");
          }
      }

      assert.throws(function () {
          m.set(-1, 0, 0);
      }, RangeError, "Bounds test 1");
      assert.throws(function () {
          m.set(0, -1, 0);
      }, RangeError, "Bounds test 2");
      assert.throws(function () {
          m.set(10, 0, 0);
      }, RangeError, "Bounds test 3");
      assert.throws(function () {
          m.set(0, 10, 0);
      }, RangeError, "Bounds test 4");
});

QUnit.test("Set row values", function (assert) {
       var m = new Matrix(5, 5);
       var row = [0, 1, 2, 3, 4];
       var col = [0, 5, 10, 15, 20];
       var adder = function (delta) {
           return function (x) {
               return x + delta;
           };
       };

       for (var i = 0; i < 5; ++i) {
           m.setRow(i, row.map(adder(i * 5)));
           assert.deepEqual(m.getRow(i), row.map(adder(i * 5)), "Square row " + i);
       }

       for (var i = 0; i < 5; ++i)
           assert.deepEqual(m.getCol(i), col.map(adder(i)), "Square col " + i);

       assert.throws(function () {
           m.setRow(-1, row);
       }, RangeError, "Bounds test 1");
       assert.throws(function () {
           m.setRow(10, row);
       }, RangeError, "Bounds test 2");
       assert.throws(function () {
           m.setRow(3, "Hello");
       }, TypeError, "Type test");
       assert.throws(function () {
           m.setRow(4, []);
       }, RangeError, "Length test");
});

QUnit.test("Set column values", function (assert) {
       var m = new Matrix(5, 5);
       var col = [0, 1, 2, 3, 4];
       var row = [0, 5, 10, 15, 20];
       var adder = function (delta) {
           return function (x) {
               return x + delta;
           };
       };

       for (var i = 0; i < 5; ++i) {
           m.setRow(i, col.map(adder(i * 5)));
           assert.deepEqual(m.getRow(i), col.map(adder(i * 5)), "Square row " + i);
       }

       for (var i = 0; i < 5; ++i)
           assert.deepEqual(m.getCol(i), row.map(adder(i)), "Square col " + i);

       assert.throws(function () {
           m.setCol(-1, col);
       }, RangeError, "Bounds test 1");
       assert.throws(function () {
           m.setCol(10, col);
       }, RangeError, "Bounds test 2");
       assert.throws(function () {
           m.setCol(3, "Hello");
       }, TypeError, "Type test");
       assert.throws(function () {
           m.setCol(4, []);
       }, RangeError, "Length test");
});

QUnit.test("Equality", function (assert) {
    var m1 = new Matrix(5, 5);
    var m1clone = new Matrix(5, 5);
    var m2 = new Matrix(5, 5);
    var m3 = new Matrix(5, 3);
    var m4 = new Matrix(3, 5);
    var m5 = new Matrix(3, 3);
    var base = [0, 1, 2, 3, 4];
    var adder = function (delta) {
        return function (x) {
            return x + delta;
        };
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
    var m = new Matrix(5, 5);
    var m2 = new Matrix(3, 3);
    var m3 = new Matrix(5, 5);
    var rref = new Matrix(5, 5, true);
    var testResult;
    var base = [0, 1, 2, 3, 4];
    var adder = function (delta) {
        return function (x) {
            return x + delta;
        };
    };

    for (var i = 0; i < 5; ++i)
        m.setRow(i, base.map(adder(i * 5)));
    rref.setRow(0, [1, 0, -1, -2, -3]);
    rref.setRow(1, [0, 1, 2, 3, 4]);

    testResult = m.rref();
    assert.ok(testResult.rref.equals(rref), "Square RREF #1");

    m = new Matrix(3, 3);
    m.setRow(0, [0, 19, 3]);
    m.setRow(1, [13, 15, 7]);
    m.setRow(2, [4, 19, 16]);

    testResult = m.rref(Matrix.colFromArray([8, 7, 13]));
    assert.ok(testResult.rref.equals(Matrix.identity(3)), "Square RREF #2");
    assert.ok(testResult.augment.equals(Matrix.colFromArray([-(271 / 2859),
                                                             (339 / 953),
                                                             (1183 / 2859)])),
              "Square augment #2");

    m = new Matrix(5, 5);
    m.setRow(0, [17, 24, 1, 8, 15]);
    m.setRow(1, [23, 5, 7, 14, 16]);
    m.setRow(2, [4, 6, 13, 20, 22]);
    m.setRow(3, [10, 12, 19, 21, 3]);
    m.setRow(4, [11, 18, 25, 2, 9]);

    testResult = m.rref(Matrix.colFromArray([4, 5, 6, 5, 5]));
    assert.ok(testResult.rref.equals(Matrix.identity(5)), "Square RREF #3");
    assert.ok(testResult.augment.equals(Matrix.colFromArray([(29 / 624),
                                                             (7 / 240),
                                                             (43 / 390),
                                                             (259 / 3120),
                                                             (361 / 3120)])),
              "Square augment #3");

    m = new Matrix(3, 5);
    m.setRow(0, [6, 9, 7, 2, 9]);
    m.setRow(1, [7, 1, 1, 8, 5]);
    m.setRow(2, [9, 2, 5, 5, 8]);

    rref = new Matrix(3, 5, true)
    for (var i = 0; i < 3; ++i)
        rref.set(i, i, 1);
    rref.setCol(3, [(232 / 181), (101 / 181), -(277 / 181)]);
    rref.setCol(4, [(112 / 181), (55 / 181), (66 / 181)]);

    testResult = m.rref(Matrix.colFromArray([7, 5, 4]));
    assert.ok(testResult.rref.equals(rref), "Underdetermined RREF #1");
    assert.ok(testResult.augment.equals(Matrix.colFromArray([(126 / 181),
                                                             (175 / 181),
                                                             -(152 / 181)])),
              "Underdetermined augment #1");

    m = new Matrix(3, 5);
    m.setRow(0, [8, 0, 9, 8, 5]);
    m.setRow(1, [9, 3, 1, 1, 2]);
    m.setRow(2, m.getRow(0).map(function (x) {
        return x * 2;
    }));

    rref = new Matrix(3, 5, true);
    for (var i = 0; i < 2; ++i)
        rref.set(i, i, 1);
    rref.setCol(2, [(9 / 8), -(73 / 24), 0]);
    rref.setCol(3, [1, -(8 / 3), 0]);
    rref.setCol(4, [(5 / 8), -(29 / 24), 0]);

    testResult = m.rref(Matrix.colFromArray([5, 7, 8]));
    assert.ok(testResult.rref.equals(rref), "Underdetermined RREF #2");

    m = new Matrix(5, 3);
    m.setRow(0, [0, 1, 2]);
    m.setRow(1, [1, 2, 3]);
    m.setRow(2, [0, 2, 4]);
    m.setRow(3, [5, 7, 6]);
    m.setRow(4, [4, 10, 8]);

    rref = new Matrix(5, 3, true);
    for (var i = 0; i < 3; ++i)
        rref.set(i, i, 1);

    testResult = m.rref();
    assert.ok(testResult.rref.equals(rref), "Overdetermined RREF #1");

    assert.throws(function () {
        m.rref(Matrix.colFromArray([]));
    }, RangeError, "Augment dimension checking");
});

QUnit.test("Transpose", function (assert) {
    var m = new Matrix(5, 5);
    var t = new Matrix(5, 5);

    m.setRow(0, [17, 24, 1, 8, 15]);
    m.setRow(1, [23, 5, 7, 14, 16]);
    m.setRow(2, [4, 6, 13, 20, 22]);
    m.setRow(3, [10, 12, 19, 21, 3]);
    m.setRow(4, [11, 18, 25, 2, 9]);

    t.setRow(0, [17, 23, 4, 10, 11]);
    t.setRow(1, [24, 5, 6, 12, 18]);
    t.setRow(2, [1, 7, 13, 19, 25]);
    t.setRow(3, [8, 14, 20, 21, 2]);
    t.setRow(4, [15, 16, 22, 3, 9]);

    assert.ok(m.transpose().equals(t), "Magic 5x5 transpose");

    m = new Matrix(3, 5);
    t = new Matrix(5, 3);

    m.setRow(0, [6, 9, 7, 2, 9]);
    m.setRow(1, [7, 1, 1, 8, 5]);
    m.setRow(2, [9, 2, 5, 5, 8]);

    t.setRow(0, [6, 7, 9]);
    t.setRow(1, [9, 1, 2]);
    t.setRow(2, [7, 1, 5]);
    t.setRow(3, [2, 8, 5]);
    t.setRow(4, [9, 5, 8]);

    assert.ok(m.transpose().equals(t), "3x5 transpose");

    m = new Matrix(5, 3);
    t = new Matrix(3, 5);

    m.setRow(0, [0, 1, 2]);
    m.setRow(1, [1, 2, 3]);
    m.setRow(2, [0, 2, 4]);
    m.setRow(3, [5, 7, 6]);
    m.setRow(4, [4, 10, 8]);

    t.setRow(0, [0, 1, 0, 5, 4]);
    t.setRow(1, [1, 2, 2, 7, 10]);
    t.setRow(2, [2, 3, 4, 6, 8]);

    assert.ok(m.transpose().equals(t), "5x3 transpose")
});

QUnit.test("Inverse", function (assert) {
       var m = new Matrix(5, 5);
       var inv = new Matrix(5, 5);

       m.setRow(0, [17, 24, 1, 8, 15]);
       m.setRow(1, [23, 5, 7, 14, 16]);
       m.setRow(2, [4, 6, 13, 20, 22]);
       m.setRow(3, [10, 12, 19, 21, 3]);
       m.setRow(4, [11, 18, 25, 2, 9]);

       inv.setRow(0, [-(77 / 15600), (133 / 2600), -(23 / 650),
                      (3 / 2600), (53 / 15600)]);
       inv.setRow(1, [(673 / 15600), -(97 / 2600), -(3 / 650),
                      (33 / 2600), (23 / 15600)]);
       inv.setRow(2, [-(59 / 1950), (1 / 325), (1 / 325), (1 / 325),
                      (71 / 1950)]);
       inv.setRow(3, [(73 / 15600), -(17 / 2600), (7 / 650),
                      (113 / 2600), -(55 / 1487)]);
       inv.setRow(4, [(43 / 15600), (1 / 200), (27 / 650), -(9 / 200),
                      (173 / 15600)]);

       assert.ok(m.inverse().equals(inv, 1e10), "Magic 5x5 inverse");

       m.setRow(0, [0, 5, 3, 5, 9]);
       m.setRow(1, [1, 2, 2, 8, 9]);
       m.setRow(2, [8, 5, 4, 8, 5]);
       m.setRow(3, [9, 3, 0, 5, 8]);
       m.setRow(4, [5, 6, 8, 2, 8]);

       inv.setRow(0, [-(587 / 6033), -(5 / 403), (168 / 12251),
                      (281 / 3422), (401 / 12251)]);
       inv.setRow(1, [(1169 / 3418), -(853 / 2856), (309 / 2584),
                      -(5 / 494), -(50 / 441)]);
       inv.setRow(2, [-(337 / 1826), (994 / 7227), (72 / 12251),
                      -(420 / 3901), (687 / 4379)]);
       inv.setRow(3, [-(1 / 49), (360 / 4253), (437 / 3736),
                      -(212 / 2889), -(391 / 5431)]);
       inv.setRow(4, [-(74 / 12251), (895 / 12251), -(613 / 4596),
                      (13 / 158), (621 / 12251)]);

       assert.ok(m.inverse().equals(inv, 1e10), "Invertible 5x5 #2");

       var adder = function (delta) {
           return function (x) {
               return x + delta;
           };
       };
       var base = [0, 1, 2, 3, 4];

       for (var i = 0; i < 5; ++i)
           m.setRow(i, base.map(adder(i * 5)));
       assert.throws(function () {
           m.inverse()
       }, Error, "Non-invertible square matrix");

       m = new Matrix(5, 3, true);
       assert.throws(function () {
           m.inverse()
       }, RangeError, "Tall matrix");

       m = new Matrix(3, 5, true);
       assert.throws(function () {
           m.inverse()
       }, RangeError, "Short matrix");
});

QUnit.test("Scale", function (assert) {
    var m = new Matrix(5, 5);
    var result = new Matrix(5, 5);
    var multiply = function (multiplier) {
        return function (x) {
            return x * multiplier;
        };
    };

    m.setRow(0, [3, 3, 3, 8, 0]);
    m.setRow(1, [0, 2, 8, 7, 9]);
    m.setRow(2, [9, 9, 1, 0, 4]);
    m.setRow(3, [9, 8, 8, 4, 3]);
    m.setRow(4, [8, 0, 6, 4, 9]);

    for (var i = 0; i < 5; ++i)
        result.setRow(i, m.getRow(i).map(multiply(5)));

    assert.ok(m.scale(5).equals(result), "5x5 scale factor 5");

    for (var i = 0; i < 5; ++i)
        result.setRow(i, m.getRow(i).map(multiply(4.2)));

    assert.ok(m.scale(4.2).equals(result), "5x5 scale factor 4.2");

    m = new Matrix(5, 3);
    result = new Matrix(5, 3);

    m.setRow(0, [7, 6, -9]);
    m.setRow(1, [-9, -10, -2]);
    m.setRow(2, [-7, -5, -6]);
    m.setRow(3, [0, 7, 4]);
    m.setRow(4, [-5, 2, 0]);

    for (var i = 0; i < 5; ++i)
        result.setRow(i, m.getRow(i).map(multiply(3.9)));

    assert.ok(m.scale(3.9).equals(result), "5x3 scale factor 3.9");

    for (var i = 0; i < 5; ++i)
        result.setRow(i, m.getRow(i).map(multiply(0.7529)));

    assert.ok(m.scale(0.7529).equals(result), "5x3 scale factor 0.7529");

    m = new Matrix(3, 5);
    result = new Matrix(3, 5);

    m.setRow(0, [-7, 9, 4, 3, 0]);
    m.setRow(1, [-4, -4, -9, 1, 9]);
    m.setRow(2, [-6, -1, 2, 0, -2]);

    for (var i = 0; i < 3; ++i)
        result.setRow(i, m.getRow(i).map(multiply(19.503)));

    assert.ok(m.scale(19.503).equals(result), "3x5 scale factor 19.503");

    for (var i = 0; i < 3; ++i)
        result.setRow(i, m.getRow(i).map(multiply(-1.9216)));

    assert.ok(m.scale(-1.9216).equals(result), "3x5 scale factor -1.9216");
});

QUnit.test("Multiplication", function (assert) {
    var m1 = new Matrix(3, 3);
    var m2 = new Matrix(3, 3);
    var result = new Matrix(3, 3);

    m1.setRow(0, [3, 3, 8]);
    m1.setRow(1, [3, 6, 3]);
    m1.setRow(2, [1, 8, 8]);

    m2.setRow(0, [9, 1, 2]);
    m2.setRow(1, [8, 5, 4]);
    m2.setRow(2, [1, 7, 1]);

    result.setRow(0, [59, 74, 26]);
    result.setRow(1, [78, 54, 33]);
    result.setRow(2, [81, 97, 42]);

    assert.ok(m1.multiply(m2).equals(result), "[3x3] times [3x3]");

    result.setRow(0, [32, 49, 91]);
    result.setRow(1, [43, 86, 111]);
    result.setRow(2, [25, 53, 37]);

    assert.ok(m2.multiply(m1).equals(result), "[3x3] times [3x3] (reverse)");
    assert.ok(m1.multiply(Matrix.identity(3)).equals(m1),
              "[3x3] times [3x3] identity");

    m1 = new Matrix(3, 5);
    m2 = new Matrix(5, 3);
    result = new Matrix(3, 3);

    m1.setRow(0, [-4, 9, -9, 1, 7]);
    m1.setRow(1, [5, -10, -1, 8, 2]);
    m1.setRow(2, [3, 6, 8, -6, 8]);

    m2.setRow(0, [-10, 1, 2]);
    m2.setRow(1, [8, -5, 9]);
    m2.setRow(2, [4, -1, -6]);
    m2.setRow(3, [3, 8, -9]);
    m2.setRow(4, [0, 0, -5]);

    result.setRow(0, [79, -32, 83]);
    result.setRow(1, [-110, 120, -156]);
    result.setRow(2, [32, -83, 26]);

    assert.ok(m1.multiply(m2).equals(result), "[3x5] times [5x3]");

    result = new Matrix(5, 5);

    result.setRow(0, [51, -88, 105, -14, -52]);
    result.setRow(1, [-30, 176, 5, -86, 118]);
    result.setRow(2, [-39, 10, -83, 32, -22]);
    result.setRow(3, [1, -107, -107, 121, -35]);
    result.setRow(4, [-15, -30, -40, 30, -40]);

    assert.ok(m2.multiply(m1).equals(result), "[5x3] times [3x5]");
    assert.ok(m1.multiply(Matrix.identity(5)).equals(m1),
              "[3x5] times [5x5] identity");
    assert.ok(m2.multiply(Matrix.identity(3)).equals(m2),
              "[5x3] times [3x3] identity");
    assert.throws(function () {
        m2.multiply(result);
    }, RangeError, "Multiplication dimension checking");

    m1 = new Matrix(1, 1);
    m1.set(0, 0, 8);

    assert.throws(function () {
        m1.multiply(m2);
    }, RangeError, "Multiplication dimension checking (with 1x1 on left)");
    assert.throws(function () {
        m2.multiply(m1);
    }, RangeError, "Multiplication dimension checking (with 1x1 on right)");
    assert.throws(function () {
        m2.multiply(8);
    }, TypeError, "Scalar multiplication check");
    assert.throws(function () {
        m1.multiply(8);
    }, TypeError, "Scalar multiplication check (with 1x1 matrix)");

    m2 = new Matrix(1, 1);
    m2.set(0, 0, 7);
    result = new Matrix(1, 1);
    result.set(0, 0, 56);

    assert.ok(m1.multiply(m2).equals(result), "[1x1] times [1x1]");
    assert.ok(m2.multiply(m1).equals(result), "[1x1] times [1x1] (reversed)");
});

QUnit.test("Copy", function (assert) {
    var m = new Matrix(3, 3);

    m.setRow(0, [3, 3, 8]);
    m.setRow(1, [3, 6, 3]);
    m.setRow(2, [1, 8, 8]);
    assert.ok(Matrix.copy(m).equals(m), "[3x3] clone");

    m = new Matrix(3, 5);
    m.setRow(0, [-4, 9, -9, 1, 7]);
    m.setRow(1, [5, -10, -1, 8, 2]);
    m.setRow(2, [3, 6, 8, -6, 8]);
    assert.ok(Matrix.copy(m).equals(m), "[3x5] clone");

    m = new Matrix(5, 3);
    m.setRow(0, [-10, 1, 2]);
    m.setRow(1, [8, -5, 9]);
    m.setRow(2, [4, -1, -6]);
    m.setRow(3, [3, 8, -9]);
    m.setRow(4, [0, 0, -5]);
    assert.ok(Matrix.copy(m).equals(m), "[5x3] clone");
});

QUnit.test("Column vector (as Matrix) from array", function (assert) {
    var m = new Matrix(5, 1);
    var check = Matrix.colFromArray([0, 1, 2, 3, 4]);

    for (var i = 0; i < 5; ++i)
        m.set(i, 0, i);

    assert.ok(check.equals(m), "Basic [5x1] check");
});

QUnit.test("Row vector (as Matrix) from array", function (assert) {
    var m = new Matrix(1, 5);
    var check = Matrix.rowFromArray([0, 1, 2, 3, 4]);

    for (var i = 0; i < 5; ++i)
        m.set(0, i, i);

    assert.ok(check.equals(m), "Basic [1x5] check");
});

QUnit.test("Dot product", function (assert) {
    var vec1 = [3, -6, 0, 9, 0];
    var vec2 = [8, -3, -3, -10, -5];

    assert.equal(Matrix.dot(vec1, vec2), -48, "Dot product #1");
    assert.equal(Matrix.dot(vec2, vec1), -48, "Dot product #1 (reversed)");

    vec1 = [-4, -10, -2, 2, -5];
    vec2 = [3, 1, 4, 3, -2];

    assert.equal(Matrix.dot(vec1, vec2), -14, "Dot product #2");

    vec1 = [-5, -4, 9, 4, 2];
    vec2 = [5, 9, 5, 5, 6];

    assert.equal(Matrix.dot(vec1, vec2), 16, "Dot product #3");

    vec2 = [0, 0, 0];

    assert.throws(function () {
        Matrix.dot(vec1, vec2);
    }, RangeError, "Dot product dimension check #1");
    assert.throws(function () {
        Matrix.dot(vec2, vec1);
    }, RangeError, "Dot product dimension check #2");
});

QUnit.test("Identity", function (assert) {
    var eye, check;

    for (var w = 0; w < 10; ++w) {
        eye = new Matrix(w + 1, w + 1, true);
        check = Matrix.identity(w + 1);

        for (var i = 0; i < (w + 1); ++i)
            eye.set(i, i, 1);

        assert.ok(check.equals(eye), '[' + (w + 1) + 'x' + (w + 1)
                                     + "] identity");
        assert.ok(check.inverse().equals(eye), '[' + (w + 1) + 'x' + (w + 1)
                                               + "] identity inverse");
    }
});
