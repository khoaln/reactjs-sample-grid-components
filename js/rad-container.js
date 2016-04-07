define(['jQuery'], 
    function(jQuery) {
        RAD = require(['rad']);

        return {
            handleError: function(error) {
                console.log(error);
            },
            makeAjax: function(url, data, method = 'GET') {    
                var ajaxRequest = jQuery.ajax({
                    url:       url,
                    data:      data,
                    dataType:  'json',
                    type:      method
                });

                // Default error handler
                ajaxRequest.error(function(err) {
                    this.handleError(err);
                }.bind(this));

                return ajaxRequest;
            },
            bootstrap: function() {
                
            }
        };
    }
);