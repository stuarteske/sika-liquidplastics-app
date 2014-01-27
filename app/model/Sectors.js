Ext.define('CfaSika.model.Sectors', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.proxy.Sql'],

    config: {
        fields: [
            'Title',
            'label',
            'urlId',
            'Image'
        ],
        proxy: {
            type: 'sql'
        }
    }
});
