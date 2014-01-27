Ext.define('CfaSika.store.SectorData', {
    extend: 'CfaSika.store.Base',

    requires: [
        'CfaSika.store.SettingsData',
        'CfaSika.model.Sectors',
        'CfaSika.store.Base'
    ],

    properties: {
        settingsKey: 'sectors-version',
        offlineDataUrl: 'data/sector-data.json'
    },

    config :{
        model: 'CfaSika.model.Sectors',
        storeId: "SectorData",
        autoLoad: true,
        listeners: {
            addrecords: function( store, records, eOpts ) {
                console.log("SectordData addrecords");
            },
            beforeload: function( store, operation, eOpts ) {
                console.log("SectordData beforeload");
            },
            beforesync: function( options, eOpts ) {
                console.log("SectordData beforesync");
            },
            clear: function( thisObj, eOpts ) {
                console.log("SectordData clear");
            },
            load: function( thisObj, records, successful, operation, eOpts ) {
                console.log("SectordData load");
                thisObj.setIsReady(true);
            },
            metachange: function( thisObj, data, eOpts ) {
                console.log("SectordData metachange");
            },
            refresh: function( thisObj, data, eOpts ) {
                console.log("SectordData refresh");
            },
            removerecords: function( store, records, indices, eOpts ) {
                console.log("SectordData removerecords");
            },
            updaterecord: function( thisObj, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues, eOpts ) {
                console.log("SectordData updaterecord");
            },
            write: function( store, operation, eOpts ) {
                console.log("SectordData write");
            },
            retrievedExternalData: function(data) {
                console.log("SectordData retrievedData");
                this.retrievedExternalData(data);
            },
            retrievedExternalDataFailed: function() {
                console.log("SectordData etrievedDataFailed");
            },
            retrievedExternalDataVersion: function(versionString) {
                console.log("SectordData retrievedDataVersion");
                this.retrievedExternalDataVersion(versionString);
            },
            retrievedExternalDataVersionFailed: function(errorString) {
                console.log("SectordData retrievedDataVersionFailed");
            },
            progressUpdate: function(currentProgress) {
                console.log('SectordData: ' + currentProgress);

                this.setProgress(currentProgress);
            }
        }
    },

    checkDataVersionAndUpdateDateIfRequired: function() {
        var thisObj = this;

        thisObj.fireEvent('progressUpdate', 0);

        if ( this.isEmpty() ) {
            // Get the cms data
            console.log('SectordData is empty');

            // get the data
            thisObj.getOnlineData();
        } else {
            console.log('SectordData not empty');

            // Check for update
            thisObj.getOnlineDataVersion();
        }
    },

    getAjaxDataUrl: function() {
        return 'http://liquidplastics.sika.cfadigital.com/api/sectors.php';
    },

    getAjaxUpdateUrl: function() {
        return 'http://liquidplastics.sika.cfadigital.com/api/sectors.php?update=1';
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

                thisObj.fireEvent('progressUpdate', 25);

                // Send the data out for parsing
                if (data != '') {
                    thisObj.fireEvent('retrievedExternalDataVersion', data.version);
                } else {
                    // Data connection failed
                    thisObj.fireEvent('retrievedExternalDataVersionFailed', 'Data Empty');
                }
            },
            failure: function(response, opts) {
                thisObj.fireEvent('retrievedExternalDataVersionFailed', response.status);

                thisObj.fireEvent('progressUpdate', 25);
            }
        });
    },

    removeAllRecords: function () {
        // Todo: delay and cascade these functions
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
        // ToDo: Sort this out for the new data type

        var thisObj = this;

        // Set the new data version
        this.setDataVersion(data.version);

        Ext.Object.each(data.results, function(key, value) {
            //console.log(key);
            //console.log(value);

            // Query the region database for an existing record
            var records = thisObj.queryBy(function(record, id){
                if (record.get('urlId') === key) return true;
                else return false;
            }, thisObj);

            // Test for the record data
            if (!records.length) {
                // No record exists so add one.
                value.Image = value.Image[0].Image;

                thisObj.add(value);
            } else {
                // A record was found so update the existing
                records.first().set({
                    'Image': value.Image[0].Image,
                    'Title': value.Title,
                    'label': value.label,
                    'urlId': value.urlId
                });

                //records.first().set('Image', value.Image[0].Image);
                //records.first().set('Title', value.Title);
                //records.first().set('label', value.label);
                //records.first().set('urlId', value.urlId);

                // Delete any extras records
                records.each(function (item, index, length) {
                    if (index > 0) thisObj.remove(item);
                });
            }
        });

        // Save the data
        this.sync();

        this.fireEvent('progressUpdate', 100);

        console.log('Sector update complete');
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
            console.log('Region upadte in progress');

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
