Ext.define("CfaSika.view.update.UpdateMainContainerView",{
    extend: "Ext.Container",

    xtype: "xtypeUpdateMainContainerView",

    requires: [],

    config: {
        layout: 'vbox',
        id: 'update-screen',
        baseCls: '',
        style:'text-align:center;',
        items: [
            {
                xtype: 'panel',
                html: '<h1>Download Data</h1>',
                baseCls: 'summary',
                flex: 1
            },
            {
                xtype: 'panel',
                html: '<h1>45%</h1>',
                baseCls: 'progress-text',
                flex: 1
            },
            {
                xtype: 'panel',
                html: '<div class="meter orange" style="max-width: 75%;margin:0 auto;"><span style="width: 45%"></span></div>',
                baseCls: 'progress-bar',
                flex: 2
            }
        ]
    }
});