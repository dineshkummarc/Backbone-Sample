App = function() {
  new App.Router().bind('route', function() {
    $('#content').html('');
  });

  Backbone.history.start({ pushState: true });
};

var view;
setInterval(function() { view.periodic && view.periodic() }, 5000)

App.Router = Backbone.Router.extend({
  routes: {
    "":         "index",
    // "gist/new": "new",
    "gist/:id": "show",
  },

  initialize: function() {
    App.Router.PageView = new App.Views.Page();
    App.Router.ListView = new App.Views.List();
    App.Router.GistView = new App.Views.Gist();
  },

  index: function() {
    view = App.Router.ListView;
    $('#content').html(view.el);

    view.collection.fetch();
  },

  // new: function() {
  // },

  show: function(id) {
    view = App.Router.GistView;
    $(view.el).empty();
    $('#content').html(view.el);

    view.model.id = id;
    view.model.fetch({
      error: function() {
        var tmpl = '<div class="alert-message error clear">{{.}}</div>';
        var err = $(Milk.render(tmpl, 'Could not load Gist "' + id + '"'));
        err.hide().insertBefore($('#content')).slideDown().delay(3000).slideUp();
        Backbone.history.navigate('', true);
      },
    });
  },
});

App.Views = {
  Page: Backbone.View.extend({
    el: "body",
    events: { 'submit form': 'lookupGist' },
    lookupGist: function(e) {
      Backbone.history.navigate('gist/' + this.$('input').val(), true);
      this.$('input').val('');
      return false;
    },
  }),

  List: Backbone.View.extend({
    tagName: "ul",

    initialize: function() {
      this.collection = new Gists();
      this.collection.bind('reset', this.render, this);
    },

    periodic: function() {
      this.collection.fetch();
    },

    render: function() {
      var el = this.el;
      $(el).empty();

      this.collection.forEach(function(item) {
        $(el).append((new App.Views.GistSummary({ model: item })).render());
      });

      return this.el;
    },
  }),

  GistSummary: Backbone.View.extend({
    tagName: "li",

    render: function() {
      $(this.el).html(Milk.render('<a href="/gist/{{id}}">{{description}}</a>', this.model));
      return this.el;
    },
  }),

  Gist: Backbone.View.extend({
    initialize: function() {
      this.model = new Gist();
      this.model.bind('change', this.render, this);
    },

    periodic: function() {
      this.model.fetch();
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
