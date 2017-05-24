define(function(require, exports, module) {
  $.root_ = $('.account_main');
  module.exports = {
    init: function() {
      this._bindUI();
      this._main();
    },
    _main: function() {
    },
    _bindUI: function() {
      $.root_.off('click', '.service_tel').on('click', '.service_tel', function(e) {

      })
      $.root_.off('click', '.feedback').on("click", '.feedback', function(e) {

      })
    }
  };
})