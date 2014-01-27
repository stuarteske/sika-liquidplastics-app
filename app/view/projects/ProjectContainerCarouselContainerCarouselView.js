Ext.define('CfaSika.view.projects.ProjectContainerCarouselContainerCarouselView', {
    extend: 'Ext.Carousel',

    xtype: 'xtypeProjectContainerCarouselContainerCarouselView',

    config: {
        fullscreen: false
    },

    initialize: function() {
        console.log('CfaSika.view.projects.ProjectContainerCarouselContainerCarouselView');

        // get the image data form the json  encoded string
        var jsonImagesString = this.getRecord().get('Image');
        var imagesArray = Ext.JSON.decode(jsonImagesString);

        var imageDataStore = Ext.getStore('ImageData');

        Ext.Array.each(imagesArray, function(item) {
            this.add({
                xtype: 'img',
                src: imageDataStore.getImage(item.ImageId)
            })
        }, this);

        this.callParent(arguments);
    },

    onDragStart: function(e) {
        e.stopPropagation();

        this.callParent(arguments);
    },

    onDrag: function(e) {
        e.stopPropagation();

        this.callParent(arguments);
    },

    onDragEnd: function(e) {
        e.stopPropagation();

        this.callParent(arguments);
    }

});