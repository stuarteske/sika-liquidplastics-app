Ext.define('CfaSika.view.Categories', {
    extend: 'Ext.dataview.DataView',

    xtype: 'xtypeCategoryView',

    config: {
        baseCls: 'categories-list',
        itemTpl: [
            '<div class="image" style="background-image:url({imageData})"></div>',
            '<div class="name">{title}</div>'
        ].join(''),
        records: null
    }
});
