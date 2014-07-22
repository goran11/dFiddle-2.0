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
		
			self.Containers = ([
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
		/*
        self.gridConfig = {
            data: ko.observableArray(),
            pageSize: 10,
            showPageSizeOptions: false,
            pageSizeOptions: [5, 10, 15],
            alwaysShowPaging: true,
			multiSelect: true,
            columns: [
                { header: 'Code', property: 'Sifra', canSearch: true, canSort: true, sort: function(a, b) { return a.Sifra < b.Sifra ? -1 : 1; } },
                { header: 'Description', property: 'Opis', canSearch: true, canSort: true, sort: function (a, b) { return a.Opis < b.Opis ? -1 : 1; } },
                { header: 'Base', property: 'Baza', canSearch: true, canSort: true, sort: function (a, b) { return a.Baza < b.Baza ? -1 : 1; } },
				{ header: '', property: '__details', canSort: false },
				{ header: '', property: '__checked', canSort: false }
            ],
            rowClick: function(data) {
                //app.closeDialog(self, data);
            },
            identifierProperty: "Sifra",
            pageText: "Page",
            ofText: 'of',
            searchText: 'SearchWithPoints'
		};
		*/
		
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
				promise.resolve(data);
			 }, 3000);
			 
			 return promise;
		};
		
		
    };

    return new instanca();

});