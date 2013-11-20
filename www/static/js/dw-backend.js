
/*
 * dw.backend is the parent namespace for all the JS
 * needed for operating Datawrapper, except for code
 * used to render charts
 */

var dw = dw || {};

(function() {

    var callbacks = {};

    dw.backend = {
        on: onEvent,
        off: offEvent,
        fire: fireEvent,
        // short-hand callback
        ready: function(cb) {
            dw.backend.on('ready', cb);
        },
    };

    require(['dw/backend', 'raphael'], function(backend, Raphael) {
        window.Raphael = Raphael;
        _.extend(dw.backend, backend);
        $(function() {
            backend.init();
            dw.backend.fire('ready');
        });
    });

    function onEvent(evt, func) {
        if (!callbacks[evt]) callbacks[evt] = $.Callbacks();
        callbacks[evt].add(func);
        return dw.backend;
    }

    function offEvent(evt, func) {
        if (!callbacks[evt]) return;
        if (arguments.length == 1) {
            // remove all listeners
            callbacks[evt] = $.Callbacks();
            return;
        }
        if ($.isFunction(func)) {
            // remove one particular listener
            callbacks[evt].remove(func);
        }
        return dw.backend;
    }

    function fireEvent(evt, params) {
        if (callbacks[evt]) callbacks[evt].fire(params);
        return dw.backend;
    }

}).call(this);
