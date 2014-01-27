Ext.define('CfaSika.view.regions.RegionsListDataView', {
    extend: 'Ext.dataview.DataView',

    xtype: 'xtypeRegionsListDataView',

    config: {
        baseCls: 'categories-list',
        itemTpl: [
            '<div class="image" style="background-image:url({Image)})"></div>',
            '<div class="name">{Title}</div>'
        ].join(''),
        records: null
    }
});
