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
					{ id: 11, name: 'Container 11', Containers: [
						{ id: 111, name: 'Container 111', Containers: [
							{ id: 1111, name: 'Container 1111' },
							{ id: 1112, name: 'Container 1112' },
							{ id: 1113, name: 'Container 1113' },
							{ id: 1114, name: 'Container 1114' }
						] },
						{ id: 112, name: 'Container 112', Containers: [
							{ id: 1121, name: 'Container 1121' },
							{ id: 1122, name: 'Container 1122' },
							{ id: 1123, name: 'Container 1123' },
							{ id: 1124, name: 'Container 1124' }
						] },
						{ id: 113, name: 'Container 113', Containers: [
							{ id: 1131, name: 'Container 1131' },
							{ id: 1132, name: 'Container 1132' },
							{ id: 1133, name: 'Container 1133' },
							{ id: 1134, name: 'Container 1134' }
						] }
						
					] },
					{ id: 12, name: 'Container 12', Containers: [
					
					
						{ id: 121, name: 'Container 121', Containers: [
							{ id: 1211, name: 'Container 1211' },
							{ id: 1212, name: 'Container 1212' },
							{ id: 1213, name: 'Container 1213' },
							{ id: 1214, name: 'Container 1214' }
						] },
						{ id: 122, name: 'Container 122', Containers: [
							{ id: 1221, name: 'Container 1221' },
							{ id: 1222, name: 'Container 1222' },
							{ id: 1223, name: 'Container 1223' },
							{ id: 1224, name: 'Container 1224' }
						] },
						{ id: 123, name: 'Container 123', Containers: [
							{ id: 1231, name: 'Container 1231' },
							{ id: 1232, name: 'Container 1232' },
							{ id: 1233, name: 'Container 1233' },
							{ id: 1234, name: 'Container 1234' }
						] }
					
					
					
					
					] },
					{ id: 13, name: 'Container 13', Containers: [
					
					
						{ id: 131, name: 'Container 131', Containers: [
							{ id: 1311, name: 'Container 1311' },
							{ id: 1312, name: 'Container 1312' },
							{ id: 1313, name: 'Container 1313' },
							{ id: 1314, name: 'Container 1314' }
						] },
						{ id: 132, name: 'Container 132', Containers: [
							{ id: 1321, name: 'Container 1321' },
							{ id: 1322, name: 'Container 1322' },
							{ id: 1323, name: 'Container 1323' },
							{ id: 1324, name: 'Container 1324' }
						] },
						{ id: 133, name: 'Container 133', Containers: [
							{ id: 1331, name: 'Container 1331' },
							{ id: 1332, name: 'Container 1332' },
							{ id: 1333, name: 'Container 1333' },
							{ id: 1334, name: 'Container 1334' }
						] }

					] }
				] },
				{ id: 2, name: 'Container 2', Containers: [
				
					{ id: 21, name: 'Container 21', Containers: [
						{ id: 211, name: 'Container 211', Containers: [
							{ id: 2111, name: 'Container 2111' },
							{ id: 2112, name: 'Container 2112' },
							{ id: 2113, name: 'Container 2113' },
							{ id: 2114, name: 'Container 2114' }
						] },
						{ id: 212, name: 'Container 212', Containers: [
							{ id: 2121, name: 'Container 2121' },
							{ id: 2122, name: 'Container 2122' },
							{ id: 2123, name: 'Container 2123' },
							{ id: 2124, name: 'Container 2124' }
						] },
						{ id: 213, name: 'Container 213', Containers: [
							{ id: 2131, name: 'Container 2131' },
							{ id: 2132, name: 'Container 2132' },
							{ id: 2133, name: 'Container 2133' },
							{ id: 2134, name: 'Container 2134' }
						] }
						
					] },
					{ id: 22, name: 'Container 22', Containers: [
					
					
						{ id: 221, name: 'Container 221', Containers: [
							{ id: 2211, name: 'Container 2211' },
							{ id: 2212, name: 'Container 2212' },
							{ id: 2213, name: 'Container 2213' },
							{ id: 2214, name: 'Container 2214' }
						] },
						{ id: 222, name: 'Container 222', Containers: [
							{ id: 2221, name: 'Container 2221' },
							{ id: 2222, name: 'Container 2222' },
							{ id: 2223, name: 'Container 2223' },
							{ id: 2224, name: 'Container 2224' }
						] },
						{ id: 223, name: 'Container 223', Containers: [
							{ id: 2231, name: 'Container 2231' },
							{ id: 2232, name: 'Container 2232' },
							{ id: 2233, name: 'Container 2233' },
							{ id: 2234, name: 'Container 2234' }
						] }
					
					
					
					
					] },
					{ id: 23, name: 'Container 23', Containers: [
					
					
						{ id: 231, name: 'Container 231', Containers: [
							{ id: 2311, name: 'Container 2311' },
							{ id: 2312, name: 'Container 2312' },
							{ id: 2313, name: 'Container 2313' },
							{ id: 2314, name: 'Container 2314' }
						] },
						{ id: 232, name: 'Container 232', Containers: [
							{ id: 2321, name: 'Container 2321' },
							{ id: 2322, name: 'Container 2322' },
							{ id: 2323, name: 'Container 2323' },
							{ id: 2324, name: 'Container 2324' }
						] },
						{ id: 233, name: 'Container 233', Containers: [
							{ id: 2331, name: 'Container 2331' },
							{ id: 2332, name: 'Container 2332' },
							{ id: 2333, name: 'Container 2333' },
							{ id: 2334, name: 'Container 2334' }
						] }

					] }
				
				] }
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