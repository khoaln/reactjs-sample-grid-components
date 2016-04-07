define(['rad-container', 'rad-dispatcher', 'rad-ui', 'rad-widget'], 
    function(Container, Dispatcher, UI, Widget) {
        return {
            Container: Container,
            Dispatcher: Dispatcher,
            UI: UI,
            Widget: Widget,
            Controller: {},
            Manager: {
            },

            bootstrap: function() {                
                this.Container.bootstrap();
                this.Dispatcher.bootstrap();
                this.UI.bootstrap();
                this.Widget.bootstrap();           
            }
        };
    }
);