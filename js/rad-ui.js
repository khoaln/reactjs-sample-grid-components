
define(['react', 
        'core',
        'data-tables',
        'card'], 
    function(React, CoreUI, DataTableUI, CardUI) {
        return {
            registry: {},
            classes: {

            },
            register: function(id, ui) {
                this.registry[id] = ui;
            },
            getReactClass: function(id) {
                var ui = this.registry[id];
                if (ui == undefined) {
                    console.log("ERROR! Can't find UI: " + id);
                }

                if (this.classes[id] == undefined) {
                    this.classes[id] = React.createClass(ui.ReactClass);   
                }
                return this.classes[id];
            },
            createElement: function(id, props) {
                return React.createElement(this.getReactClass(id), props);
            },
            bootstrap: function() {
                CoreUI.build(this);
                DataTableUI.build(this);
                CardUI.build(this);
            }
        };
    }
);
