Ext.define('CfaSika.model.Settings', {
    extend: 'Ext.data.Model',
    requires: [],

    config: {
        fields: [
            'dataKey',
            'dataValue'
        ],
        proxy: {
            type: 'sql'
        }
    }
});