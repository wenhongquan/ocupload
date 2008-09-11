/*
 * One Click Upload - jQuery Plugin
 * Copyright (c) 2008 Michael Mitchell - http://www.michaelmitchell.co.nz
 */
(function($){
	$.fn.ocupload = function(options) {
		return new $.ocupload(this, options);
	},
	
	$.ocupload = function(element, options) {
		/** Fix scope problems */
		var self = this;
                
        /** A unique id so we can find our elements later */
        var id = new Date().getTime().toString().substr(8);
   
        /** Merge the users options with our defaults */
        var options = $.extend({
            name: 'file',
            enctype: 'multipart/form-data',
            action: '',
            autosubmit: true,
            params: {},
            hover: {},
            onSubmit: function() {},
            onComplete: function() {},
            onSelect: function() {}
        }, options);
        
		/** Upload Iframe */
		var iframe = $(
			'<iframe '+
				'id="iframe'+id+'" '+
				'name="iframe'+id+'" '+
                'src="/"'+
			'></iframe>'
		).css({
			display: 'none'
		});
		
		/** Form */
		var form = $(
			'<form '+
				'method="post" '+
				'enctype="'+options.enctype+'" '+
				'action="'+options.action+'" '+
				'target="iframe'+id+'"'+
			'></form>'
		).css({
			margin: 0,
			padding: 0
		});
		
		/** File Input */
		var input = $(
			'<input '+
				'name="'+options.name+'" '+
				'type="file" '+
			'/>'
		).css({
			position: 'relative',
			display: 'block',
			marginLeft: -175+'px',
			opacity: 0
		});
		
		/** Put everything together */
		element.wrap('<div></div>'); //container
		    form.append(input);
			element.after(form);
			element.after(iframe);
    
		/** Find the container and make it nice and snug */
		var container = element.parent().css({
			position: 'relative',
			height: element.outerHeight()+'px',
			width: element.outerWidth()+'px',
			overflow: 'hidden',
			cursor: 'pointer',
			margin: 0,
			padding: 0
		});
        
		/** Put our file input in the right place */
		input.css('marginTop', -container.height()-10+'px');

		/** Move the input with the mouse to make sure it get clicked! */
		container.mousemove(function(e){
			input.css({
				top: e.pageY-container.offset().top+'px',
				left: e.pageX-container.offset().left+'px'
			});
		});
        
		/** Methods */
		$.extend(this, {
            /** options */
			_autosubmit: options.autosubmit,
            _params: options.params,
            _hover: options.hover,
            _hover_default: {},  

            /** callbacks */
            onComplete: options.onComplete,
            onSubmit: options.onSubmit,
            onSelect: options.onSelect,
            
            /** set/get methods */
			getFilename: function() {
				return input.attr('value');
			},
            
            setName: function(name) {
                input.attr('name', name);
            },
            
            getName: function(name) {
                return input.attr('name');
            },
            
            setAction: function(action) {
                form.attr('action', action);
            },
            
            getAction: function(action) {
               return form.attr('action');
            },
            
            setEnctype: function(enctype) {
                form.attr('enctype', enctype);
            },
            
            getEnctype: function(enctype) {
               return form.attr('enctype');
            },

			setParams: function(params) {
				this._params = $.extend(this.params, params);
			},
            
            getParams: function() {
                return this._params;
            },
            
            setAutosubmit: function(submit) {
                this._autosubmit = submit;
            },
            
            getAutosubmit: function() {
                return this._autosubmit;
            },
            
            setHover: function(hover) {
                this._hover = $.extend(this._hover, hover);
                
                $.each(this._hover, function(key, value) {
                    self._hover_default[key] = element.css(key);
                });
            },
            
            getHover: function() {
                return this._hover;  
            },

			set: function(obj, value) {
				var value =	value ? value : false;
								
				function option(action, value) {
					switch(action) {
						default:
							throw new Error('[jQuery.ocupload.set] \''+action+'\' is an invalid option.');
							break;
						case 'name':
							self.setName(value);
							break;
						case 'action':
							self.setAction(value);
							break;
						case 'enctype':
							self.setEnctype(value);
							break;
						case 'params':
							self.setParams(value);
							break;
                        case 'hover':
                            self.setHover(value);
                            break;
						case 'autosubmit':
							self.setAutosubmit(value);
							break;
						case 'onSubmit':
							self.onSubmit = value;
							break;
						case 'onComplete':
							self.onComplete = value;
							break;
						case 'onSelect':
							self.onSelect = value;
							break;
					}
				}				
				
				if(value) {
					option(obj, value);
				}
				else {				
					$.each(obj, function(key, value) {
						option(key, value);
					});
				}
			},

            get: function(action) {
                switch(action) {
                    default:
                        throw new Error('[jQuery.ocupload.set] \''+action+'\' is an invalid option.');
                        break;
                    case 'name':
                        return self.getName();
                        break;
                    case 'action':
                        return self.getAction();
                        break;
                    case 'enctype':
                        return self.getEnctype();
                        break;
                    case 'params':
                        return self.getParams();
                        break;
                    case 'hover':
                        return self.getHover();
                        break;
                    case 'autosubmit':
                        return self.getAutosubmit();
                        break;
                    case 'onSubmit':
                        return self.onSubmit;
                        break;
                    case 'onComplete':
                        return self.onComplete;
                        break;
                    case 'onSelect':
                        return self.onSelect;
                        break;
                }
            },
            
			/** Submit the form */
			submit: function() {
				/** Do something before we upload */
				this.onSubmit();
				
				/** add additional paramters before sending */
				$.each(self._params, function(key, value) {
					form.append($(
						'<input '+
							'type="hidden" '+
							'name="'+key+'" '+
							'value="'+value+'" '+
						'/>'
					));
				});
				
				/** Submit the actual form */
				form.submit(); 
				
				/** Do something after we are finished uploading */
				iframe.unbind().load(function() {
					/** Get a response from the server in plain text */
					var myFrame = document.getElementById(iframe.attr('name'));
					var response = $(myFrame.contentWindow.document.body).text();
					
					/** Do something on complete */
					self.onComplete(response); //done :D
				});
			}
		});
        
        $.each(this._hover, function(key, value) {
            self._hover_default[key] = element.css(key);
        });
        
        //Emulate hover effects
        container.hover(
            function() {
                $.each(self._hover, function(key, value) {
                    element.css(key, value);
                });
                
                container.css({
                    height: element.outerHeight()+'px',
                    width: element.outerWidth()+'px'
                });
            },
            function() {
                $.each(self._hover, function(key, value) {
                    element.css(key, self._hover_default[key]);
                });
                
                container.css({
                    height: element.outerHeight()+'px',
                    width: element.outerWidth()+'px'
                });
            }
        );
        
        /** Watch for file selection */
        input.change(function() {
            /** Do something when a file is selected. */
            self.onSelect(); 
            
            /** Submit the form automaticly after selecting the file */
            if(self._autosubmit) {
                self.submit();
            }
        });
	}
})(jQuery);