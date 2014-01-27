Ext.define("CfaSika.view.sectors.SectorProjectListContainerView",{
    extend: "Ext.Container",

    xtype: "xtypeSectorProjectListContainerView",

    requires: [
        "CfaSika.view.sectors.SectorProjectListView",
        "Ext.Map",
        "Ext.MessageBox"
    ],

    config: {
        title: 'Sectors',
        fullscreen: true,
        layout: 'hbox',
        baseCls: 'projects-list',
        items: [],
        projectStore: null,
        sectorRecord: null
    },
    initialize: function(){
        console.log('Init: CfaSika.view.sectors.SectorProjectListContainerView');

        this.setItems([
            {
                xtype:'img',
                src: this.getSectorRecord().get('Image'),
                baseCls: 'map-img',
                //itemId: 'map',
                flex:2
            },
            {
                xtype: "xtypeSectorProjectListView",
                //id: 'projectList',
                store: this.getProjectStore(),
                scrollable: null,
                flex: 1
            }
        ]);

        this.callParent(arguments);
    }
});