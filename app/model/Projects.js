Ext.define('CfaSika.model.Projects', {
    extend: 'Ext.data.Model',

    requires: ['Ext.data.proxy.Sql'],

    config: {
        fields: [
            'slug',
            'Title',
            'Intro',
            'Copy',
            'Image',
            'Download',
            'project_title',
            "Architect",
            "Contractor",
            'Pin',
            'categories',
            'sector',
            'region'
        ],
        proxy: {
            type: 'sql'
        }
    }
});