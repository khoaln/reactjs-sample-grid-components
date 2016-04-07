define(['react'], function(React) {
    RAD = require(['rad']);
    
    return {
        AbstractWidget: {
            dispatch: function(id, payload) {
                var eventId = this.state.id + ':' + id; // Fix me
                RAD.Dispatcher.dispatch(eventId, payload);
            }
        },
        AbstractController: {
            widget: null,
            setWidget: function(widget) {
                this.widget = widget;
            },
            setConfig: function(config) {
                for (var k in config) {
                    this[k] = config[k]
                }
            }
        }
    }
});