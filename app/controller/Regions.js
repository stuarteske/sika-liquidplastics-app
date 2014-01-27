Ext.define('CfaSika.controller.Regions', {
    extend: 'Ext.app.Controller',

    requires: [
        'CfaSika.view.Categories',
        'CfaSika.view.regions.RegionsListDataView',
        'CfaSika.view.regions.RegionProjectListContainerView',
        'CfaSika.view.regions.RegionProjectListView'
    ],

    config: {
        refs: {
            mainView: 'main',
            homeNavDataView: 'xtypeCategoryView',
            regionProjectListContainer: 'xtypeRegionProjectListContainerView',
            regionNavDataView: 'xtypeRegionsListDataView',
            regionProjectListView: 'xtypeRegionProjectListView'
        },

        before: {},

        control: {
            regionNavDataView: {
                itemtap: 'onRegionNavItemTap'
            },
            regionProjectListView: {
                itemtap: 'onRegionProjectListItemTap'
            }
        },

        routes: {
            'regions': 'navigationRegionList',
            'region/:urlId': 'navigationRegionView'
        },

        listeners : {}
    },

    init: function() {
        console.log('Init: CfaSika.controller.Regions');
    },

    navigationRegionList: function() {
        console.log('Navigation: #Regions');

        // Get the regions data store
        var regionsDataStore = Ext.getStore('RegionData');

        // Are the databases ready?
        if (regionsDataStore.isReady()) {
            console.log('Region Data Store is ready.');

            // store has data?
            if (!regionsDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                regionsDataStore.getOfflineData();

            }

            var afterDataLoad = function () {
                Ext.Viewport.setMasked(false);

                // Load the main view
                this.getMainView().push({
                    xtype:'xtypeRegionsListDataView',
                    store: regionsDataStore
                });
            };

            if (!regionsDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
                else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 0, this);

            delayedAfterDataLoad();


        } else {
            var dbRetry = function () {
                console.log('Testing databases again');
                this.navigationRegionList();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 500, this);

            delayedDbRetry();

            console.log('Databases are not ready.');
        }
    },

    onRegionNavItemTap: function(thisObj, index, target, record, event) {
        window.location.hash = '#region/' + record.get('urlId');
    },

    navigationRegionView: function(urlId) {
        console.log('Navigation: #Region/' + urlId);

        // Get tbe data bases
        var regionsDataStore = Ext.getStore('RegionData');
        var projectsDataStore = Ext.getStore('ProjectData');
        var imageDataStore = Ext.getStore('ImageData');

        // Are the databases ready?
        if (regionsDataStore.isReady() && projectsDataStore.isReady() && imageDataStore.isReady()) {
            console.log('Data Stores are ready.');

            // store has data?
            if (!regionsDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                regionsDataStore.getOfflineData();

            }

            if (!projectsDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                projectsDataStore.getOfflineData();

            }

            var afterDataLoad = function () {
                Ext.Viewport.setMasked(false);

                // Load the main view
                this.getMainView().push({
                    xtype:'xtypeRegionProjectListContainerView',
                    projectStore: projectsDataStore.queryByRegion(urlId),
                    regionRecord: regionsDataStore.findRecord('urlId', urlId)
                });
            };

            if (!regionsDataStore.getCount() || !projectsDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
                else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 0, this);

            delayedAfterDataLoad();

        } else {
            var dbRetry = function () {
                console.log('Testing databases again');
                this.navigationRegionView();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 500, this);

            delayedDbRetry();

            console.log('Databases are not ready.');
        }
    },

    onRegionProjectListItemTap: function(thisObj, index, target, record, event) {
        var regionId = this.getRegionProjectListContainer().get('regionRecord').get('urlId');

        record.set('regionUrlId', regionId);

        window.location.hash = '#project/' + regionId + '/' + record.get('slug');
    }
});