var assert = require('assert');
var jsdom = require('jsdom');
var fs = require('fs');
var vm = require('vm');


describe('imagePreview', function() {
    describe('createHandleBars()', function() {

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

    it('should return element with correct id and class list', function() {
        var ip = new ImagePreview('drop_file2');
        var hb = ip.createHandleBars('name', 'classA classB');
        console.log(hb.id);
        assert.equal('drop_file2_name', hb.id);
        });
    });
});