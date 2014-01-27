Ext.define('CfaSika.store.RegionData', {
    extend: 'CfaSika.store.Base',

    requires: [
        'CfaSika.store.SettingsData',
        'CfaSika.model.Regions',
        'CfaSika.store.Base'
    ],

    properties: {
        settingsKey: 'regions-version',
        offlineDataUrl: 'data/region-data.json'
    },

    config :{
        model: 'CfaSika.model.Regions',
        storeId: "RegionData",
        autoLoad: true,
        listeners: {
            load: function() {
                this.setIsReady(true);
            },
//            beforesync: function() {
//                console.log("RegionData Before Sync");
//            },
//            refresh: function() {
//                console.log("RegionData Refresh");
//            },
            sync : function() {
                console.log("RegionData Sync");
            },
            updaterecord : function() {
                console.log("RegionData Update Record");
            },
            retrievedExternalData: function(data) {
                console.log("RegionData retrievedData");
                this.retrievedExternalData(data);
            },
            retrievedExternalDataFailed: function() {
                console.log("RegionData etrievedDataFailed");
            },
            retrievedExternalDataVersion: function(versionString) {
                console.log("RegionData retrievedDataVersion");
                this.retrievedExternalDataVersion(versionString);
            },
            retrievedExternalDataVersionFailed: function(errorString) {
                console.log("RegionData retrievedDataVersionFailed");
            },
            progressUpdate: function(currentProgress) {
                console.log('RegionData: ' + currentProgress);

                this.setProgress(currentProgress);
            }
        }
    },

    checkDataVersionAndUpdateDateIfRequired: function() {
        var thisObj = this;

        thisObj.fireEvent('progressUpdate', 0);

        if ( this.isEmpty() ) {
            // Get the cms data
            console.log('RegionData is empty');

            // get the data
            thisObj.getOnlineData();
        } else {
            console.log('RegionData not empty');

            // Check for update
            thisObj.getOnlineDataVersion();
        }
    },

    getAjaxDataUrl: function() {
        return 'http://liquidplastics.sika.cfadigital.com/api/regions.php';
    },

    getAjaxUpdateUrl: function() {
        return 'http://liquidplastics.sika.cfadigital.com/api/regions.php?update=1';
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

                    thisObj.fireEvent('progressUpdate', 100);
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

        // Set the new data version
        this.setDataVersion(data.version);

        Ext.Object.each(data.results, function(key, value) {
            //console.log(key);
            //console.log(value);

            // Query the region database for an existing record
            var regionRecords = thisObj.queryBy(function(record, id){
                if (record.get('urlId') === key) return true;
                else return false;
            }, thisObj);

            // Test for the record data
            if (!regionRecords.length) {
                // Amend the image data
                value.Image = value.Image[0].Image;

                // No record exists so add one.
                thisObj.add(value);
            } else {
                // A record was found so update the existing
                regionRecords.first().set({
                    'Image': value.Image[0].Image,
                    'Title': value.Title,
                    'label': value.label,
                    'map': value.map,
                    'urlId': value.urlId
                });

                //regionRecords.first().set('Image', value.Image[0].Image);
                //regionRecords.first().set('Title', value.Title);
                //regionRecords.first().set('label', value.label);
                //regionRecords.first().set('map', value.map);
                //regionRecords.first().set('urlId', value.urlId);

                // Delete any extras records
                regionRecords.each(function (item, index, length) {
                    if (index > 0) thisObj.remove(item);
                });
            }
        });

        // Save the data
        this.sync();

        this.fireEvent('progressUpdate', 100);

        console.log('Region update complete');
    },

    retrievedExternalDataVersion: function(versionString) {
        // Get the settings database
        var settingDataStore = Ext.getStore('SettingsData');

        // get the regions data version value
        var regionDataVersion = settingDataStore.getSetting(
            this.getSettingsKey(),
            versionString
        );

        if (versionString != regionDataVersion) {
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