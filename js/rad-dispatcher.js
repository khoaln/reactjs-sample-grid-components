define([], 
    function() {
        return {
            bootstrap: function() {
                
            },
            
            _callbacks: {},
            _isDispatching: false,
            _isHandled: {},
            _isPending: {},
            _lastId: 1,
            _pendingPayload: null,

            register: function(eventId, callback) {
                var id = this._lastId++;
                this._callbacks[id] = {
                    'eventId': eventId,
                    'callback': callback
                };

                return id;
            },

            unregister: function(id) {
                if (this._callbacks[id] != undefined) {
                    delete this._callbacks[id];
                }
            },

            dispatch: function(eventId, payload) {
                if (this._isDispatching) {
                    return false;
                }

                this.startDispatching(payload);

                for (var id in this._callbacks) {
                    if (this._isPending[id]) {
                        continue;
                    }

                    if (this._callbacks[id]['eventId'] == eventId) {
                        this.invokeCallback(id);
                    }
                }

                this.stopDispatching();
            },

            invokeCallback: function(id) {
                this._isPending[id] = true;
                this._callbacks[id]['callback'](this._pendingPayload);
                this._isHandled[id] = true;
            },

            startDispatching: function(payload) {
                for (var id in this._callbacks) {
                    this._isPending[id] = false;
                    this._isHandled[id] = false;
                }
                this._pendingPayload = payload;
                this._isDispatching = true;
            },

            stopDispatching: function() {
                delete this._pendingPayload;
                this._isDispatching = false;
            }
        };
    }
);