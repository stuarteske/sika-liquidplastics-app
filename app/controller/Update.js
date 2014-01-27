Ext.define('CfaSika.controller.Update', {
    extend: 'Ext.app.Controller',

    requires: [
        'CfaSika.view.Categories',
        'CfaSika.view.update.UpdateMainContainerView'
    ],

    config: {
        refs: {
            mainView: 'main',
            categoryContainerView: 'xtypeCategoryView',
            updateContainerView: 'xtypeUpdateMainContainerView'
        },

        before: {},

        control: {},

        routes: {
            'update': 'navigationUpdateData'
        },

        listeners : {},

        currentProgress: 0,
        regionProgressTotal: 0,
        sectorProgressTotal: 0,
        projectProgressTotal: 0
    },

    init: function() {
        console.log('Init: CfaSika.controller.Update');

        this.setCurrentProgress(0);
        this.setRegionProgressTotal(0);
        this.setSectorProgressTotal(0);
        this.setProjectProgressTotal(0);
    },

    navigationUpdateData: function() {
        console.log('Navigation: #Update');

        if (this.getMainView().getItems().length >= 2) {
            this.getMainView().push({xtype: 'xtypeUpdateMainContainerView'});
            this.updateAppData();

        } else window.location.hash = '';
    },

    updateAppData: function() {
        var thisObj = this;

        this.setProgress('0');

        // Get the data stores
        var regionDataStore = Ext.getStore('RegionData');
        var sectorDataStore = Ext.getStore('SectorData');
        var projectDataStore = Ext.getStore('ProjectData');

        // Are the databases ready?
        if (regionDataStore.isReady() && sectorDataStore.isReady() && projectDataStore.isReady()) {
            console.log('Data Stores are ready.');

            thisObj.updateRegionData();

        } else {
            var dbRetry = function () {
                console.log('Testing databases again');
                this.updateAppData();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 500, this);

            delayedDbRetry();

            console.log('Databases are not ready.');
        }

    },

    updateRegionData: function() {
        var thisObj = this;

        var regionDataStore = Ext.getStore('RegionData');

        thisObj.setMessage('Getting Region Information');

        regionDataStore.on('progressUpdate', function(currentProgress) {
            thisObj.setMessage('Storing Region Information');

            thisObj.setRegionProgressTotal(currentProgress);
            thisObj.setProgress(
                Math.ceil((thisObj.getRegionProgressTotal() + thisObj.getSectorProgressTotal() + thisObj.getProjectProgressTotal()) / 3)
            )

            if (currentProgress == 100) {
                regionDataStore.un('progressUpdate');

                thisObj.updateSectionData();
            }
        });

        // Query region update
        regionDataStore.checkDataVersionAndUpdateDateIfRequired();
    },

    updateSectionData: function() {
        var thisObj = this;

        thisObj.setMessage('Getting Sector Information');

        var sectorDataStore = Ext.getStore('SectorData');

        sectorDataStore.on('progressUpdate', function(currentProgress) {
            thisObj.setMessage('Storing Sector Information');

            thisObj.setSectorProgressTotal(currentProgress);
            thisObj.setProgress(
                Math.ceil((thisObj.getRegionProgressTotal() + thisObj.getSectorProgressTotal() + thisObj.getProjectProgressTotal()) / 3)
            )

            if (currentProgress == 100) {
                sectorDataStore.un('progressUpdate');

                thisObj.updateProjectData();
            }
        });

        // Query region update
        sectorDataStore.checkDataVersionAndUpdateDateIfRequired();
    },

    updateProjectData: function() {
        var thisObj = this;

        thisObj.setMessage('Getting Project Information');

        var projectDataStore = Ext.getStore('ProjectData');

        projectDataStore.on('progressUpdate', function(currentProgress) {
            thisObj.setMessage('Storing Project Information');

            thisObj.setProjectProgressTotal(currentProgress);
            thisObj.setProgress(
                Math.ceil((thisObj.getRegionProgressTotal() + thisObj.getSectorProgressTotal() + thisObj.getProjectProgressTotal()) / 3)
            )

            if (currentProgress == 100) {
                projectDataStore.un('progressUpdate');

                thisObj.updateAppDataComplete();
            }
        });

        // Query region update
        projectDataStore.checkDataVersionAndUpdateDateIfRequired();
    },

    updateAppDataComplete: function() {
        var thisObj = this;

        console.log('Getting ready to change back');

        var delayedFunction = Ext.Function.createDelayed(function () {
            location.reload();
        }, 3000);

        delayedFunction();

        this.setMessage('Restarting App');
    },

    setProgress: function(progress) {
        this.setCurrentProgress(progress);

        // Set the progress text
        Ext.get(
            Ext.DomQuery.select('#update-screen .progress-text h1')
        ).setHtml(progress + '%');

        // Set the progress bar
        Ext.get(
            Ext.DomQuery.select('.meter span')
        ).setWidth(progress + '%');
    },

    setMessage: function(text) {

        // Set the message text
        Ext.get(
            Ext.DomQuery.select('#update-screen .summary h1')
        ).setHtml(text);
    }
});