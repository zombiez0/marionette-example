var App = {};

App = {
    Layout : {}

}

MyApp = new Backbone.Marionette.Application();

TeamModel = Backbone.Model.extend({

  initialize : function() {
    console.log("model init");
  }

});

MyCollection = Backbone.Collection.extend({

    model : TeamModel,
    url : './assets/api/index.php/teams'
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
    console.log(this.model);
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
        console.log(this.$el);
    },

    appendHtml: function(collectionView, itemView, index){
      collectionView.$('tbody').append(itemView.el);
    }


}); 


ModalView = Backbone.Marionette.CompositeView.extend({

    tagName : 'div',
    className : 'modal hide fade',
    template : '#modal-tmpl',

    onRender : function() {
        this.$el.find('.modal-body').html(this.ModalBodytemplate);
    },

    onShow : function() {
        this.$el.modal('show');
        this.$el.parent().show();
    }

});

AddTeamModalView = ModalView.extend({

    ModalBodytemplate: _.template($('#new-team-inp-tmpl').html()),

    events : {
        'click .x' : 'hello',
        'click a' : 'handleAnchor'
    },

    handleAnchor : function(e) {
        e.preventDefault();
    },

    hello : function() {
        alert("sdgd");
        console.log(this.model);
    },



    serializeData : function() {
      return {
          "headerTxt" : 'Add a new Team!',
          "buttons" : {
              'closeBtn' : true,
              'saveBtn' : true
          }
      }
    }
    
});


AddTeamView = Backbone.Marionette.CompositeView.extend({

    template : '#add-team-tmpl',
    tagName : 'div',
    className : 'add-team',

    events : {
        'click #add-team-btn' : 'showAddTeamModal'
    },

    showAddTeamModal : function() {
        window.router.navigate("addTeam" , {trigger: true});
    }

});


WrapperLayout = Backbone.Marionette.Layout.extend({

    className : 'clearfix',
    template: "#wrapper-region-tmpl",
 
    regions: {
      contentRegion: ".wrapper-content",
      modalRegion : ".wrapper-modal",
      addTeamRegion: ".wrapper-content-add",
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
    "addTeam" : "renderAddTeamModal",
    "about": "aboutApp"
  },

  renderApp : function() {
    
    //Show the header
    regions.headerRegion.show(new HeaderView());

    //Show the content Layout
    App.Layout.ContentLyt = new WrapperLayout();
    regions.wrapperRegion.show(App.Layout.ContentLyt); 
    

    var catCollection = new MyCollection();
    App.Layout.ContentLyt.contentRegion.show(new AngryCatsView({collection : catCollection}));
    App.Layout.ContentLyt.addTeamRegion.show(new AddTeamView());
    catCollection.fetch();

    regions.footerRegion.show(new FooterView());
  },

  renderAddTeamModal : function() {

    App.Layout.ContentLyt.modalRegion.show(new AddTeamModalView());
    
  },
 
  aboutApp: function(){
    alert("By Chetan");
  },

  
  

});

MyApp.start();

