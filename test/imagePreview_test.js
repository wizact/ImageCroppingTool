var assert = require('assert');
var jsdom = require('jsdom');
var fs = require('fs');
var vm = require('vm');


describe('imagePreview', function() {
    before(function() {
        var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
        var win = doc.defaultView;

        global.document = doc;
        global.window = win;

        propagateToGlobal(win);

        function propagateToGlobal (window) {
            for (var key in window) {
                if (!window.hasOwnProperty(key)) continue
                if (key in global) continue

                global[key] = window[key]
            }
        }

        var code = fs.readFileSync('./assets/js/imagePreview.js');
        vm.runInThisContext(code);
    });

    describe('createHandleBars()', function() {

    it('should return element with correct id and class list', function() {
        var ip = new ImagePreview('drop_file2');
        var hb = ip.createHandleBars('name', 'classA classB');
        assert.equal(hb.id, 'drop_file2_name');
        });
    });

    it('handle mouse up should reset the state', function() {
        var module = canvasEventModule;
        module.moveState.imageMoveState = true;
        module.resizeState.imageResizeState = true;

        module.handleMouseUp();

        assert.equal(false, module.moveState.imageMoveState);
        assert.equal(false, module.resizeState.imageResizeState);
    });

    function isHandleBarTest() {
        var module = canvasEventModule;
        return module.isHandleBar.call(arguments);
    }

    it('should identify handlebars by element type', function() {

        var tests = [
            { args: 'se', expected: true },
            { args: 'sw', expected: true },
            { args: 'ne', expected: true },
            { args: 'nw', expected: true }
        ];

        tests.forEach(function(test) {
            it('identity ' + test.args + ' as handlebar', function() {
                var actual = isHandleBarTest.apply(null, test.args);
                assert.equal(actual, tests.expected);
            });
        });
    });

    function toggleValue(value) {
        if (value === 1) {
            return 0;
        } else if (value === 0) {
            return 1;
        }

        throw new Error('Argument is not correct');
    }

    describe('findImagePositionType()', function() {
        it('should find image in position 1', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 0, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 0, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 0, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 0, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 1);
        });

        it('should find image in position 2', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 0, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 0, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 0, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 1, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 2);
        });

        it('should find image in position 3', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 0, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 0, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 1, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 0, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 3);
        });

        it('should find image in position 4', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 0, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 0, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 1, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 1, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 4);
        });

        it('should find image in position 5', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 0, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 1, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 0, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 0, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 5);
        });

        it('should find image in position 6', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 0, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 1, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 0, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 1, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 6);
        });

        it('should find image in position 7', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 0, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 1, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 1, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 0, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 7);
        });

        it('should find image in position 8', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 0, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 1, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 1, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 1, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 8);
        });

        it('should find image in position 9', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 1, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 0, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 0, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 0, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 9);
        });

        it('should find image in position 10', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 1, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 0, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 0, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 1, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 10);
        });

        it('should find image in position 11', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 1, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 0, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 1, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 0, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 11);
        });

        it('should find image in position 12', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 1, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 0, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 1, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 1, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 12);
        });

        it('should find image in position 13', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 1, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 1, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 0, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 0, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 13);
        });

        it('should find image in position 14', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 1, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 1, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 0, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 1, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 14);
        });

        it('should find image in position 15', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 1, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 1, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 1, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 0, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 15);
        });

        it('should find image in position 16', function() {
            var ip = new ImagePreview('drop_file2');
            var x_image_1 = 1, x_view_1 = toggleValue(x_image_1),
                x_image_2 = 1, x_view_2 = toggleValue(x_image_2),
                y_image_1 = 1, y_view_1 = toggleValue(y_image_1),
                y_image_2 = 1, y_view_2 = toggleValue(y_image_2);
            var actual = ip.findImagePositionType(x_image_1, x_image_2, y_image_1, y_image_2, x_view_1, x_view_2, y_view_1, y_view_2);
            assert.equal(actual, 16);
        });

    });

});

