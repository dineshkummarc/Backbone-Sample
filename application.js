App = function() {
  new App.Router();
  Backbone.history.start({ pushState: true });
};

App.Router = Backbone.Router.extend({
  routes: {
    "":         "index",
    "gist/new": "new",
    "gist/:id": "show",
  },

  initialize: function() {
  },

  index: function() {
  },

  new: function() {
  },

  show: function() {
  }
});


