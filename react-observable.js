/**
 * 2015 Matteo Bertamini <matteoappfarmer@gmail.com>
 * MIT license
 */

var Tmb = Tmb || {};
Tmb.lib = Tmb.lib || {};

Tmb.lib.eventEmitter = {
    _JQInit: function() {
        this._JQ = jQuery(this);
    },
    emit: function(evt, data) {
        !this._JQ && this._JQInit();
        this._JQ.trigger(evt, data);
    },
    once: function(evt, handler) {
        !this._JQ && this._JQInit();
        this._JQ.one(evt, handler);
    },
    on: function(evt, handler) {
        !this._JQ && this._JQInit();
        this._JQ.bind(evt, handler);
    },
    off: function(evt, handler) {
        !this._JQ && this._JQInit();
        this._JQ.unbind(evt, handler);
    }
};

Tmb.lib.Observable = function(initialValue, name) {
    var self = Tmb.lib.eventEmitter;
    var name = name;
    var obj = {
        value: initialValue,
        ops: self
    };

    self.get = function() {
        return obj.value
    };

    self.set = function(updated){
        if(obj.value == updated)
            return;

        obj.value = updated;
        self.emit('change', updated);
    };

    self.mixin = function() {
        var mixin = {
            getInitialState: function() {
                var obj_ret = {};
                obj_ret[name] = obj;

                return obj_ret;
            },
            componentDidMount : function() {
                self.on('change', function() {
                    var obj_new = {};
                    obj_new[name] = obj;

                    this.setState(obj_new);
                }.bind(this));
            }
        };

        return mixin;
    };

    return self;
};
