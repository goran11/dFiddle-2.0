define(['plugins/router', 'durandal/system', 'global', 'knockout'], function( router, system, global, ko ) {
    var childRouter = router.createChildRouter()
      .makeRelative({
          moduleId: 'treeview',
          route: 'treeview'
      }).map([
          {route: ['', 'tree'], moduleId: 'tree/index', title: 'Tree view', type: 'intro', nav: true},
		  {route: ['tree2', 'tree2'], moduleId: 'tree2/index', title: 'Tree view 2', type: 'intro', nav: true, hash: '#treeview/tree2'}
      ]).buildNavigationModel();
      
    // .on is mixed in an not meant to be  chainable 
    childRouter.on('router:navigation:complete').then(global.createSampleLink);

    return {
        global: global,
        router: childRouter,
        getItemsByCategoryId: function( categoryId ) {
            return ko.utils.arrayFilter(childRouter.navigationModel(), function( route ) {
                return route.type === categoryId;
            });
        },
        binding: function() {
            system.log('Lifecycle : binding : grid/index');
            return { cacheViews: true }; //cancels view caching for this module, allowing the triggering of the detached callback
        }
    };
});