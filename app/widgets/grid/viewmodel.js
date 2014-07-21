/*
 * Durandal Grid 2.0.0 by Timothy Moran
 * Available via the MIT license.
 * see: https://github.com/tyrsius/durandal-grid for details.
 */
define(['durandal/app', 'knockout', 'jquery'], function (app, ko, $) {


    //====================== Support Code and Polyfills =====================//

    var toNumber = function (input) { return parseFloat(input); };

    var range = function (bottom, top) {
        var result = [bottom],
			lastIndex = 0;

        while (result[lastIndex] < top) {
            result.push(result[lastIndex++] + 1);
        }
        return result;
    };

    var getColumnsFromData = function (inputData) {
        var data = ko.unwrap(inputData) || [];

        if (data.length === 0)
            return [];

        var keys = [];
        for (var prop in data[0]) {
            if (data[0].hasOwnProperty(prop))
                keys.push({ header: prop, property: prop });
        }
        return keys;
    };

    var fixupColumns = function (columns) {
        if (!(columns instanceof Array))
            throw new Error("Grid columns must be an array");
        return columns.map(function (column) {
            if (typeof column == 'string' || column instanceof String)
                return { property: column, header: column };
            else if (column.property === undefined)
                throw new Error("Columns must contain a property named 'property' so that they can look up their value");
            else
                return column;
        });
    };

    //=======================================================================//		

    var noop = function () { };

    //
    //DefaultValues
    //
    var defaults = {
        pageSize: 10,
        pageSizeOptions: [25, 50, 75, 100],
        alwaysShowPaging: false,
        showPageSizeOptions: false,
        selectedRows: [],
        selectRowOnClick: true,
        multiSelect: false,
        identifierProperty: '',
        pageText: 'Page',
        ofText: "of",
        searchText: "Search..."
    };

    var Grid = function (config) {
        var self = this;

		var userHeaderTemplatesElement = null;//Element sa template-ima za headere
		var userHeaderTemplatesCache = {};
		var userHeaderTemplatesStylesCache = {};
		var userHeaderTemplatesClassesCache = {};
		
		
        var userCellTemplatesElement = null;//Element sa template-ima za æelije
        var userCellTemplatesCache = {};
		var userCellTemplatesStylesCache = {};
		var userCellTemplatesClassesCache = {};
		
		

		
        self.allRows = ko.isObservable(config.data) ? config.data : ko.observableArray(config.data || []);

        self.columns = ko.computed(function () {
            var unwrappedColumns = ko.unwrap(config.columns),
				unwrappedRows = ko.unwrap(self.allRows);
            return (unwrappedColumns !== undefined ? fixupColumns(unwrappedColumns) : getColumnsFromData(unwrappedRows));
        });

        self.getColumnText = function (column, row) {
            if (!column.property)
                return '';
            else if (typeof (column.property) === 'function' && !ko.isObservable(column.property))
                return column.property(row);
            else
                return ko.unwrap(row[ko.unwrap(column.property)]);

        };

        
        self.selectRowOnClick = config.selectRowOnClick !== undefined ? config.selectRowOnClick : defaults.selectRowOnClick;
        self.identifierProperty = config.identifierProperty !== undefined ? config.identifierProperty : defaults.identifierProperty;
        self.multiSelect = config.multiSelect !== undefined ? config.multiSelect : defaults.multiSelect;


        self.selectedRows = ko.isObservable(config.selectedRows)
			? config.selectedRows
			: ko.observableArray(config.selectedRows !== undefined ? config.selectedRows : defaults.selectedRows);
        
		self.selectedRows.subscribe(function(changes) {
			if(!self.multiSelect && self.selectedRows().length > 1) {
				for(var i = 0; i < changes.length; i++) {
					var change = changes[i];
					if(change.status == "added") {
						setTimeout(function() {
							self.selectedRows([change.value]);
						}, 1);
						break;
					}
				}
			}
		}, null, 'arrayChange');
		
		self.selectAllRows = function(val) {
			setTimeout(function() {
				if(val) {
					self.selectedRows(self.allRows().slice(0));
				}
				else {
					self.selectedRows([]);
				}
			}, 1);
		};
		
        self.pageText = ko.isObservable(config.pageText)
			? config.pageText
			: ko.observable(config.pageText !== undefined ? config.pageText : defaults.pageText);
        self.ofText = ko.isObservable(config.ofText)
			? config.ofText
			: ko.observable(config.ofText !== undefined ? config.ofText : defaults.ofText);
        self.searchText = ko.isObservable(config.searchText)
			? config.searchText
			: ko.observable(config.searchText !== undefined ? config.searchText : defaults.searchText);
        //
        // action handlers
        //
        self.rowClick = function (data) {

            if (self.selectRowOnClick) {//Ako je postavljena opcija da na klik na redak automatski odaberemo redak
                if (self.selectedRows.indexOf(data) < 0) {
                    if (!self.multiSelect) {
                        self.selectedRows.removeAll();
                    }
                    self.selectedRows.push(data);
                } else {
                    self.selectedRows.remove(data);
                }
            }

            if ($.isFunction(config.rowClick)) {
                config.rowClick(data, self.selectedRows());
            }
        };

        self.rowSelected = function (data) {
            return ko.computed(function () {
                if (self.identifierProperty) {
                    var arr = ko.utils.arrayFilter(self.selectedRows(), function (row) {
                        if (row[self.identifierProperty] == data[self.identifierProperty]) {
                            return true;
                        }
                    });

                    if (arr.length > 0) {
                        return true;
                    }
                    return false;
                } else {
                    if (self.selectedRows.indexOf(data) < 0) {
                        return false;
                    }
                    return true;
                }
            });
        };

        //
        // searching
        //
        self.query = ko.observable("");

        self.searchColumns = ko.computed(function () {
            var columnsToSearch = self.columns();
            return ko.utils.arrayFilter(columnsToSearch, function (column) {
                return ko.unwrap(column.canSearch) === true;
            });
        });

        self.showSearchBox = ko.computed(function () {
            return self.searchColumns().length > 0;
        });

        self.filteredRows = ko.computed(function () {
            var rows = self.allRows(),
				search = self.query().toLowerCase();

            if (self.searchColumns().length == 0)
                return rows;

            return ko.utils.arrayFilter(rows, function (row) {
                for (var i = 0; i < self.searchColumns().length; i++) {
                    if (row[self.searchColumns()[i].property].toLowerCase().indexOf(search) >= 0) {
                        return true;
                    }
                }
                return false;
            });
        }).extend({ throttle: 50 }); //We don't want typing to cause too many changes 


        //sorting
        //
        var customSort;
        self.sortDesc = ko.observable(true);
        self.sortColumn = ko.observable({});
        self.setSortColumn = function (column) {
            if (column.canSort === false)
                return;
            //If column.sort is undefined, it will clear the customSort, which is what we want in that case
            customSort = column.sort;

            //Switch if column is same, otherwise set to true
            self.sortDesc(column == self.sortColumn() ? !self.sortDesc() : true);
            self.sortColumn(column);
        };

        var standardSort = function (a, b, sortProperty) {
            var propA = ko.unwrap(a[sortProperty]),
				propB = ko.unwrap(b[sortProperty]);
            if (propA == propB)
                return 0;
            return propA < propB ? -1 : 1;
        };

        self.sortedRows = ko.computed(function () {
            var sorted = self.filteredRows().slice(), //We don't want to be sorting the original list
				sortDirection = self.sortDesc() ? 1 : -1,
				sortProperty = self.sortColumn().property || '';

            if (sortProperty === '')
                return sorted;

            var sort;
            if (customSort)
                sort = function (a, b) { return customSort(a, b) * sortDirection; };
            else
                sort = function (a, b) { return standardSort(a, b, sortProperty) * sortDirection; };

            return sorted.sort(sort);
        }).extend({ throttle: 10 }); //Throttle so that sortColumn and direction don't cause double update, it flickers


        ///
        //pagination
        ///

        self.pageIndex = ko.observable(0);

        self.pageSize = ko.isObservable(config.pageSize)
			? config.pageSize
			: ko.observable(config.pageSize !== undefined ? config.pageSize : defaults.pageSize);

        self.alwaysShowPaging = ko.isObservable(config.alwaysShowPaging)
			? config.alwaysShowPaging
			: ko.observable(config.alwaysShowPaging !== undefined ? config.alwaysShowPaging : defaults.alwaysShowPaging);

        self.pageSizeOptions = ko.isObservable(config.pageSizeOptions)
			? config.pageSizeOptions
			: ko.observable(config.pageSizeOptions !== undefined ? config.pageSizeOptions : defaults.pageSizeOptions);

        self.showPageSizeOptions = ko.isObservable(config.showPageSizeOptions)
			? config.showPageSizeOptions
			: ko.observable(config.showPageSizeOptions !== undefined ? config.showPageSizeOptions : defaults.showPageSizeOptions);

        self.pageCount = ko.computed(function () {
            return Math.ceil(self.sortedRows().length / self.pageSize());
        });

        self.showPaging = ko.computed(function () {
            var alwaysShow = self.alwaysShowPaging(),
				pageCount = self.pageCount();
            return alwaysShow || pageCount > 1;
        });

        self.lastPageIndex = ko.computed(function () {
            return Math.max(Math.ceil(self.sortedRows().length / self.pageSize()) - 1, 0);
        });
        self.currentPageNumber = ko.computed(function () {
            return self.pageIndex() + 1;
        });
        self.pageToFirst = function () {
            self.pageIndex(0);
        };
        self.pageToLast = function () {
            self.pageIndex(self.lastPageIndex());
        };
        self.canPageForward = ko.computed(function () {
            return self.pageIndex() < self.lastPageIndex();
        });
        self.pageForward = function () {
            if (self.canPageForward())
                self.pageIndex(self.pageIndex() + 1);
        };
        self.canPageBackward = ko.computed(function () {
            return self.pageIndex() > 0;
        });

        self.pageBackward = function () {
            if (self.canPageBackward())
                self.pageIndex(self.pageIndex() - 1);
        };

        //We call this rows because it's actually what the grid binds against
        //And we want the most obvious name for that binding
        self.rows = ko.computed({
            read: function () {
                var pageStartIndex = self.pageIndex() * self.pageSize(),
					sortedRows = self.sortedRows();
                if (self.pageIndex() == self.lastPageIndex())
                    return sortedRows.slice(pageStartIndex);
                else
                    return sortedRows.slice(pageStartIndex, pageStartIndex + self.pageSize());
            },
            deferEvaluation: true
        });

        //This is a safety check. if the page size puts the current pageIndex out of bounds, go to the last page
        //This can hapen when the page size grows
        self.lastPageIndex.subscribe(function (newValue) {
            if (self.pageIndex() > self.lastPageIndex())
                self.pageIndex(self.lastPageIndex());
        });

        self.goToPage = function (page) {
            self.pageIndex(parseInt(page, 10) - 1);
        };

        self.stealClasses = config.stealClasses === undefined || config.stealClasses;
        self.gridClasses = ko.observable('');


        self.binding = function (child, parent, settings) {
			userHeaderTemplatesElement = $(child).find('[data-part="header-templates"]')[0];
            userCellTemplatesElement = $(child).find('[data-part="cell-templates"]')[0];
        };

		self.getUserHeaderTemplate = function (column) {
			var prop = column.property;

			//1. Pogledaj u cached objektu, da ne tražimo po elementima bezveze svaki put (100 redaka = 100 traženja )
            var tmpl = userHeaderTemplatesCache[prop];
            if (tmpl == 'no template') {
                return null;
            }
            else if (tmpl) {
                return tmpl;
            }

            //2. Traži i dohvati template sa JQuery-jem i cachiraj ga
            var $tmpElement = $(userHeaderTemplatesElement).find('[data-col="' + prop + '"]');
            if ($tmpElement.length > 0) {
				var html = $tmpElement.html();
				if(html) {
					userHeaderTemplatesCache[prop] = $tmpElement.html();
					return html;
				}
				else {
					userHeaderTemplatesCache[prop] = 'no template';
					return null;
				}
            }
            else {
                userHeaderTemplatesCache[prop] = 'no template';
                return null;
            }
		};
		
		self.getUserHeaderTemplateStyle = function(column) {
			var prop = column.property;
			var style = userHeaderTemplatesStylesCache[prop];
            //1. Pogledaj u cached objektu, da ne tražimo bezveze svaki put
            if (style == 'no style') {
                return '';
            }
            else if (style) {
                return style;
            }
			
			 //2. Dohvati template sa JQuery-jem i cachiraj ga
            var $tmpElement = $(userHeaderTemplatesElement).find('[data-col="' + prop + '"]');
            if ($tmpElement.length > 0) {
                userHeaderTemplatesStylesCache[prop] = $tmpElement.attr('style');
                return userHeaderTemplatesStylesCache[prop];
            }
            else {
                userHeaderTemplatesStylesCache[prop] = 'no style';
                return '';
            }
		};
		
		self.getUserHeaderTemplateClass = function(column) {
			var prop = column.property;
			var cls = userHeaderTemplatesClassesCache[prop];
            //1. Pogledaj u cached objektu, da ne tražimo bezveze svaki put
            if (cls == 'no class') {
                return '';
            }
            else if (cls) {
                return cls;
            }
			
			 //2. Dohvati template sa JQuery-jem i cachiraj ga
            var $tmpElement = $(userHeaderTemplatesElement).find('[data-col="' + prop + '"]');
            if ($tmpElement.length > 0) {
                userHeaderTemplatesClassesCache[prop] = $tmpElement.attr('class');
                return userHeaderTemplatesClassesCache[prop];
            }
            else {
                userHeaderTemplatesClassesCache[prop] = 'no class';
                return '';
            }
		};
		
        self.getUserCellTemplate = function (column) {

            var prop = column.property;

			//1. Pogledaj u cached objektu, da ne tražimo po elementima bezveze svaki put (100 redaka = 100 traženja )
            var tmpl = userCellTemplatesCache[prop];
            if (tmpl == 'no template') {
                return null;
            }
            else if (tmpl) {
                return tmpl;
            }

            //2. Traži i dohvati template sa JQuery-jem i cachiraj ga
            var $tmpElement = $(userCellTemplatesElement).find('[data-col="' + prop + '"]');
            if ($tmpElement.length > 0) {
				var html = $tmpElement.html();
				if(html) {
					userCellTemplatesCache[prop] = $tmpElement.html();
					return html;
				}
				else {
					userCellTemplatesCache[prop] = 'no template';
					return null;
				}
            }
            else {
                userCellTemplatesCache[prop] = 'no template';
                return null;
            }
        };

		self.getUserCellTemplateStyle = function(column) {
			var prop = column.property;
			var style = userCellTemplatesStylesCache[prop];
            //1. Pogledaj u cached objektu, da ne tražimo bezveze svaki put
            if (style == 'no style') {
                return '';
            }
            else if (style) {
                return style;
            }
			
			 //2. Dohvati template sa JQuery-jem i cachiraj ga
            var $tmpElement = $(userCellTemplatesElement).find('[data-col="' + prop + '"]');
            if ($tmpElement.length > 0) {
                userCellTemplatesStylesCache[prop] = $tmpElement.attr('style');
                return userCellTemplatesStylesCache[prop];
            }
            else {
                userCellTemplatesStylesCache[prop] = 'no style';
                return '';
            }
		};
		
		self.getUserCellTemplateClass = function(column) {
			var prop = column.property;
			var cls = userCellTemplatesClassesCache[prop];
            //1. Pogledaj u cached objektu, da ne tražimo bezveze svaki put
            if (cls == 'no class') {
                return '';
            }
            else if (cls) {
                return cls;
            }
			
			 //2. Dohvati template sa JQuery-jem i cachiraj ga
            var $tmpElement = $(userCellTemplatesElement).find('[data-col="' + prop + '"]');
            if ($tmpElement.length > 0) {
                userCellTemplatesClassesCache[prop] = $tmpElement.attr('class');
                return userCellTemplatesClassesCache[prop];
            }
            else {
                userCellTemplatesClassesCache[prop] = 'no class';
                return '';
            }
		}

		
        self.getModel = function () {
            if (!userCellTemplatesElement) return null;
            var ctx = ko.contextFor(userCellTemplatesElement);//Kontekst od grida (glavni VM je ova klasa)
            return ctx.$parent;//Vrati prvog parenta
        };

        self.compositionComplete = function (view, parent) {
            var classes = parent.className;
            if (classes && classes.length > 0 && self.stealClasses) {
                self.gridClasses(classes);
                if (self.stealClasses !== 'copy')
                    parent.className = '';
            }
        };

    };

    return function GridWidget() {
        var self = this;

        self.activate = function (config) {
            //I do this because of the funky things that happen when constructing the grid
            //before you have the observable's you are actually using
            //$.extend(self, new Grid(config));
			Grid.call(self, config);
        };
    };
});