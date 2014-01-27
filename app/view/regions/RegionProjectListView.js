Ext.define('CfaSika.view.regions.RegionProjectListView', {
    extend: 'Ext.List',

    xtype: 'xtypeRegionProjectListView',

    requires: [
        'Ext.MessageBox'
    ],

    config: {
        baseCls: 'projects',
        itemTpl:  new Ext.XTemplate(
            '<div class="project" ref="{id}">',
            '<tpl for="Pin">',
            '',
            '</tpl>',
            '<div class="itemname">{Title}</div>',
            '</div>'
        )
    }
});
