Ext.define('CfaSika.view.sectors.SectorProjectListView', {
    extend: 'Ext.List',

    xtype: 'xtypeSectorProjectListView',

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
