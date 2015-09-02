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

});