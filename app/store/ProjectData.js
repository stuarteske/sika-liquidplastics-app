Ext.define('CfaSika.store.ProjectData', {
    extend: 'CfaSika.store.Base',

    requires: [
        'CfaSika.store.SettingsData',
        'CfaSika.model.Projects',
        'CfaSika.store.Base'
    ],

    properties: {
        settingsKey: 'projects-version',
        ajaxTimeout: 60000,
        offlineDataUrl: 'data/project-data.json'
    },

    config :{
        model: 'CfaSika.model.Projects',
        storeId: "ProjectData",
        autoLoad: true,
        listeners: {
            addrecords: function( store, records, eOpts ) {
                console.log("ProjectData addrecords");
            },
            beforeload: function( store, operation, eOpts ) {
                console.log("ProjectData beforeload");
            },
            beforesync: function( options, eOpts ) {
                console.log("ProjectData beforesync");
            },
            clear: function( thisObj, eOpts ) {
                console.log("ProjectData clear");
            },
            load: function( thisObj, records, successful, operation, eOpts ) {
                console.log("ProjectData load");
                thisObj.setIsReady(true);
            },
            metachange: function( thisObj, data, eOpts ) {
                console.log("ProjectData metachange");
            },
            refresh: function( thisObj, data, eOpts ) {
                console.log("ProjectData refresh");
            },
            removerecords: function( store, records, indices, eOpts ) {
                console.log("ProjectData removerecords");
            },
            updaterecord: function( thisObj, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues, eOpts ) {
                console.log("ProjectData updaterecord");
            },
            write: function( store, operation, eOpts ) {
                console.log("ProjectData write");
            },
            retrievedExternalData: function(data) {
                console.log("ProjectData retrievedData");
                this.retrievedExternalData(data);
            },
            retrievedExternalDataFailed: function() {
                console.log("ProjectData etrievedDataFailed");
            },
            retrievedExternalDataVersion: function(versionString) {
                console.log("ProjectData retrievedDataVersion");
                this.retrievedExternalDataVersion(versionString);
            },
            retrievedExternalDataVersionFailed: function(errorString) {
                console.log("ProjectData retrievedDataVersionFailed");
            },
            progressUpdate: function(currentProgress) {
                console.log('ProjectData: ' + currentProgress);

                this.setProgress(currentProgress);
            }
        }
    },

    queryByRegion: function(regionString) {

        var tempStore = new CfaSika.store.Base();

        tempStore.data = this.queryBy(function(record, id) {

            var returnFlag = false;

            if (record.get('region') != '') {
                var regions = Ext.JSON.decode(
                    record.get('region')
                );

                var returnFlag = false;

                if (regions.length) {
                    Ext.each(regions, function(item){
                        if (item.urlId) {
                            if (item.urlId === regionString) {
                                returnFlag = true;
                            }
                        }
                    })
                }
            }

            return returnFlag;
        }, this);

        return tempStore;
    },

    queryBySector: function(sectorString) {

        console.log(sectorString);
        var tempStore = new CfaSika.store.Base();

        tempStore.data = this.queryBy(function(record, id) {

            var returnFlag = false;

            if (record.get('sector') != '') {
                var sectors = Ext.JSON.decode(
                    record.get('sector')
                );

                // Check the array size
                if (sectors.length) {
                    Ext.each(sectors, function(item){
                        if (item.urlId) {
                            if (item.urlId === sectorString) {
                                returnFlag = true;
                            }
                        }
                    })
                }
            }

            return returnFlag;
        }, this);

        return tempStore;
    },

    checkDataVersionAndUpdateDateIfRequired: function() {
        this.fireEvent('progressUpdate', 0);

        if ( this.isEmpty() ) {
            // Get the cms data
            console.log('ProjectData is empty');

            // get the data
            this.getOnlineData();
        } else {
            console.log('ProjectData not empty');

            // Check for update
            this.getOnlineDataVersion();
        }
    },

    getAjaxDataUrl: function() {
        return 'http://liquidplastics.sika.cfadigital.com/api/Projects.php';
    },

    getAjaxUpdateUrl: function() {
        return 'http://liquidplastics.sika.cfadigital.com/api/Projects.php?update=1';
    },

    getOfflineData: function() {
        var thisObj = this;

        // Load the offline data
        Ext.Ajax.request({
            url: thisObj.getOfflineDataUrl(),
            timeout: thisObj.getAjaxTimeout(),
            cache: false,
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText.trim());

                // Send the data out for parsing
                if (data != '') {
                    thisObj.fireEvent('retrievedExternalData', data);
                } else {
                    // Data connection failed
                    thisObj.fireEvent('retrievedExternalDataFailed', 'Data returned Empty');

                    thisObj.fireEvent('progressUpdate', 100);
                }
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
                thisObj.fireEvent('retrievedExternalDataFailed', response.status);

                thisObj.fireEvent('progressUpdate', 100);
            }
        });
    },

    getOnlineData: function() {
        // Get the settings database
        var settingDataStore = Ext.getStore('SettingsData');

        // Increase this scope
        var thisObj = this;

        thisObj.removeAllRecords();

        thisObj.fireEvent('progressUpdate', 40);

        // Get the online data
        Ext.Ajax.request({
            url: this.getAjaxDataUrl(),
            timeout: this.getAjaxTimeout(),
            cache: false,
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText.trim());

                // Send the data out for parsing
                if (data != '') {
                    thisObj.fireEvent('retrievedExternalData', data);
                } else {
                    // Data connection failed
                    thisObj.fireEvent('retrievedExternalDataFailed', 'Data returned Empty');

                    thisObj.fireEvent('progressUpdate', 100);
                }
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
                thisObj.fireEvent('retrievedExternalDataFailed', response.status);

                thisObj.fireEvent('progressUpdate', 100);
            }
        });
    },

    getOnlineDataVersion: function() {
        // Increase this scope
        var thisObj = this;

        // Get the online data
        Ext.Ajax.request({
            url: thisObj.getAjaxUpdateUrl(),
            timeout: thisObj.getAjaxTimeout(),
            cache: false,
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText.trim());

                // Send the data out for parsing
                if (data != '') {
                    thisObj.fireEvent('retrievedExternalDataVersion', data.version);

                } else {
                    // Data connection failed
                    thisObj.fireEvent('retrievedExternalDataVersionFailed', 'Data Empty');

                    thisObj.fireEvent('progressUpdate', 100);
                }
            },
            failure: function(response, opts) {
                thisObj.fireEvent('retrievedExternalDataVersionFailed', response.status);

                thisObj.fireEvent('progressUpdate', 100);
            }
        });
    },

    removeAllRecords: function () {

        if (this.getTotalCount() > 0) {
            this.removeAll();
            this.sync();
            this.load();
        }

        if (this.getTotalCount() > 0) {
            this.removeAll();
            this.sync();
            this.load();
        }

        if (this.getTotalCount() > 0) return false;
        else true;
    },

    retrievedExternalData: function(data) {
        var thisObj = this;

        // Get the image data store
        var imageDataStore = Ext.getStore('ImageData');

        // Set the new data version
        this.setDataVersion(data.version);

        Ext.Object.each(data.results, function(key, value) {
            //console.log(key);
            //console.log(value);
            //console.log(value.sector);
            //console.log(Ext.JSON.encode(value.sector));

            Ext.Object.each(value.Image, function(key, value) {
                imageDataStore.setImage(value.ImageId, value.Image);
                value.Image = '';
            });

            // Query the region database for an existing record
            var projectRecords = thisObj.queryBy(function(record, id){
                if (record.get('slug') === key) return true;
                    else return false;
            }, thisObj);

            // Test for the record data
            if (!projectRecords.length) {
                thisObj.add({
                    'slug': (key == null) ? '': key,
                    'Title': (value.Title == null) ? '': value.Title,
                    'Intro': (value.Intro == null) ? '': value.Intro,
                    'Copy': (value.Copy == null) ? '': Ext.String.htmlDecode(value.Copy),
                    'Image': (value.Image == null) ? '[]': Ext.JSON.encode(value.Image),
                    'Download': (value.Download == null || value.Download == 0) ? '': value.Download,
                    'project_title': (value.project_title == null) ? '': value.project_title,
                    'Architect': (value.Architect == null || value.Architect == 0) ? '': value.Architect,
                    'Contractor': (value.Contractor == null) ? '': value.Contractor,
                    'Pin': (value.Pin == null) ? '[]': Ext.JSON.encode(value.Pin),
                    'categories': (value.categories == null) ? '[]': Ext.JSON.encode(value.categories),
                    'sector': (value.sector == null) ? '[]': Ext.JSON.encode(value.sector),
                    'region': (value.region == null) ? '[]': Ext.JSON.encode(value.region)
                });

            } else {
                // A record was found so update the existing
                projectRecords.first().set({
                    'slug': (key == null) ? '': key,
                    'Title': (value.Title == null) ? '': value.Title,
                    'Copy': (value.Copy == null) ? '': Ext.String.htmlDecode(value.Copy),
                    'Image': (value.Image == null) ? '[]': Ext.JSON.encode(value.Image),
                    'Download': (value.Download == null || value.Download == 0) ? '': value.Download,
                    'project_title': (value.project_title == null) ? '': value.project_title,
                    'Architect': (value.Architect == null || value.Architect == 0) ? '': value.Architect,
                    'Contractor': (value.Contractor == null) ? '': value.Contractor,
                    'Pin': (value.Pin == null) ? '[]': Ext.JSON.encode(value.Pin),
                    'categories': (value.Contractor == null) ? '[]': Ext.JSON.encode(value.categories),
                    'sector': (value.sector == null) ? '[]': Ext.JSON.encode(value.sector),
                    'region': (value.region == null) ? '[]': Ext.JSON.encode(value.region)
                });

//                projectRecords.first().set('Title', (value.Title == null) ? '': value.Title);
//                projectRecords.first().set('Intro', (value.Intro == null) ? '': value.Intro);
//                projectRecords.first().set('Copy', (value.Copy == null) ? '': Ext.String.htmlDecode(value.Copy));
//                projectRecords.first().set('Image', (value.Image == null) ? '[]': Ext.JSON.encode(value.Image));
//                projectRecords.first().set('Download', (value.Download == null || value.Download == 0) ? '': value.Download);
//                projectRecords.first().set('project_title', (value.project_title == null) ? '': value.project_title);
//                projectRecords.first().set('Architect', (value.Architect == null || value.Architect == 0) ? '': value.Architect),
//                projectRecords.first().set('Contractor', (value.Contractor == null) ? '': value.Contractor),
//                projectRecords.first().set('Pin', (value.Pin == null) ? '[]': Ext.JSON.encode(value.Pin));
//                projectRecords.first().set('categories', (value.Contractor == null) ? '[]': Ext.JSON.encode(value.categories));
//                projectRecords.first().set('sector', (value.sector == null) ? '[]': Ext.JSON.encode(value.sector));
//                projectRecords.first().set('region', (value.region == null) ? '[]': Ext.JSON.encode(value.region));

                // Delete any extras records
                projectRecords.each(function (item, index, length) {
                    if (index > 0) thisObj.remove(item);
                });
            }
        });

        // Save the data
        this.sync();
        imageDataStore.sync();


        thisObj.fireEvent('progressUpdate', 100);

        console.log('Project data update complete');
    },

    retrievedExternalDataVersion: function(versionString) {
        // Get the settings database
        var settingDataStore = Ext.getStore('SettingsData');

        // get the regions data version value
        var dataVersion = settingDataStore.getSetting(
            this.getSettingsKey(),
            versionString
        );

        if (versionString != dataVersion) {
            console.log('Projects update in progress');

            this.fireEvent('progressUpdate', 30);

            // Get the data
            this.getOnlineData();
        } else {
            console.log('no update needed');

            this.fireEvent('progressUpdate', 100);
        }
    },

    setDataVersion: function(versionString) {

        // Get the settings database
        var settingDataStore = Ext.getStore('SettingsData');

        // get the regions data version value
        settingDataStore.setSetting(
            this.getSettingsKey(),
            versionString
        );
    }
});
