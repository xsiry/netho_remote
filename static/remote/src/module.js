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
    html += '<a href="javascript:void(0)"><div class="center-block add_remote"><i>'
    +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
    +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add_remote_svg"></use>'
    +  '</svg></i><span>添加服务器</span></div></a><ul>';

    for (var i = 0; i < 20; i++) {
      html += '<li><a href="javascript:void(0)" class="remote_choose"><div><i>'
           +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
           +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#remote_server_svg"></use>'
           +  '</svg></i><span>远程服务器'+i+'号</span>'
           +  '</div></a></li>';
    }

    html += '</ul>';

    $('div.remote_list').append(html);
  }
})