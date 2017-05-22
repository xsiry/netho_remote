define(function(require, exports, module) {
  $.root_ = $('.account_main');
  module.exports = {
    init: function() {
      this._bindUI();
      this._buildList();
      this._main();
    },
    _main: function() {
    },
    _bindUI: function() {
      $.root_.off('click', '.account_mnt').on('click', '.account_mnt', function(e) {

      })
      $.root_.off('click', '.service_tel').on('click', '.service_tel', function(e) {

      })
      $.root_.off('click', '.feedback').on("click", '.feedback', function(e) {

      })
    },
    _buildList: function() {
      // buildRemoteList();
    }
  };

  function buildRemoteList() {
    var html = "";
    html += '<a href="javascript:void(0)" class="center-block add_account"><i>'
    +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
    +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add_remote_svg"></use>'
    +  '</svg></i><span>添加员工账号</span></a><ul>';

    for (var i = 0; i < 20; i++) {
      html += '<li class="list-li"><a href="javascript:void(0)" class="remote_choose"><i>'
           +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
           +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#remote_server_svg"></use>'
           +  '</svg></i><ul><li>员工姓名'+i+'号</li><li>192.168.1.10</li></ul>'
           +  '</a><div class="remote_tools"><a href="javascript:void(0);" class="remote_update">修改</a><a href="javascript:void(0);" class="remote_del">删除</a></div></li>';
    }

    html += '</ul>';

    $('div.remote_list').append(html);
  }
})