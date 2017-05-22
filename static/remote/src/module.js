define(function(require, exports, module) {
  $.root_ = $('.remote_main');
  module.exports = {
    init: function() {
      this._bindUI();
      this._buildList();
      this._main();
    },
    _main: function() {
      $('.open_remote_btn').click();
    },
    _bindUI: function() {
      $.root_.off('click', '.open_remote_btn').on('click', '.open_remote_btn', function(e) {
        var name = 'open_remote';
        activeBtn(name);
        $('div.remote_list_block').show()
      })
      $.root_.off('click', '.add_remote').on('click', '.add_remote', function(e) {
        $('.remote_add_mask').show();
      })
      $.root_.off('click', '.game_download_btn').on("click", '.game_download_btn', function(e) {
        var name = 'game_download';
        activeBtn(name);
        $('div.game_download_block').show();
      })
    },
    _buildList: function() {
      buildRemoteList();
    }
  };

  function activeBtn(name) {
    $('div.remote_list_block').hide();
    $('div.game_download_block').hide();
    $('div.tbtn').css('color', '#000').css('border', '0');
    $('div.' + name + '_btn').css('color', '#43b2e7').css('border-bottom', '0.5rem solid #43b2e7');
  }

  function buildRemoteList() {
    var html = "";
    html += '<a href="javascript:void(0)" class="center-block add_remote"><i>'
    +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
    +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add_remote_svg"></use>'
    +  '</svg></i><span>添加服务器</span></a><ul>';

    for (var i = 0; i < 20; i++) {
      html += '<li class="list-li"><a href="javascript:void(0)" class="remote_choose"><i>'
           +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
           +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#remote_server_svg"></use>'
           +  '</svg></i><ul><li>远程服务器'+i+'号</li><li>192.168.1.10</li></ul>'
           +  '</a><div class="remote_tools"><a href="javascript:void(0);" class="remote_update">修改</a><a href="javascript:void(0);" class="remote_del">删除</a></div></li>';
    }

    html += '</ul>';

    $('div.remote_list').append(html);
  }
})