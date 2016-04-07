define(['react'], function(React) {
    return {
        build: function(UI) {
            UI.register('UI.Core.Paginator.Button', {
                'ReactClass': {
                    getDefaultProps: function() {
                        return {
                            'data-page': 1,
                            className: '',
                            onClick: function(e) {},
                            text: ''
                        }
                    },
                    render: function() {
                        return React.createElement(
                            'li', {
                                className: this.props.className
                            }, 
                            React.createElement(
                                'a', {
                                    'data-page': this.props['data-page'],
                                    className: 'button',
                                    onClick: this.props.onClick
                                },
                                this.props.text
                            )
                        )
                    }
                }
            });

            UI.register('UI.Core.Paginator.PageLengthDropdown', {
                'ReactClass': {
                    getDefaultProps: function() {
                        return {
                            currentPageLength: 5,
                            pageLengthOptions: [5, 10, 25, 50, 'All'],
                            onClick: function(e) {}
                        }
                    },
                    render: function() {
                        var options = [];
                        for (var i = 0; i < this.props.pageLengthOptions.length; i++) {
                            var optionValue = this.props.pageLengthOptions[i];
                            options.push(React.createElement(
                                'li', {
                                    key: 'page-length-' + i,
                                    className: (this.props.currentPageLength == optionValue ? 'active' : '')
                                }, React.createElement(
                                    'a', {
                                        className: 'dropdown-item dropdown-item-button',
                                        'data-action': optionValue,
                                        onClick: this.props.onClick
                                    }, 
                                    optionValue
                                )
                            ));
                        }
                        return React.createElement(
                            'div', {
                                className: 'dropdown btn-group grid-pagelength'
                            }, 
                            React.createElement(
                                'button', {
                                    className: 'btn btn-default dropdown-toggle',
                                    type: 'button',
                                    'data-toggle': 'dropdown',
                                    'aria-expanded': 'false'
                                }, 
                                React.createElement(
                                    'span', {
                                        className: 'dropdown-text'
                                    },
                                    this.props.currentPageLength
                                )
                            ), 
                            React.createElement(
                                'ul', {
                                    className: 'dropdown-menu pull-right',
                                    role: 'menu'
                                },
                                options
                            )
                        )
                    }
                }
            });

            UI.register('UI.Core.Paginator', {
                'ReactClass': {
                    getDefaultProps: function() {
                        return {
                            currentPage: 1,
                            totalPages: 1,
                            totalMatched: 0,
                            pageLength: 5,
                            numberPageShow: 3,
                            startPageShow: 1,
                            pageLengthOptions: [5, 10, 20, 50, 'All'],
                            onPageChange: function(e, page) {},
                            onPageLengthChange: function(e, pageLength) {}
                        }
                    },
                    onPageButtonClick: function(e) {
                        var page = e.target.getAttribute('data-page');
                        switch(page) {
                            case 'first':
                                page = 1;
                                break;
                            case 'last':
                                page = this.props.totalPages;
                                break;
                            case 'prev':
                                page = Math.max(1, this.props.currentPage - 1);
                                break;
                            case 'next':
                                page = Math.min(this.props.totalPages, this.props.currentPage + 1);
                                break;
                            default:
                                page = parseInt(page);
                                break;
                        }
                        if (this.props.onPageChange != undefined) {
                            this.props.onPageChange(e, page);
                        }
                    },
                    render: function() {
                        var pages = []
                        pages.push(React.createElement(
                            UI.getReactClass('UI.Core.Paginator.Button'), {
                                key: 'page-li-first',
                                'data-page': 'first',
                                className: 'first',
                                onClick: this.onPageButtonClick,
                                text: React.createElement(
                                    'i', {
                                        className: 'zmdi zmdi-more-horiz',
                                        'data-page': 'first'
                                    }
                                )
                            }
                        ));
                        pages.push(React.createElement(
                            UI.getReactClass('UI.Core.Paginator.Button'), {
                                key: 'page-li-prev',
                                'data-page': 'prev',
                                className: 'prev',
                                onClick: this.onPageButtonClick,
                                text: React.createElement(
                                    'i', {
                                        className: 'zmdi zmdi-chevron-left',
                                        'data-page': 'prev'
                                    }
                                )
                            }
                        ));

                        var totalPages = Math.min(this.props.totalPages, 
                            this.props.startPageShow + this.props.numberPageShow - 1);
                        for (var i = this.props.startPageShow; i <= totalPages; i++) {
                            pages.push(React.createElement(
                                UI.getReactClass('UI.Core.Paginator.Button'), {
                                    key: 'page-li-' + i,
                                    'data-page': i,
                                    className: (i == this.props.currentPage ? 'active' : ''),
                                    onClick: this.onPageButtonClick,
                                    text: i
                                }
                            ));
                        }
                        pages.push(React.createElement(
                            UI.getReactClass('UI.Core.Paginator.Button'), {
                                key: 'page-li-next',
                                'data-page': 'next',
                                className: 'next',
                                onClick: this.onPageButtonClick,
                                text: React.createElement(
                                    'i', {
                                        className: 'zmdi zmdi-chevron-right',
                                        'data-page': 'next'
                                    }
                                )
                            }
                        ));
                        pages.push(React.createElement(
                            UI.getReactClass('UI.Core.Paginator.Button'), {
                                key: 'page-li-last',
                                'data-page': 'last',
                                className: 'last',
                                onClick: this.onPageButtonClick,
                                text: React.createElement(
                                    'i', {
                                        className: 'zmdi zmdi-more-horiz',
                                        'data-page': 'last'
                                    }
                                )
                            }
                        ));

                        var start = ((this.props.currentPage - 1)*this.props.pageLength + 1);
                        var end = this.props.totalMatched;
                        var infos;
                        
                        if (this.props.pageLength) {
                            end = Math.min(this.props.totalMatched, this.props.currentPage*this.props.pageLength);
                        }
                        
                        if (this.props.totalMatched > 0) {
                            infos = 'Showing ' + start + ' to ' + end + ' of ' + this.props.totalMatched + ' entries';
                        } else {
                            infos = 'Data is empty';
                        }

                        return React.createElement(
                            'div', {
                                className: 'row'
                            },
                            React.createElement(
                                'div', {
                                    className: 'col-sm-6'
                                },
                                React.createElement(
                                    'ul', {
                                        className: 'pagination'
                                    },
                                    pages
                                ),
                                React.createElement(
                                    UI.getReactClass('UI.Core.Paginator.PageLengthDropdown'), {
                                        currentPageLength: this.props.pageLength != 0 ? this.props.pageLength : 'All',
                                        pageLengthOptions: this.props.pageLengthOptions,
                                        onClick: function(e) {
                                            var pageLength = parseInt(e.target.getAttribute('data-action')) || 0;
                                            if (this.props.onPageLengthChange != undefined) {
                                                this.props.onPageLengthChange(e, pageLength);
                                            }
                                        }.bind(this)
                                    }
                                )
                            ),
                            React.createElement(
                                'div', {
                                    className: 'col-sm-6 infoBar'
                                }, 
                                React.createElement(
                                    'div', {
                                        className: 'infos'
                                    },
                                   infos
                                )
                            )
                        );
                    }
                }
            });

            UI.register('UI.Core.Button', {
                'ReactClass': {
                    getDefaultProps: function() {
                        return {
                            class: 'bgm-red btn-float waves-effect',
                            icon:  'zmdi-plus',
                            onClick: function(event) {} 
                        }
                    },
                    render: function() {            
                        var btn = React.createElement(
                            'button', 
                            {
                                className: "btn " + this.props.class,
                                onClick: this.props.onClick
                            },
                            React.createElement(
                                'i', 
                                {
                                    className: "zmdi " + this.props.icon                    
                                }
                            )
                        );

                        return btn;
                    }
                }
            });   
        }
    }
});