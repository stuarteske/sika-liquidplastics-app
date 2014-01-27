Ext.define('CfaSika.controller.Projects', {
    extend: 'Ext.app.Controller',

    mixins: ['Ext.mixin.Observable'],

    requires: [
        'CfaSika.view.Categories',
        'CfaSika.view.regions.RegionsListDataView',
        'CfaSika.view.regions.RegionProjectListContainerView',
        'CfaSika.view.regions.RegionProjectListView',
        'CfaSika.view.projects.ProjectContainerView'
    ],

    config: {
        refs: {
            mainView: 'main',
            homeNavDataView: 'xtypeCategoryView',
            projectContainerView: 'xtypeProjectContainerView',
            projectNavigationBackBtn: 'xtypeProjectContainerBackContainerView'
        },

        before: {},

        control: {
            projectContainerView: {
                swipeRight: 'onSwipeRight'
            },
            projectNavigationBackBtn: {
                tap: 'onProjectNavigationBackBtnTap'
            }
        },

        routes: {
            'project/:regionUrl/:projectUrl': 'navigationProjectView'
        },

        listeners : {}
    },

    init: function() {
        console.log('Init: CfaSika.controller.Projects');
    },

    navigationProjectView: function( regionUrl, projectUrl ) {
        console.log('Navigation: ' + window.location.hash);

        // Get the regions data store
        var projectDataStore = Ext.getStore('ProjectData');
        var imageDataStore = Ext.getStore('ImageData');

        // Are the databases ready?
        if (projectDataStore.isReady() && imageDataStore.isReady()) {
            console.log('Project Data Store is ready.');

            // store has data?
            if (!projectDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                projectDataStore.getOfflineData();

            }

            var afterDataLoad = function () {
                Ext.Viewport.remove(this.projectContainerView, true);

                Ext.Viewport.setMasked(false);

                this.projectContainerView = Ext.create('CfaSika.view.projects.ProjectContainerView', {
                    projectRecord: projectDataStore.findRecord('slug', projectUrl),
                    regionUrl: regionUrl
                });

                Ext.Viewport.add([this.projectContainerView]);

                Ext.Viewport.animateActiveItem(this.projectContainerView, { type: 'slide', direction: 'left' });
            };

            if (!projectDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
                else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 0, this);

            delayedAfterDataLoad();


        } else {
            var dbRetry = function () {
                console.log('Testing databases again');
                this.navigationRegionList();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 250, this);

            delayedDbRetry();

            console.log('Databases are not ready.');
        }
    },

    onProjectNavigationBackBtnTap: function() {
        this.animateBack();
    },

    onSwipeRight: function() {
        this.animateBack();
    },

    animateBack: function() {
        window.location.hash = '#back';

        Ext.Viewport.animateActiveItem(this.getMainView(), { type: 'slide', direction: 'right' });
    }
});