
define(['react', 
        'rad-widget-pack/grid'], 
    function(React, GridWidget) {
        return {
            registry: {},
            register: function(id, widget) {
                this.registry[id] = widget;
            },
            getReactClass: function(id) {
                var widget = this.registry[id];
                if (widget == undefined) {
                    console.log("ERROR! Can't find UI: " + id);
                }
                return React.createClass(widget().ReactClass);
            },
            getControllerClass: function(id) {
                var widget = this.registry[id];
                if (widget == undefined) {
                    console.log("ERROR! Can't find UI: " + id);
                }
                return widget().Controller;
            },

            createWidget: function(id, props = {}) {
                var widget = React.createElement(this.getReactClass(id), props);
                return widget;
            },
            bootstrap: function() {
                GridWidget.build(this);
            }
        };
    }
);
