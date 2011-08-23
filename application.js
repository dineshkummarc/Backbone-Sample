App = function() {
  new App.Router();
  Backbone.history.start({ pushState: true });
};

App.Router = Backbone.Router.extend({
  routes: {
    "":         "index",
    // "gist/new": "new",
    "gist/:id": "show",
  },

  initialize: function() {
  },

  index: function() {
    new Gists().fetch({
      success: function(collection) {
        new App.Views.List({ collection: collection }).render();
      },
      
    });
  },

  // new: function() {
  // },

  show: function() {
  }
});

App.Views = {
  List: Backbone.View.extend({
    tagName: "ul",

    render: function() {
      var el = this.el;
      $('#content').html(el);

      this.collection.forEach(function(item) {
        $(el).append((new App.Views.GistSummary({ model: item })).render());
      });

      return this.el;
    }
  }),

  GistSummary: Backbone.View.extend({
    tagName: "li",

    render: function() {
      $(this.el).html(Milk.render('<a href="/gist/{{id}}">{{description}}</a>', this.model));
      return this.el;
    },
  }),
};

Gist = Backbone.Model.extend({
  description: function() {
    return this.get('description') || 'Gist #' + this.id;
  },
});

Gists = Backbone.Collection.extend({
  url: 'https://api.github.com/gists',
  model: Gist,
});
