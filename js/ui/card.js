define(['react'], function(React) {
    return {
        build: function(UI) {
            UI.register('UI.Card.Header', {
                'ReactClass': {
                    getDefaultProps: function() {
                        return { 
                            title: 'Card title', 
                            subtitle: '',
                            actions: [
                                { 
                                    title: '',
                                    href: '',
                                    onClick: function(e) {}
                                }
                            ]
                        };
                    },
                    render: function() {
                        var actions = [];
                        for (var i = 0; i < this.props.actions.length; i++) {
                            actions.push(React.createElement(
                                'li', {                    
                                    key: 'action-' + i
                                },
                                this.props.actions[i]
                            ));
                        }

                        return React.createElement(
                            'div', {
                                className: "card-header ch-alt"
                            },
                            React.createElement(
                                'h2', {
                                },
                                this.props.title,
                                React.createElement(
                                    'small', {                            
                                    },
                                    this.props.subtitle
                                ),
                                React.createElement(
                                    'ul', {
                                        className: 'actions'
                                    },
                                    React.createElement(
                                        'li', {
                                            className: 'dropdown'
                                        },
                                        React.createElement(
                                            'a', {
                                                'data-toggle': 'dropdown',
                                                'aria-expanded': false,
                                                href: ''
                                            },
                                            React.createElement(
                                                'i', {
                                                    className: 'zmdi zmdi-more-vert'
                                                }
                                            )
                                        ),
                                        React.createElement(
                                            'ul', {
                                                className: 'dropdown-menu dropdown-menu-right'
                                            },
                                            actions
                                        )
                                    )
                                ),
                                this.props.children
                            )
                        );
                    }
                }
            });


            UI.register('UI.Card.Body', {
                'ReactClass': {    
                    getDefaultProps: function() {
                        return {
                            extraClass: ''
                        };
                    },
                    render: function() {
                        return React.createElement(
                            'div', {
                                className: 'card-body ' + this.props.extraClass
                            },
                            this.props.children
                        );
                    }
                }
            });

            UI.register('UI.Card', {
                'ReactClass': {
                    getDefaultProps: function() {
                        return {                
                        }
                    },
                    render: function() {
                        return React.createElement(
                            'div', {
                                className: 'card'
                            },
                            this.props.children
                        )
                    }
                }
            });
        }
    }
});
