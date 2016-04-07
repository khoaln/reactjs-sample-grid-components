define(['react', 
    'rad-widget-pack/abstract',
    'lodash'], 
    function(React, Abstract) {
        RAD = require(['rad']);
        return {
            build: function(Widget) {
                Widget.register('Widget.Grid', this.getWidgetGrid)
            },
            getWidgetGrid: function() {
                return {
                    'ReactClass': Object.assign({}, Abstract.AbstractWidget, {
                        getInitialState: function() {
                            return { 
                                id: '',
                                title: 'Grid title',
                                subtitle: 'Grid subtitle',
                                columns: [],
                                actions: [],                                
                                data: [],
                                page: 1,
                                pageLength: 5,
                                totalMatched: 0,
                                numberPageShow: 2,
                                startPageShow: 1,
                                selectedRows: [],
                                commands: []
                            };
                        },
                        render: function() {
                            var actions = [];
                            for (var i = 0; i < this.state.actions.length; i++) {
                                var a = this.state.actions[i];
                                
                                actions.push(React.createElement(
                                    'a', {
                                        onClick: function(href, e) {
                                            this.dispatch('action.onClick', {
                                                event: e,
                                                href: href
                                            });
                                        }.bind(this, a.href)
                                    },
                                    a.title
                                ));
                            }

                            // add event hanlder for commands
                            this.state.commands.map(function(command) {
                                command['onClick'] = function(id, e) {
                                    this.dispatch(command.bind_event, { 
                                        event: e,
                                        url: command.url,
                                        id: id
                                    });
                                }.bind(this)
                            }.bind(this));

                            return React.createElement(
                                RAD.UI.getReactClass('UI.Card'), {
                                },
                                React.createElement(
                                    RAD.UI.getReactClass('UI.Card.Header'), {
                                        title: this.state.title,
                                        subtitle: this.state.subtitle,
                                        actions: actions
                                    },
                                    React.createElement(
                                        RAD.UI.getReactClass('UI.Core.Button'), {      
                                            onClick: function(e) { 
                                                this.dispatch('button.onClick', { event: e }); 
                                            }.bind(this)
                                        }
                                    )
                                ),
                                React.createElement(
                                    RAD.UI.getReactClass('UI.Card.Body'), {
                                    },
                                    React.createElement(
                                        RAD.UI.getReactClass('UI.DataTable'), {
                                            columns: this.state.columns,
                                            data: this.state.data,
                                            selectedRows: this.state.selectedRows,
                                            commands: this.state.commands,
                                            onRowCheckboxClick: function(e, rows, checked) {
                                                if (checked) {
                                                    this.setState({
                                                        selectedRows: _.union(this.state.selectedRows, rows)
                                                    });
                                                } else {
                                                    this.setState({
                                                        selectedRows: _.difference(this.state.selectedRows, rows)
                                                    });
                                                }
                                            }.bind(this)
                                        }
                                    ),
                                    React.createElement(
                                        'div', {
                                            className: 'bootgrid-footer container-fluid'
                                        },
                                        React.createElement(
                                            RAD.UI.getReactClass('UI.Core.Paginator'), {
                                                currentPage: this.state.page,
                                                totalPages:  this.state.pageLength == 0 ? 0 : Math.ceil(this.state.totalMatched / this.state.pageLength),
                                                totalMatched: this.state.totalMatched,
                                                numberPageShow: this.state.numberPageShow,
                                                startPageShow: this.state.startPageShow,
                                                pageLength: this.state.pageLength,
                                                onPageChange: function(e, page) { 
                                                    this.dispatch('grid.onPageChange', { 
                                                        event: e, 
                                                        page: page,
                                                        pageLength: this.state.pageLength
                                                    }); 
                                                }.bind(this),
                                                onPageLengthChange: function(e, pageLength) {
                                                    this.dispatch('grid.onPageLengthChange', {
                                                        event: e,
                                                        pageLength: pageLength
                                                    })
                                                }.bind(this)
                                            }
                                        )
                                    )
                                )
                            );
                        }
                    }),
                    'Controller':  Object.assign({}, Abstract.AbstractController, {
                        dataSourceUrl: '',
                        createPageUrl: '',
                        bootstrap: function() {
                            var id = this.widget.state.id;
                            RAD.Dispatcher.register(id + ':button.onClick', this.handleOnButtonClick.bind(this));
                            RAD.Dispatcher.register(id + ':grid.onPageChange', this.handleOnPageChange.bind(this));
                            RAD.Dispatcher.register(id + ':grid.onPageLengthChange', this.handleOnPageLengthChange.bind(this));
                            RAD.Dispatcher.register(id + ':action.onClick', this.handleOnActionClick.bind(this));
                            RAD.Dispatcher.register(id + ':command.onClickEdit', this.handleOnCommandEditClick.bind(this));
                            RAD.Dispatcher.register(id + ':command.onClickDelete', this.handleOnCommandDeleteClick.bind(this));
                        },
                        reloadData: function() {
                            RAD.Container
                                .makeAjax(this.dataSourceUrl, { page: this.widget.state.page, 
                                    pageLength: this.widget.state.pageLength })
                                .success(function(resp) {
                                    var totalMatched = resp.totalMatched;
                                    var totalPages = Math.ceil(totalMatched / this.widget.state.pageLength);
                                    this.widget.setState({
                                        data: resp.data,
                                        page: Math.min(totalPages, this.widget.state.page),
                                        totalPages: totalPages,
                                        totalMatched: totalMatched
                                    });
                                }.bind(this));
                        },
                        handleOnButtonClick: function(payload) {
                            document.location = this.createPageUrl;
                        },
                        handleOnPageChange: function(payload) {
                            RAD.Container
                                .makeAjax(this.dataSourceUrl, { page: payload.page, pageLength: payload.pageLength })
                                .success(function(resp) {
                                    var endPageShow = this.widget.state.startPageShow + this.widget.state.numberPageShow - 1;
                                    var newStart = this.widget.state.startPageShow;
                                    if (payload.page > endPageShow) newStart += 1;
                                    else if (payload.page < newStart) newStart -= 1;

                                    this.widget.setState({
                                        data: resp.data,
                                        page: payload.page,
                                        startPageShow: newStart
                                    });
                                }.bind(this));
                        },
                        handleOnPageLengthChange: function(payload) {
                            RAD.Container
                                .makeAjax(this.dataSourceUrl, { pageLength: payload.pageLength })
                                .success(function(resp) {
                                    this.widget.setState({
                                        data: resp.data,
                                        page: 1,
                                        pageLength: payload.pageLength,
                                        startPageShow: 1
                                    });
                                }.bind(this));
                        },
                        handleOnActionClick: function(payload) {
                            var selectedRows = this.widget.state.selectedRows.slice(0);
                            _.remove(selectedRows, function(n) { return n=='all'; });

                            RAD.Container
                                .makeAjax(payload.href, { data: _.join(selectedRows, ',')}, 'POST')
                                .success(function(resp) {
                                    this.reloadData();
                                }.bind(this));
                        },
                        handleOnCommandEditClick: function(payload) {
                            window.location = payload.url + payload.id;
                        },
                        handleOnCommandDeleteClick: function(payload) {
                            RAD.Container
                                .makeAjax(payload.url+payload.id)
                                .success(function(resp) {
                                    this.reloadData();
                                }.bind(this));
                        }
                    })
                }
            }
        }
    }
);