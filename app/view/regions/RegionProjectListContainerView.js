Ext.define("CfaSika.view.regions.RegionProjectListContainerView",{
    extend: "Ext.Container",

    xtype: "xtypeRegionProjectListContainerView",

    requires: [
        "CfaSika.view.regions.RegionProjectListView",
        "Ext.Map",
        "Ext.MessageBox"
    ],

    config: {
        title: 'Regions',
        useTitleForBackButtonText: true,
        fullscreen: true,
        layout: 'hbox',
        baseCls: 'projects-list',
        items: [],
        projectStore: null,
        regionRecord: null
    },
    initialize: function(){
        console.log('Init: CfaSika.view.regions.RegionProjectListContainerView');

        this.setItems([
            {
                xtype:'img',
                src: this.getRegionRecord().get('map'),
                baseCls: 'map-img',
                //itemId: 'map',
                flex:2
            },
            {
                xtype: "xtypeRegionProjectListView",
                //id: 'projectList',
                store: this.getProjectStore(),
                scrollable: null,
                flex: 1
            }
        ]);

        this.callParent(arguments);
    }
});