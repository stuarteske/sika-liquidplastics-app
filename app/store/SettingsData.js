Ext.define('CfaSika.store.SettingsData', {
    extend: 'Ext.data.Store',

    requires: ['CfaSika.model.Settings'],

    properties: {
        isReady: false
    },

    config :{
        model: 'CfaSika.model.Settings',
        storeId: "SettingsData",
        autoLoad: true,
        listeners: {
            load: function() {
                this.setIsReady(true);
            },
//            beforesync: function() {
//                console.log("SettingsData Before Sync");
//            },
//            refresh: function() {
//                console.log("SettingsData Refresh");
//            },
            updaterecord : function() {
                console.log("SettingsData Update Record");
            },
            sync: function() {
                console.log("SettingsData Sync");
            },
            save: function() {
                console.log("SettingsData Save");
            }
        }
    },

    getSetting: function(dataKey, defaultValue) {

        var returnValue = defaultValue;

        // Query the settings database for an existing record
        var settingRecord = this.queryBy(function(record, id){
            if (record.get('dataKey') === dataKey) return true;
                else return false;
        }, this);

        // Test for the record data
        if (!settingRecord.length) {
            // Empty so set the setting
            this.setSetting(dataKey, defaultValue);
        } else {
            // Found data so return the value
            returnValue = settingRecord.first().get('dataValue');
        }

        return returnValue;
    },

    setSetting: function(dataKey, dataValue) {
        var thisObj = this;

        // Query the settings database for an existing record
        var settingRecords = this.queryBy(function(record, id){
            if (record.get('dataKey') === dataKey) return true;
            else return false;
        }, this);

        // Test for the record data
        if (!settingRecords.length) {
            // No record exists so add one.
            this.add({
                'dataKey': dataKey,
                'dataValue': dataValue
            });
        } else {
            // A record was found so update the existing
            settingRecords.first().set('dataValue', dataValue);

            // Delete any extras records
            settingRecords.each(function (item, index, length) {
                if (index > 0) thisObj.remove(item);
            });
        }

        // Save the data
        this.sync();
    },

    isReady: function() {
        return this.getIsReady();
    },

    getIsReady: function() {
        return this.properties.isReady;
    },

    setIsReady: function(isReady) {
        this.properties.isReady = isReady;
    }
});
