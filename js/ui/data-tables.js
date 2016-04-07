define(['react', 'react-dom', 'fixed-data-table'], function(React, ReactDOM, FixedDataTable) {
    return {
        build: function(UI) {
            UI.register('UI.DataTable', {
                'ReactClass': {
                    getDefaultProps: function() {
                        return {
                            columns: [],
                            data: [],
                            rowHeight: 40,
                            commands: [],
                            selectedRows: [],
                            onRowCheckboxClick: function(e) {}
                        }
                    },
                    render: function() {
                        var columns = [];
                        // Insert checkbox column. Need to rework
                        columns.push(
                            React.createElement(
                                FixedDataTable.Column, {
                                    key:        'id',
                                    header:     React.createElement(UI.getReactClass('UI.DataTable.CellRowCheckbox'), {
                                        value: 'all',
                                        selectedRows: this.props.selectedRows,
                                        onChange: function(e) {
                                            var name = e.target.getAttribute('name');
                                            var checked  = e.target.checked;
                                            var checkboxes = document.getElementsByName(name);
                                            var values = ['all'];

                                            for (var i = 1; i < checkboxes.length; i++) {
                                                values.push(parseInt(checkboxes[i].value));
                                            }

                                            if (this.props.onRowCheckboxClick != undefined) {
                                                this.props.onRowCheckboxClick(e, values, checked)
                                            }
                                        }.bind(this)
                                    }),
                                    cell:       React.createElement(UI.getReactClass('UI.DataTable.CellRowCheckbox'), {
                                        data: this.props.data,
                                        selectedRows: this.props.selectedRows,
                                        datakey: 'id',
                                        onChange: function(e) {
                                            if (this.props.onRowCheckboxClick != undefined) {
                                                this.props.onRowCheckboxClick(e, [parseInt(e.target.value)], e.target.checked)
                                            }
                                        }.bind(this)
                                    }),
                                    width: 50
                                }
                            )
                        );

                        for (var i = 0; i < this.props.columns.length; i++) {
                            var column = this.props.columns[i]

                            if (column.cell_options == undefined) {
                                column.cell_options = {};
                            }

                            column.cell_options['data'] = this.props.data;
                            column.cell_options['datakey'] = column.datakey;
                            if (column.is_commands_column == true) {
                                column.cell_options['commands'] = this.props.commands;
                            }
                            columns.push(React.createElement(
                                FixedDataTable.Column, {
                                    key:        column.id,
                                    header:     React.createElement(FixedDataTable.Cell, {}, column.title),
                                    cell:       React.createElement(UI.getReactClass(column.cell_type), column.cell_options),         // Hack!
                                    width:      column.width,
                                    flexGrow:   parseInt(column.flex_grow)
                                }
                            ));
                        }
                        
                        return React.createElement(
                            FixedDataTable.Table, {
                                rowHeight:    this.props.rowHeight,
                                rowsCount:    this.props.data.length,
                                width:        1140,
                                height:       (this.props.data.length + 1) * this.props.rowHeight + 50,
                                headerHeight: 40
                            },
                            columns
                        );
                    }
                }
            });

            UI.register('UI.DataTable.CellDefault', {
                'ReactClass': {
                    render: function() {
                        var data = this.props.data;
                        var rowIndex = this.props.rowIndex;
                        var datakey = this.props.datakey;

                        return React.createElement(FixedDataTable.Cell, {} , data[rowIndex][datakey]);
                    }
                }
            });

            UI.register('UI.DataTable.CellRowCheckbox', {
                'ReactClass': {
                    getDefaultProps: function() {
                        return {
                            checked: false,
                            onChange: function(e) {}
                        }
                    },
                    render: function() {
                        var checked = this.props.checked;
                        var data = this.props.data;
                        var rowIndex = this.props.rowIndex;
                        var datakey = this.props.datakey;
                        var value = this.props.value;
                        value = value != undefined ? value : data[rowIndex][datakey];

                        if (_.indexOf(this.props.selectedRows, value) !== -1) {
                            checked = true;
                        }

                        return React.createElement(
                            FixedDataTable.Cell, {},
                            React.createElement(
                                'div', {
                                    className: 'checkbox'
                                },
                                React.createElement(
                                    'label', {},
                                    React.createElement(
                                        'input', {
                                            name: 'grid-select',
                                            type: 'checkbox',
                                            className: 'select-box',
                                            checked: checked,
                                            value: value,
                                            onChange: this.props.onChange
                                        }
                                    ),
                                    React.createElement(
                                        'i', {
                                            className: 'input-helper'
                                        }
                                    )
                                )
                            )
                        )
                    }
                }
            });

            UI.register('UI.DataTable.CellCommandEdit', {
                'ReactClass': {
                    render: function() {
                        return React.createElement(
                                'button', {
                                    type: 'button',
                                    className: 'btn btn-icon command-edit waves-effect waves-circle',
                                    onClick: this.props.onClick.bind(null, this.props.id)
                                }, React.createElement(
                                    'span', {
                                        className: 'zmdi zmdi-edit'
                                    }
                                )
                            );
                    }
                }
            });

            UI.register('UI.DataTable.CellCommandDelete', {
                'ReactClass': {
                    render: function() {
                        return React.createElement(
                                'button', {
                                    type: 'button',
                                    className: 'btn btn-icon command-delete waves-effect waves-circle',
                                    onClick: this.props.onClick.bind(null, this.props.id)
                                }, React.createElement(
                                    'span', {
                                        className: 'zmdi zmdi-delete'
                                    }
                                )
                            );
                    }
                }
            });

            UI.register('UI.DataTable.CellCommandGroup', {
                'ReactClass': {
                    render: function() {
                        return React.createElement(
                                'button', {
                                    type: 'button',
                                    className: 'btn btn-icon command-group waves-effect waves-circle',
                                    onClick: this.props.onClick.bind(null, this.props.id)
                                }, React.createElement(
                                    'span', {
                                        className: 'zmdi zmdi-more-vert'
                                    }
                                )
                            );
                    }
                }
            });

            UI.register('UI.DataTable.CellCommands', {
                'ReactClass': {
                    getDefaultProps: function () {
                        return {
                            commands: []
                        }
                    },
                    render: function () {
                        var data = this.props.data;
                        var rowIndex = this.props.rowIndex;
                        var datakey = this.props.datakey;

                        var commands = [];
                        for (var i = 0; i < this.props.commands.length; i++) {
                            var c = this.props.commands[i];
                            commands.push(
                                React.createElement(
                                    UI.getReactClass(c.command_type), {
                                        key: 'command-'+i,
                                        id: data[rowIndex][datakey],
                                        onClick: c.onClick
                                    }
                                )
                            );
                        }
                        return React.createElement(
                            FixedDataTable.Cell, {
                                className: 'commands'
                            },
                            commands
                        );
                    }
                }
            });
        }
    }
});
