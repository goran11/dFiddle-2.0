define(function(require) {

    var ko = require('knockout');
	var $ = require('jquery');
	
    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            //$(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function (element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();
            //ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
            $(element).toggle("fast");
        }
    };

    ko.bindingHandlers.placeholder = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var underlyingObservable = valueAccessor();
            ko.applyBindingsToNode(element, { attr: { placeholder: underlyingObservable } });
        }
    };

    //Binding koji se koristi za checkbox.
    //Property na koji se binda treba biti observable array.
    //Kao dodatni parametar u binding se postavlja entity.
    //
    //1. Smjer model-> kontrola
    //      Ako se entitet nalazi u arrayu checkbox æe biti true, inaèe false.
    //
    //2. Smjer kontrola model 
    //  Ako se checkbox oznaèi, entitet æe se staviti u array, 
    //  a ako se heckbox iskljuèi entitet se mièe iz array-a
    //
    ko.bindingHandlers.checkEntityInArray = {
        init: function (element, valueAccessor, allBindingsAccessor) {

            var arr = valueAccessor();
            var entity = allBindingsAccessor().entity;

            $(element).click(function (event) {
                event.stopPropagation();
                if (this.checked) {
                    if (arr.indexOf(entity) == -1) arr.push(entity);
                }
                else {
                    arr.remove(entity);
                }
            });


            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off();//Kod uništenja bindinga makni pretplatu na click
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var arr = ko.unwrap(valueAccessor());
            var entity = allBindingsAccessor().entity;
            var val = arr.indexOf(entity) > -1;
            
            element.checked = val;
            
        }
    };

});