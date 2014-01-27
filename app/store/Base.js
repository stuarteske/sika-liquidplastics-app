Ext.define('CfaSika.store.Base', {
    extend: 'Ext.data.Store',

    mixins: ['Ext.mixin.Observable'],

    properties: {
        isReady: false,
        progress: false,
        settingsKey: '',
        ajaxTimeout: 30000,
        offlineDataUrl: ''
    },

    config :{
        autoLoad: true
    },

    verifySqlData: function(dbName, dbTableName, modelFieldName) {
        // Get a handel on the class
        var thisObj = this;

        // Make the sql connection
        var db = openDatabase(dbName, '1.0', '', 10 * 1024 * 1024);

        // Do the transaction
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ' + dbTableName, [], function (tx, results) {

                // Get the result length
                var resultLength = results.rows.length, i;

                // Get the store length
                var thisLength = thisObj.getCount();

                // If they are not equal then there is data missing
                if (resultLength != thisLength) {

                    // Load the missing data
                    for (i = 0; i < resultLength; i++) {

                        // Try and find the id of the records
                        var checkedRecordId = thisObj.find(
                            modelFieldName,
                            results.rows.item(i)[modelFieldName]
                        )

                        // If -1 then it is missing, so add it
                        if (checkedRecordId < 0) {
                            thisObj.add(
                                results.rows.item(i)
                            );

                            thisObj.fireEvent(
                                'recordVerified',
                                results.rows.item(i)[modelFieldName]
                            );
                        }
                    }
                }

                // Data ready flag
                thisObj.setIsReady(true);
            });
        });
    },

    isEmpty: function() {
        if ( !this.getCount() ) return true;
            else return false;
    },

    isReady: function() {
        return this.getIsReady();
    },

    getIsReady: function() {
        return this.properties.isReady;
    },

    setIsReady: function(isReady) {
        this.properties.isReady = isReady;
    },

    getProgress: function() {
        return this.properties.Progress;
    },

    setProgress: function(currentProgress) {
        this.properties.Progress = currentProgress;
    },

    getSettingsKey: function() {
        return this.properties.settingsKey;
    },

    getAjaxTimeout: function() {
        return this.properties.ajaxTimeout;
    },

    getOfflineDataUrl: function() {
        return this.properties.offlineDataUrl;
    }
});
