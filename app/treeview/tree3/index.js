define(function (require) {

    var ko = require('knockout');
	var $ = require('jquery');
	

	function generateContainers(arr, num, depth, idObj) {
		if(depth == 0) return;
	
		idObj = idObj ? idObj : { id: 1 };//objekt koji èuva id counter kroz èitavu rekurziju
		for(var i = 0; i < num; i++) {
			var container = { id: idObj.id, name: 'Container ' + idObj.id, expanded: ko.observable(false) };
			arr.push(container);
			idObj.id++;//rekurziju radi u drugoj petlji, tako da su brojevi OK
		}
		for(var i = 0; i < num; i++) {
			var container = arr[i];
			container.Containers = [];
			generateContainers(container.Containers, num, depth - 1, idObj);
		}
	}
	
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
			console.log('treeview3 activate');
			/*
			require(['text!datagrid/grid/index.html'], function(text) {
				text = text.substring(0, text.indexOf('EndGrid') - 4);
				var htmlEncoded = htmlEncode(text);
				setTimeout(function() {
					$('.grid-example-html').html(htmlEncoded);
				}, 1000);
			});*/
        };

		
		var arr = [];
		generateContainers(arr, 2, 9);
		self.Containers(arr);
		
		
		self.selectedContainers = ko.observableArray([]);
		self.searchText = ko.observable('');
		self.search = function() {
			var arr = self.Containers();//
			self.traverse(arr);
		};
		
		self.collapseAll = function() {
			var arr = self.Containers();//
			self.collapseHierarchy(arr);
		};
		
		self.traverse = function(arr) {
			var retValue = false;
			for(var i = 0; i < arr.length; i++) {
				var cont = arr[i];
				if(self.traverse(cont.Containers)) {
					cont.expanded(true);
					retValue = true;
				}
				if(self.findInDirectChildren(cont)) {
					cont.expanded(true);
					retValue = true;
				}
			}
			return retValue;
		};
		
		self.findInDirectChildren = function(parentContainer) {
			var arr = parentContainer.Containers;
			var expandParent = false;
			for(var i = 0; i < arr.length; i++) {
				var cont = arr[i];
				if(cont.name.toLowerCase().indexOf(self.searchText().toLowerCase()) > -1) {
					expandParent = true;
				}
			}
			return expandParent;
		};
    
		self.collapseHierarchy = function(arr) {
			for(var i = 0; i < arr.length; i++) {
				var cont = arr[i];
				cont.expanded(false);
				self.collapseHierarchy(cont.Containers);
			}
		};
	
	};

    return new instanca();

});