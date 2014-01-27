Ext.define('CfaSika.model.Images', {
    extend: 'Ext.data.Model',

    requires: ['Ext.data.proxy.Sql'],

    config: {
        fields: [
            { name: 'imageId', type: 'string' },
            { name: 'imageData', type: 'string' }
        ],
        proxy: {
            type: 'sql'
        }
    }
});