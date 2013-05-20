MyApp = new Backbone.Marionette.Application();

MyCollection = Backbone.Collection.extend({
    url : './assets/json/sample.json'
})

var rm = new Marionette.RegionManager();

var regions = rm.addRegions({
   mainRegion : '#content',
   headerRegion : '#header',
   wrapperRegion : '#wrapper',
   footerRegion : '#footer'
});


// MyApp.addRegions({
//     mainRegion : '#content',
//     headerRegion : '#header',
//     wrapperRegion : '#wrapper',
//     footerRegion : '#footer'
// });



HeaderView = Backbone.Marionette.CompositeView.extend({
    template : '#header-tmpl'
});

FooterView = Backbone.Marionette.CompositeView.extend({
    template : '#footer-tmpl'
});

AngryCatView = Backbone.Marionette.ItemView.extend({

  template: "#cat-tmpl",
  tagName: 'tr',
  className: 'angry_cat',

  events  : {
      'click .btn-danger' : 'removeElement'
  },

  removeElement : function() {
    
    window.router.navigate("about" , {trigger: true});
    return false;
  }
  
});


AngryCatsView = Backbone.Marionette.CompositeView.extend({

    tagName : 'table',
    id: "angry_cats",
    className: "table-striped table-bordered",
    template: "#angry_cats-template",
    itemView: AngryCatView,

    initialize : function() {
      //this.listenTo();
    },

    onCompositeCollectionRendered : function() {
        console.log("collection rendered");
    },

    onRender : function() {
        console.log("on render");
    },

    appendHtml: function(collectionView, itemView, index){
      collectionView.$('tbody').append(itemView.el);
    }


}); 

ModalView = Backbone.Marionette.CompositeView.extend({

    tagName : 'div',
    className : 'modal hide fade',
    template : '#modal-tmpl'
    
});


WrapperLayout = Backbone.Marionette.Layout.extend({

    className : 'clearfix',
    template: "#wrapper-region-tmpl",
 
    regions: {
      content: ".wrapper-content",
      anotherRegion: ".wrapper-content-add"
    }

});



MyApp.addInitializer(function(options) {

  
  window.router = new MyAppRouter();
  //Backbone.history.start();


});
  
MyApp.on("initialize:before", function(options){    //fired just before the initializers kick off
    
});

MyApp.on("initialize:after", function(){    //fires just after the initializers have finished
    if (Backbone.history){
        Backbone.history.start();
    }
});

MyApp.on("start", function(){     //fires after all initializers and after the initializer events
    console.log("app started");
});

var MyAppRouter = Backbone.Router.extend({

  routes: {
    "" : "renderApp",
    "about": "aboutApp"
  },

  renderApp : function() {
    
    //Show the header
    regions.headerRegion.show(new HeaderView());

    //Show the content Layout
    var contentLyt = new WrapperLayout();
    regions.wrapperRegion.show(contentLyt);
    

    var catCollection = new MyCollection();
    contentLyt.content.show(new AngryCatsView({collection : catCollection}));
    catCollection.fetch();

    regions.footerRegion.show(new FooterView());
  },
 
  aboutApp: function(){
    alert("By Chetan");
    
  }
});

MyApp.start();

