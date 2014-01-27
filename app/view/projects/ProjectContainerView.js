Ext.define('CfaSika.view.projects.ProjectContainerView', {
    extend: 'Ext.Container',

    xtype: 'xtypeProjectContainerView',

    requires: [
        'Ext.Img',
        'Ext.MessageBox',
        'CfaSika.view.projects.ProjectContainerDetailsPanelView',
        'CfaSika.view.projects.ProjectContainerCarouselContainerView',
        'CfaSika.view.projects.ProjectContainerBackContainerView'
    ],

    config: {
        layout: 'hbox',
        baseCls: 'project-view',
        fullscreen: true,
        projectRecord: null,
        regionUrl: '',
        sectorUrl: '',

        listeners: {
            initialize: function(comp , eOpts){
                comp.element.on(
                    'swipe',
                    function(event, node, options, eOpts) {
                        switch (event.direction) {
                            case 'right':
                                console.log('Swipe right');
                                this.fireEvent('swipeRight', this);
                                break;
                            case 'left':
                                this.fireEvent('swipeLeft', this);
                                break;
                            default:
                                //console.log('Unknown Swipe');
                                break;
                        }
                    },
                    comp
                );
            }
        }
    },

    initialize: function() {
        console.log('CfaSika.view.projects.ProjectContainerView');

        this.setItems([
            {
                xtype: 'xtypeProjectContainerBackContainerView',
                flex: 1
            },
            {
                xtype: 'xtypeProjectContainerDetailsPanelView',
                flex: 3,
                record: this.getProjectRecord()
            },
            {
                xtype: 'xtypeProjectContainerCarouselContainerView',
                baseCls: 'project-carousel-panel',
                flex: 3,
                record: this.getProjectRecord()
            }
        ]);

        this.callParent(arguments);
    }
});