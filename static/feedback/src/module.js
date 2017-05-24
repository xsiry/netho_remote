define(function(require, exports, module) {
  $.root_ = $('#loginFrom');
  module.exports = {

    init: function() {
      this._bindUI();
      inputValidator();
    },
    _bindUI: function() {
      $.root_.off('click', '.subimt_btn').on('click', '.subimt_btn', function() {
        loginSubmit();
      })
    },
  };

  })
