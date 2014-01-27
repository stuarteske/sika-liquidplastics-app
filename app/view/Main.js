Ext.define('CfaSika.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'main',

    requires: [
        'CfaSika.view.Categories'
    ],

    config: {
        fullscreen: true,
        autoDestroy: false,
        navigationBar: {
            backButton: {
                iconCls: 'back'
            },
            useTitleForBackButtonText: true
        },
        listeners: {
            initialize: function(comp , eOpts){
                comp.element.on(
                    'swipe',
                    function(event, node, options, eOpts) {
                        switch (event.direction) {
                            case 'right':
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

    pop: function() {
        this.fireEvent('beforepop', this);
        this.callParent(arguments);
    }
});
