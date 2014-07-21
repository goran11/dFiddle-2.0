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
		
		self.Containers = ko.observableArray([]);
		
        self.activate = function (activationData) {
		
			self.Containers = ([
				{ id: 1, name: 'Container 1', Containers: [
					{ id: 11, name: 'Container 11' },
					{ id: 12, name: 'Container 12' },
					{ id: 13, name: 'Container 13' }
				] },
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
		
		
		
    };

    return instanca;

});