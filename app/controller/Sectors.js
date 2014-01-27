Ext.define('CfaSika.controller.Sectors', {
    extend: 'Ext.app.Controller',

    requires: [
        'CfaSika.view.Categories',
        'CfaSika.view.sectors.SectorListDataView',
        'CfaSika.view.sectors.SectorProjectListContainerView',
        'CfaSika.view.sectors.SectorProjectListView'
    ],

    config: {
        refs: {
            mainView: 'main',
            homeNavDataView: 'xtypeCategoryView',
            sectorNavDataView: 'xtypeSectorListDataView',
            sectorProjectListContainer: 'xtypeSectorProjectListContainerView',
            sectorProjectListView: 'xtypeSectorProjectListView'
        },

        before: {},

        control: {
            sectorNavDataView: {
                itemtap: 'onSectorNavItemTap'
            },
            sectorProjectListView: {
                itemtap: 'onSectorProjectListItemTap'
            }
        },

        routes: {
            'sectors': 'navigationSectorList',
            'sector/:urlId': 'navigationSectorView'
        },

        listeners : {}
    },

    init: function() {
        console.log('Init: CfaSika.controller.Sectors');
    },

    navigationSectorList: function() {
        console.log('Navigation: #Sectors');

        // Get the regions data store
        var sectorsDataStore = Ext.getStore('SectorData');

        // Are the databases ready?
        if (sectorsDataStore.isReady()) {
            console.log('Region Data Store is ready.');

            // store has data?
            if (!sectorsDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                sectorsDataStore.getOfflineData();

            }

            var afterDataLoad = function () {
                Ext.Viewport.setMasked(false);

                // Load the main view
                this.getMainView().push({
                    xtype:'xtypeSectorListDataView',
                    store: sectorsDataStore
                });
            };

            if (!sectorsDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
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

    onSectorNavItemTap: function(thisObj, index, target, record, event) {
        console.log('Sector nav');
        window.location.hash = '#sector/' + record.get('urlId');
    },

    navigationSectorView: function(urlId) {
        console.log('Navigation: #Sector/' + urlId);

        // Get tbe data bases
        var sectorDataStore = Ext.getStore('SectorData');
        var projectsDataStore = Ext.getStore('ProjectData');
        var imageDataStore = Ext.getStore('ImageData');

        // Are the databases ready?
        if (sectorDataStore.isReady() && projectsDataStore.isReady() && imageDataStore.isReady()) {
            console.log('Data Stores are ready.');

            // store has data?
            if (!sectorDataStore.getCount()) {
                // Empty so load the offline data

                // Show loading visual
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading Data'
                });

                // Load the offline data
                sectorDataStore.getOfflineData();

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
                    xtype:'xtypeSectorProjectListContainerView',
                    projectStore: projectsDataStore.queryBySector(urlId),
                    sectorRecord: sectorDataStore.findRecord('urlId', urlId)
                });
            };

            if (!sectorDataStore.getCount() || !projectsDataStore.getCount()) var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 500, this);
            else var delayedAfterDataLoad = Ext.Function.createDelayed(afterDataLoad, 0, this);

            delayedAfterDataLoad();

        } else {
            var dbRetry = function () {
                console.log('Testing databases again');
                this.navigationSectorView();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 500, this);

            delayedDbRetry();

            console.log('Databases are not ready.');
        }
    },

    onSectorProjectListItemTap: function(thisObj, index, target, record, event) {
        var sectorId = this.getSectorProjectListContainer().get('sectorRecord').get('urlId');

        record.set('sectorUrlId', sectorId);

        window.location.hash = '#project/' + sectorId + '/' + record.get('slug');
    }
});