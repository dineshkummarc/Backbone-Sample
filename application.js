App = function() {
  new App.Router().bind('route', function() {
    $('#content').html('');
    App.periodic && clearInterval(App.periodic);
  });
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
    var view = new App.Views.List();
    view.collection = new Gists();
    view.collection.bind('reset', view.render, view);
    view.collection.fetch();
    $('#content').html(view.el);

    App.periodic = function() { view.collection.fetch() };
    setInterval(App.periodic, 5000);
  },

  // new: function() {
  // },

  show: function(id) {
    var view = new App.Views.Gist();
    view.model = new Gist({ id: id });
    view.model.bind('change', view.render, view);
    view.model.fetch();
    $('#content').html(view.el);

    App.periodic = function() { view.model.fetch() };
    setInterval(App.periodic, 5000);
  },
});

App.Views = {
  List: Backbone.View.extend({
    tagName: "ul",

    render: function() {
      var el = this.el;
      $(el).empty();

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
