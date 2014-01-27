Ext.define('CfaSika.controller.Home', {
    extend: 'Ext.app.Controller',

    requires: [
        'CfaSika.view.Categories',
        'CfaSika.view.update.UpdateMainContainerView'
    ],

    config: {
        refs: {
            mainView: 'main',
            homeNavDataView: 'xtypeCategoryView',
            updateMainContainerView: 'xtypeUpdateMainContainerView'
        },

        before: {},

        control: {
            homeNavDataView: {
                itemtap: 'onHomeNameItemTap'
            },
            mainView: {
                back: 'onNavigationBackBtnTap',
                swipeLeft: 'onSwipeLeft',
                swipeRight: 'onSwipeRight'
            }
        },

        routes: {
            '': 'navigationHome'
        },

        listeners : {}
    },

    init: function() {
        console.log('Init: CfaSika.controller.Home');
    },

    navigationHome: function() {
        console.log('Home: #Home');

        var thisObj = this;

        // Get the settings database
        var settingDataStore = Ext.getStore('SettingsData');

        // Get the regions data store
        var navigationDataStore = Ext.getStore('NavigationData');

        // Are the databases ready?
        if (navigationDataStore.isReady()) {
            console.log('Navigation Data Store is ready.');

            // Load the main view
            this.getMainView().push({
                xtype:'xtypeCategoryView',
                store: navigationDataStore
            });

        } else {
            var dbRetry = function () {
                console.log('Testing databases again');
                this.navigationHome();
            };
            var delayedDbRetry = Ext.Function.createDelayed(dbRetry, 250, this);

            delayedDbRetry();

            console.log('Databases are not ready.');
        }
    },

    onHomeNameItemTap: function(thisObj, index, target, record, event) {
        //console.log(record.get('url'));

        window.location.hash = record.get('url');
    },

    onNavigationBackBtnTap: function(thisObj, eOpts) {
        //console.log('Back button tapped');

        window.location.hash = '#back';

        Ext.Viewport.setMasked(false);
    },

    onSwipeLeft: function() {
        //console.log(this.getMainView().getInnerItems().length);

        window.history.forward();
    },

    onSwipeRight: function() {
        if (this.getMainView().getInnerItems().length > 1) {
            window.location.hash = '#back';
            this.getMainView().pop();
        }
    }
});