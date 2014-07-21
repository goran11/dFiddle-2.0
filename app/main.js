﻿requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'knockout': [
            '//cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-3.1.0.debug',
            '../lib/knockout/knockout-3.1.0.debug'
        ],
        'jquery': [
            '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
            '../lib/jquery/jquery-1.9.1.min'
        ]
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'services/BccTemplateEngine', 'services/knockoutBindingHandlers'], function( system, app, viewLocator, bccTemplateEngine, bindingHandlers ) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Durandal Samples';

    //specify which plugins to install and their configuration
    app.configurePlugins({
        router: true,
        dialog: true,
        widget: {
            kinds: ['expander', 'grid', 'treeview']
        }
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application.
        app.setRoot('shell');
    });
});