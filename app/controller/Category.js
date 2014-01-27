//Ext.define('CfaSika.controller.Category', {
//    extend: 'Ext.app.Controller',
//    requires: 'Ext.Msg.alert',
//    config: {
//        refs: {
//            main: 'main',
//            projects: '#projectList',
//            projectNavPanel: 'project_nav_panel',
//            projectView: 'project',
//            projectsMap: 'projects_map',
//            updateBtn: 'button[name="update_button"]'
//        },
//
//        before: {
//            showRootCategory: 'ensureStoreLoad',
//            showCategoryById: 'ensureStoreLoad'
//        },
//
//        control: {
//            main: {
//                //beforepop: 'onMainBeforePop',
//                //swipeLeft: 'onSwipe'
//            },
//            categories: {
//                //itemtap: 'onCategoryTap'
//            },
//            projectslist: {
//                //itemtap: 'onProjectTap'
//            },
//            projectNavPanel: {
//                //ProjNavTap: 'onProjectNavTap'
//            },
//            updateBtn: {
//                //tap: 'updateFromServer'
//            }
//        },
//
//        routes: {
//            //'': 'showRootCategory',
//            //':id': 'showCategoryById'
//        },
//
//        currentRecord: null,
//        imageStore: null,
//        mapStore: null,
//        stack: [],
//
//        listeners: {}
//    },
//
//    init: function() {
//        console.log('Init: CfaSika.controller.Category');
//
//        // CfaSika.app.getApplication().getHistory().forward()
//    },
//
//    launch: function() {
//        console.log('Launch: CfaSika.controller.Category');
//    },
//
//    updateFromServer: function() {
//        this.getMain().setMasked({ xtype: 'loadmask', indicator: true, message: 'Fetching Data ....'});
//
//        // Remove thisin a while if not errors are reported.
//
////        // Delete all records
////        // 'Categories','Projects','ProjectImages','CategoryImages', 'CategoryMaps'
//        var projectStore = Ext.getStore("Projects");
//        projectStore.removeAllRecords();
////        projectStore.sync();
////        //projectStore.load();
////        //console.log('Project: ' + projectStore.getCount());
////
//        var projectImageStore = Ext.getStore("ProjectImages");
//        projectImageStore.removeAllRecords();
////        projectImageStore.sync();
////        //projectImageStore.load();
////        //console.log('Project Images: ' + projectImageStore.getCount());
////
//        var categoryStore = Ext.getStore("Categories");
//        categoryStore.removeAll();
////        categoryStore.sync();
////        //categoryStore.load();
////        //console.log('Category: ' + categoryStore.getCount());
////
//        var categoryImageStore = Ext.getStore("CategoryImages");
//        categoryImageStore.removeAll();
////        categoryImageStore.sync();
////        //categoryImageStore.load();
////        //console.log('Category Images: ' + categoryImageStore.getCount());
////
//        var categoryMapStore = Ext.getStore("CategoryMaps");
//        categoryMapStore.removeAll();
////        categoryMapStore.sync();
////        //categoryMapStore.load();
////        //console.log('Category Mapss' + categoryMapStore.getCount());
//
//        //var thisObj = this;
//
//        //var intervalId = setInterval(function() {
//            //window.clearInterval(intervalId);
//            this.syncWithServer();
//        //}, 3000);
//    },
//
//    syncWithServer: function() {
//        Ext.getStore("Categories").load();
//
//        // Sync the projects
//        var onlineSync = new Ext.data.Store({
//
//            model: "CfaSika.model.ProjectOnline",
//            storeId: "ProjectOnline",
//            proxy: {
//                type: 'jsonp',
//                url: 'http://sika-app.cfa-uat.com/projects/',
//                reader: {
//                    type: 'json',
//                    rootProperty: 'items'
//                }
//            },
//            autoLoad: true,
//            listeners: {
//
//                load: function() {
//                    console.log('SYNCING...');
//                    var Project = Ext.ModelMgr.getModel('CfaSika.model.Project');
//
//                    var store = Ext.getStore("Projects");
//                    //store.removeAll(true);
//                    store.removeAllRecords();
//
//                    var imageStore = Ext.getStore("ProjectImages");
//                    //imageStore.removeAll(true);
//                    imageStore.removeAllRecords();
//
//                    // Loop through records and fill the offline store
//                    this.each(function(record) {
//
//                        var projectRecords = Ext.Array.filter(store.data.all, function(item) {
//                            if (item.get('Slug') == record.data.Slug) {
//                                return item;
//                            }
//                        }, this);
//
//                        if(projectRecords.length > 0) {
//                            var currentProject = projectRecords[0];
//                            console.log("Project exists");
//                            console.log(currentProject.data.hash);
//
//                            if(projectRecords[0].data.hash == record.data.hash) {
//                                console.log("content hash matches, no change here...");
//                            } else {
//                                console.log("content hash DOESN'T match, updating...");
//                                currentProject.set("Title", record.data.Title);
//                                currentProject.set("MetaTitle", record.data.MetaTitle);
//                                currentProject.set("Architect", record.data.Architect);
//                                currentProject.set("Contractor", record.data.Contractor);
//                                currentProject.set("Copy", record.data.Copy);
//                                currentProject.set("Slug", record.data.Slug);
//                                currentProject.set("category_id", record.data.sector[0].urlId);
//                                currentProject.set("region_id", record.data.region[0].urlId);
//                                currentProject.set("hash", record.data.hash);
//
//                                for (var i = 0; i < record.data.Image.length; i++) {
//                                    console.log("Looping through images");
//
//                                    var imageRecords = Ext.Array.filter(imageStore.data.all, function(item) {
//                                        if (item.get('Slug') == record.data.Slug) {
//                                            return item;
//                                        }
//                                    }, this);
//                                    console.log(imageRecords);
//
//                                    if(imageRecords.length > 0){
//                                        console.log("Project images exist");
//                                    } else {
//                                        console.log("Creating new image");
//                                        var new_image = Ext.create('CfaSika.model.ProjectImage', {
//                                            title: "No Title",
//                                            project_id: currentProject.getId(),
//                                            image_data: record.data.Image[i]
//                                        });
//
//                                        new_image.save({
//                                            success: function(ed) {
//                                                console.log("Saved image! It's ID is "+ new_image.getId());
//                                            }
//                                        });
//                                    }
//                                }
//                            }
//                        } else {
//                            console.log("Project does NOT exist yet");
//
//                            var new_project = Ext.create('CfaSika.model.Project', {
//                                Title: record.data.Title,
//                                MetaTitle: record.data.MetaTitle,
//                                Architect: record.data.Architect,
//                                Contractor: record.data.Contractor,
//                                Copy: record.data.Copy,
//                                Slug: record.data.Slug,
//                                category_id: record.data.sector[0].urlId,
//                                region_id: record.data.region[0].urlId,
//                                hash: record.data.hash
//                            });
//
//                            console.log(new_project);
//
//                            new_project.save({
//                                success: function(ed) {
//                                    console.log("Saved project! It's ID is "+ new_project.getId());
//                                    for (var i = 0; i < record.data.Image.length; i++) {
//                                        var new_image = Ext.create('CfaSika.model.ProjectImage', {
//                                            title: "No Title",
//                                            project_id: new_project.getId(),
//                                            image_data: record.data.Image[i]
//                                        });
//                                        new_image.save({
//                                            success: function(ed) {
//                                                console.log("Saved image! It's ID is "+ new_image.getId());
//                                            }
//                                        });
//                                    }
//                                }
//                            });
//                        }
//
//                    });
//
//                    // Sync the offline store
//                    Ext.getStore('Projects').sync();
//                    store.sync();
//
//                    // Remove data from online store
//                    onlineSync.removeAll();
//                }
//            }
//
//        });
//        onlineSync.on('load', function() {
//            console.log("onlineSync all done");
//            var store = Ext.getStore("CategoryImages");
//
//            var onlineImageSync = new Ext.data.Store({
//
//                model: "CfaSika.model.CategoryImageOnline",
//                storeId: "CategoryImageOnline",
//                proxy: {
//                    type: 'jsonp',
//                    url: 'http://sika-app.cfa-uat.com/categories/',
//                    reader: {
//                        type: 'json'
//                    }
//                },
//                autoLoad: true,
//                listeners: {
//
//                    load: function() {
//                        console.log('SYNCING CATEGORY IMAGES...');
//                        var CategoryImage = Ext.ModelMgr.getModel('CfaSika.model.CategoryImage');
//
//                        // Loop through records and fill the offline store
//
//                        // TODO: re-write this dirty hack to recurse through the results
//                        this.each(function(record) {
//
//                            console.log('Record data');
//                            console.log(record.data.children);
//
//                            for(var i=0; i < record.data.children.length; i++) {
//
//                                store.clearFilter();
//                                store.filter('category_id',record.data.children[i].urlId);
//
//                                if(store.data.all.length){
//                                    console.log('Category images : Dead end block 218, not updating existing data.');
//// Added Code
//                                    // Clear the data stores
//                                    var categoryImageStore = Ext.getStore("CategoryImages");
//                                    //console.log(categoryImageStore);
//                                    categoryImageStore.removeAll();
//                                    //categoryImageStore.sync();
//
//                                    var categoryMapStore = Ext.getStore("CategoryMaps");
//                                    //console.log(categoryMapStore);
//                                    categoryMapStore.removeAll();
//                                    //categoryMapStore.sync();
//
//                                    // Loop through records and fill the offline store again
//                                    //console.log('Got to loop through record: ' + record.data.children[i].children.length);
//
//                                    var new2_image = Ext.create('CfaSika.model.CategoryImage', {
//                                        title: record.data.children[i].Title,
//                                        category_id: record.data.children[i].urlId,
//                                        image_data: record.data.children[i].Image
//                                    });
//
//                                    new2_image.save({
//                                        success: function(ed) {
//                                            console.log("Saved category image! It's ID is " + new2_image.getId());
//                                        }
//                                    });
//
//                                    if(record.data.children[i].children !== null) {
//                                        for(var z=0; z < record.data.children[i].children.length; z++) {
//
//                                            store.clearFilter();
//                                            store.filter('category_id',record.data.children[i].children[z].urlId);
//                                            if(store.data.all.length){
//                                                console.log('Category images : Dead end block 238');
//                                            } else {
//                                                var new2_image = Ext.create('CfaSika.model.CategoryImage', {
//                                                    title: record.data.children[i].children[z].Title,
//                                                    category_id: record.data.children[i].children[z].urlId,
//                                                    image_data: record.data.children[i].children[z].Image
//                                                });
//
//                                                var new2_map = Ext.create('CfaSika.model.CategoryMap', {
//                                                    title: record.data.children[i].children[z].Title,
//                                                    category_id: record.data.children[i].children[z].urlId,
//                                                    image_data: record.data.children[i].children[z].map
//                                                });
//
//                                                new2_image.save({
//                                                    success: function(ed) {
//                                                        console.log("Saved category image! It's ID is " + new2_image.getId());
//                                                    }
//                                                });
//
//                                                new2_map.save({
//                                                    success: function(ed) {
//                                                        console.log("Saved category map! It's ID is " + new2_map.getId());
//                                                    }
//                                                });
//                                            }
//                                        }
//                                    }
//// Added code
//
//                                } else {
//                                    var new_image = Ext.create('CfaSika.model.CategoryImage', {
//                                        title: record.data.children[i].Title,
//                                        category_id: record.data.children[i].urlId,
//                                        image_data: record.data.children[i].Image
//                                    });
//
//                                    new_image.save({
//                                        success: function(ed) {
//                                            console.log("Saved category image! It's ID is " + new_image.getId());
//                                        }
//                                    });
//
//                                    if(record.data.children[i].children !== null) {
//                                        for(var j=0; j < record.data.children[i].children.length; j++) {
//
//                                            store.clearFilter();
//                                            store.filter('category_id',record.data.children[i].children[j].urlId);
//                                            if(store.data.all.length){
//                                                   console.log('Category images : Dead end block 238');
//                                            } else {
//                                                var new_image = Ext.create('CfaSika.model.CategoryImage', {
//                                                    title: record.data.children[i].children[j].Title,
//                                                    category_id: record.data.children[i].children[j].urlId,
//                                                    image_data: record.data.children[i].children[j].Image
//                                                });
//
//                                                var new_map = Ext.create('CfaSika.model.CategoryMap', {
//                                                    title: record.data.children[i].children[j].Title,
//                                                    category_id: record.data.children[i].children[j].urlId,
//                                                    image_data: record.data.children[i].children[j].map
//                                                });
//
//                                                new_image.save({
//                                                    success: function(ed) {
//                                                        console.log("Saved category image! It's ID is " + new_image.getId());
//                                                    }
//                                                });
//
//                                                new_map.save({
//                                                    success: function(ed) {
//                                                        console.log("Saved category map! It's ID is " + new_map.getId());
//                                                    }
//                                                });
//                                            }
//                                        }
//                                    }
//                                }
//                            }
//                        });
//
//                        // Sync the offline store
//                        //Ext.getStore('CategoryImages').sync();
//                        store.sync();
//
//                        // Remove data from online store
//                        onlineImageSync.removeAll();
//                    }
//                }
//
//            });
//
//            onlineImageSync.on('refresh', function() {
//                console.log("onlineImageSync all done");
//                window.location.hash = '';
//                window.location.reload();
//                //alert("onlineImageSync all done");
//            }, this, {single: true, delay: 2000});
//        }, this, {single: false});
//    },
//
//    ensureStoreLoad: function(action) {
//        var store = Ext.getStore('Categories');
//        var imageStore = Ext.getStore('CategoryImages');
//        var mapStore = Ext.getStore('CategoryMaps');
//
//        this.imageStore = imageStore;
//        this.mapStore = mapStore;
//
//        console.log("ensureStoreLoad()");
//        if(store.loaded) {
//            console.log("category loaded, yay!");
//            if (imageStore.loaded && mapStore.loaded) {
//                console.log("imageStore.loaded and mapStore.loaded resuming...");
//                action.resume();
//            } else {
//                console.log("imageStore.loaded not loaded...");
//                imageStore.on('load', function() {
//                    console.log("imageStore.loaded loaded...");
//                    mapStore.on('load', function() {
//                        console.log("mapStore.loaded loaded...");
//                        action.resume();
//                    }, this);
//                }, this, {
//                    single: true
//                });
//            }
//        } else {
//            console.log("category not loaded, boo!");
//            store.on('load', function() {
//                console.log("category FINALLY loaded, yay!");
//                if (imageStore.loaded && mapStore.loaded) {
//                    console.log("imageStore.loaded and mapStore.loaded resuming...");
//                    action.resume();
//                } else {
//                    console.log("imageStore.loaded not loaded...");
//                    imageStore.on('load', function() {
//                        console.log("imageStore.loaded loaded...");
//                        mapStore.on('load', function() {
//                            console.log("mapStore.loaded loaded...");
//                            action.resume();
//                        }, this);
//                    }, this, {
//                        single: true
//                    });
//                }
//            }, this, {
//                single: true
//            });
//        }
//    },
//
//    onMainBeforePop: function() {
//        var history = this.getApplication().getHistory(),
//            record = this.getCurrentRecord().parentNode,
//            urlId = (record && record.get('urlId')) ? record.get('urlId') : '',
//            projectView = this.projectView,
//            stack = this.getStack();
//
//        this.setCurrentRecord(record);
//
//        history.add(new Ext.app.Action({
//            url: urlId
//        }), true);
//
//        stack.pop();
//        this.setStack(stack);
//
//        if (projectView && !projectView.isHidden()) {
//            projectView.hide();
//        }
//    },
//
//    showRootCategory: function() {
//        var stack = this.getStack();
//
//        if (stack.length) {
//            this.getMain().pop();
//            return;
//        }
//
//        this.setStack([]);
//
//        var store = Ext.getStore('Categories'),
//            record = store.getRoot();
//
//        //Todo: This is causing a page transition on update, Kill it
//        this.addPreviousViews(record);
//        this.showCategory(record);
//    },
//
//    onCategoryTap: function(view, index, target, record, e) {
//        this.redirectTo(record);
//    },
//
//    showCategoryById: function(id) {
//
//        if(id == "settings"){
//            this.updateFromServer();
//        } else {
//            var store = Ext.getStore('Categories'),
//                stack = this.getStack(),
//                previousStackItem = stack[stack.length - 2],
//                records, record;
//
//            if (previousStackItem && previousStackItem == id) {
//                this.getMain().pop();
//                return;
//            }
//
//            records = Ext.Array.filter(store.data.all, function(record) {
//                if (record.get('urlId') == id) {
//                    return record;
//                }
//            }, this);
//
//            record = records[0];
//            if (record) {
//                this.addPreviousViews(record);
//
//                stack.push(id);
//                this.setStack(stack);
//
//                if (record.childNodes.length) {
//                    this.showCategory(record);
//                } else {
//                    this.showProjects(record);
//                }
//            } else {
//                Ext.Logger.warn('Category not found');
//            }
//        }
//    },
//
//    addPreviousViews: function(record) {
//        var parents = [],
//            main = this.getMain(),
//            layout = main.getLayout(),
//            animation = layout.getAnimation(),
//            stack = this.getStack(),
//            ln, i, urlId;
//
//        if (main.getInnerItems().length) {
//            return;
//        }
//
//        while ((record = record.parentNode)) {
//            parents.unshift(record);
//        }
//
//        layout.setAnimation(false);
//
//        ln = parents.length;
//        for (i = 0; i < ln; i++) {
//            urlId = parents[i].get('urlId');
//            if (urlId) {
//                stack.push(urlId);
//            }
//
//            this.showCategory(parents[i]);
//        }
//
//        this.setStack(stack);
//
//        setTimeout(function() {
//            layout.setAnimation(animation);
//        }, 50);
//    },
//
//    showCategory: function(record) {
//        var isRoot = (record.get('id') == "root"),
//            view;
//
//        if (isRoot) {
//            record.set('label', 'Categories');
//        }
//
//        this.setCurrentRecord(record);
//
//        for(var i = 0; i < record.childNodes.length; i++) {
//
//            var mapRecords = Ext.Array.filter(this.mapStore.data.all, function(img) {
//                if (img.get('category_id') == record.childNodes[i].data.urlId) {
//                    return img;
//                }
//            }, this);
//
//            if(mapRecords.length > 0) {
//                record.childNodes[i].data.map = mapRecords[0].data.image_data;
//            }
//
//            var records = Ext.Array.filter(this.imageStore.data.all, function(img) {
//                if (img.get('category_id') == record.childNodes[i].data.urlId) {
//                    return img;
//                }
//            }, this);
//
//            if(records.length > 0) {
//                record.childNodes[i].data.Image = records[0].data.image_data;
//            } else {
//                record.childNodes[i].data.Image = null;
//            }
//
//        }
//
//        view = this.getCategoriesView({
//            title: record.get('label'),
//            cls: (isRoot) ? 'root' : null,
//            data: record.childNodes
//        });
//
//        this.getMain().setActiveItem(view);
//    },
//
//    showProjects: function(record) {
//        this.setCurrentRecord(record);
//
//        var store = Ext.getStore("Projects");
//
//        store.clearFilter();
//
//        if(record.data.map !== undefined) {
//            console.log("Filtering region");
//            store.filter('region_id',record.data.urlId);
//        } else {
//            console.log("Filtering sector");
//            store.filter('category_id',record.data.urlId);
//        }
//
//        console.log(record.data.urlId);
//
//        var records = store.load({
//            callback: function(records, operation, success) {
//                // the operation object contains all of the details of the load operation
//            },
//            scope: this
//        });
//
//        //empty the store before adding the new one
//        var projectsStore = this.getProjects().getStore();
//
//        if (projectsStore) {
//            projectsStore.removeAll();
//        }
//
//        this.getProjects().setStore(records);
//
//        var map_img = this.getProjectsMap().getComponent('map');
//        var img_src = null;
//
//        if(record.get('map') !== undefined) {
//            img_src = record.get('map');
//        } else {
//            img_src = record.get('Image');
//        }
//
//        if(map_img !== undefined) {
//            map_img.setSrc(img_src);
//        } else {
//            var img = Ext.create('Ext.Img', {
//                src: img_src,
//                baseCls: 'map-img',
//                itemId: 'map'
//            });
//
//            this.getProjectsMap().add(img);
//        }
//
//        this.getMain().setActiveItem(this.projectsViewContainer);
//    },
//
//    /**
//     * Called when an item is tapped on.
//     * This is overridden in the Tablet controller
//     */
//    onProjectTap: Ext.emptyFn,
//
//    onProjectNavTap: Ext.emptyFn,
//    /**
//     * This creates and returns a new categories view, for when it is needed.
//     * Ideally this should be improved at some point to only instantiate a max of 2 views
//     * and then reuse the same views over again.
//     * @param {Object} config The configuration for the view.
//     * @return {CfaSika.view.Categories} view
//     */
//    getCategoriesView: function(config) {
//        return Ext.create('CfaSika.view.Categories', config);
//    },
//
//    /**
//     * This function is used to create and return a project view.
//     * There is a different projects view for both phone and tablet profiles, so we just have an emptyFn
//     * in this base controller, and in the tablet/phone controller we will override this.
//     * @param {Object} config The configuration for the view.
//     * @return {Ext.Component} view
//     */
//    getProjectsView: Ext.emptyFn,
//
//    /**
//     * This function is used to create and return a the project view.
//     * There is a different project view for both phone and tablet profiles, so we just have an emptyFn
//     * in this base controller, and in the tablet/phone controller we will override this.
//     * @param {Object} config The configuration for the view.
//     * @return {Ext.Component} view
//     */
//    getProjectView: Ext.emptyFn,
//});