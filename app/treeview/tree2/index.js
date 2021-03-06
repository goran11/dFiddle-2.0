define(function (require) {

    var ko = require('knockout');
	var $ = require('jquery');
	
	
	function htmlEncode(html) {
		return String(html)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}
	
    var instanca = function () {
        var self = this;
		self.cacheViews = true;
		
		self.Containers = ko.observableArray([]);
		
        self.activate = function (activationData) {
		
			self.Containers([
				{ id: 1, name: 'Container 1' },
				{ id: 2, name: 'Container 2' }
			]);
			

			/*
			require(['text!datagrid/grid/index.html'], function(text) {
				text = text.substring(0, text.indexOf('EndGrid') - 4);
				var htmlEncoded = htmlEncode(text);
				setTimeout(function() {
					$('.grid-example-html').html(htmlEncoded);
				}, 1000);
			});*/
        };

		self.loadChildContainers = function(container, node) {
			//Simulacija Ajax promise-a
			 var promise = $.Deferred();
			 
			 setTimeout(function() {
			 
				var data = null;
				
				if(container.id == 1) {
					var data = [
						{ id: 11, name: 'Container 11' },
						{ id: 12, name: 'Container 12' }
					];
				}
				else if(container.id == 2) {
					var data = [
						{ id: 21, name: 'Container 1' },
						{ id: 22, name: 'Container 22' }
					];
				}
				else if(container.id == 11) {
					var data = [
						{ id: 111, name: 'Container 111' },
						{ id: 112, name: 'Container 112' }
					];
				}
				else if(container.id == 12) {
					var data = [
						{ id: 121, name: 'Container 121' },
						{ id: 122, name: 'Container 122' }
					];
				}
				else if(container.id == 21) {
					var data = [
						{ id: 211, name: 'Container 211' },
						{ id: 212, name: 'Container 212' }
					];
				}
				else if(container.id == 22) {
					var data = [
						{ id: 221, name: 'Container 221' },
						{ id: 222, name: 'Container 222' }
					];
				}
				promise.resolve(data);
			 }, 3000);
			 
			 return promise;
		};
		
		
    };

    return new instanca();

});