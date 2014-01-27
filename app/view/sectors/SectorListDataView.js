Ext.define('CfaSika.view.sectors.SectorListDataView', {
    extend: 'Ext.dataview.DataView',

    xtype: 'xtypeSectorListDataView',

    config: {
        baseCls: 'categories-list',
        itemTpl: [
            '<div class="image" style="background-image:url({Image)})"></div>',
            '<div class="name">{Title}</div>'
        ].join(''),
        records: null
    }
});
