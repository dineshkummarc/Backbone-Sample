App = function() {
  new App.Router().bind('route', function() { App.periodic && clearInterval(App.periodic) });
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

  show: function(id) {
    new Gist({ id: id }).fetch({
      success: function(model) {
        new App.Views.Gist({ model: model }).render();
      },
    });
  },
});

App.Views = {
  List: Backbone.View.extend({
    tagName: "ul",

    initialize: function(options) {
      $('#content').html(this.el);
      this.collection.bind('reset', this.render, this);

      App.periodic = function() { options.collection.fetch() };
      setInterval(App.periodic, 5000);
    },

    render: function() {
      var el = this.el;
      $(el).html('');

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

  Gist: Backbone.View.extend({
    initialize: function(options) {
      $('#content').html(this.el);
    },

    render: function() {
      var el = this.el;
      $(el).html(Milk.render($('#gist-template').html(), this.model));

      _.values(this.model.get('files')).forEach(function(file) {
        $(el).append(Milk.render($('#file-template').html(), file));
      });

      return this.el;
    },
  }),
};

Gist = Backbone.Model.extend({
  urlRoot: 'https://api.github.com/gists',
  description: function() {
    return this.get('description') || 'Gist #' + this.id;
  },
});

Gists = Backbone.Collection.extend({
  url: 'https://api.github.com/gists',
  model: Gist,
});
