define(function(require, exports, module) {
  $.root_ = $('.remote_main');

  var _initX; //触摸位置
  var _nowTouchObj; //目标对象
  var _beforeTouchObj; //上一个对象

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
        var rowobj = $(this);
        $('.remote_add_mask').show();
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.remote_update').on('click', '.remote_update', function(e) {
        var rowobj = $(this);
        $('.remote_add_mask').show();
        touchRest(rowobj);
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.remote_del').on('click', '.remote_del', function(e) {
        var rowobj = $(this);
        // var gameid = rowobj.data("gameid");
        // deleteServer();
        touchRest(rowobj);
        e.preventDefault();
        rowobj = null;
      })

      $.root_.off('click', '.game_download_btn').on("click", '.game_download_btn', function(e) {
        var name = 'game_download';
        activeBtn(name);
        $('div.game_download_block').show();
      })

      $('.remote_list').on('touchstart', function(e) {
        //判断是否只有一个触摸点
        if (e.changedTouches.length == 1) {
          var moveMax = $('.remote_tools').width(); //按钮区域宽度
          var movePadding = parseFloat($('.remote_tools').css('padding-left'));

          _nowTouchObj = $(e.target.parentNode.parentNode.parentNode);

          if (_beforeTouchObj && _nowTouchObj.is(".list-li") && !_nowTouchObj.is(".touched")) {
            _beforeTouchObj.css('-webkit-transform', "translateX(0px)");
            _beforeTouchObj.removeClass('touched');
          }
          //记录触摸起始位置的X坐标
          _initX = e.changedTouches[0].clientX;
          if (_nowTouchObj.is(".list-li")) {
            _nowTouchObj.addClass('touched');
          }
          _nowTouchObj.off('touchend').on('touchend', function(e) {
            if (e.changedTouches.length == 1) {
              //手指移动结束后触摸点位置的X坐标
              var endX = e.changedTouches[0].clientX;
              //触摸开始与结束，手指移动的距离
              var disX = _initX - endX;
              //如果距离小于删除按钮的1/2，不显示删除按钮
              var txtStyle = disX > (moveMax / 2 + movePadding) ? -moveMax : 0;

              if (_nowTouchObj.is(".list-li")) {
                _nowTouchObj.css('-webkit-transform', "translateX(" + txtStyle + "px)");
                _beforeTouchObj = _nowTouchObj;

              }
              // $('.remote_list_block').css('overflow-y', 'auto');
            }
          })
        }
      })

      $('.remote_list').on('touchmove', function(e) {
        if (e.changedTouches.length == 1) {
          var moveMax = $('.remote_tools').width(); //按钮区域宽度
          var movePadding = parseFloat($('.remote_tools').css('padding-left'));
          var moveX = e.changedTouches[0].clientX;
          //计算手指起始点的X坐标与当前触摸点的X坐标的差值
          var disX = _initX - moveX;
          var cssLeft = parseFloat(_nowTouchObj.css('left'));

          if (disX > movePadding) {
            // $('.remote_list_block').css('overflow-y', 'hidden');
          }

          var txtStyle = 0;
          if (disX < 0) {
            txtStyle = (Math.abs((disX + cssLeft)));
            if (txtStyle > 0) {
              txtStyle = "0";
            }
          } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
            txtStyle = parseFloat(-disX);
            if (txtStyle <= parseFloat(-moveMax)) {
              //控制手指移动距离最大值为删除按钮的宽度
              txtStyle = -moveMax;
            }
          }

          if (_nowTouchObj.is(".list-li")) {
            _nowTouchObj.css('-webkit-transform', "translateX(" + txtStyle + "px)");
          }
        }
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

  function deleteServer() {
    alert('Delete success!');
  }

  function touchRest(rowobj) {
    rowobj.parent().parent().css('-webkit-transform', "translateX(0px)");
    rowobj.parent().parent().removeClass('touched');
  }

  function buildRemoteList() {
    var html = "";
    html += '<a href="javascript:void(0)" class="center-block add_remote"><i>' + '<svg class="svg_icon" viewBox="0 0 1024 1024">' + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add_remote_svg"></use>' + '</svg></i><span>添加服务器</span></a><ul>';

    for (var i = 0; i < 20; i++) {
      html += '<li class="list-li"><a href="javascript:void(0)" class="remote_choose"><i>' + '<svg class="svg_icon" viewBox="0 0 1024 1024">' + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#remote_server_svg"></use>' + '</svg></i><ul><li>远程服务器' + i + '号</li><li>192.168.1.10</li></ul>' + '</a><div class="remote_tools"><a href="javascript:void(0);" class="remote_update">修改</a><a href="javascript:void(0);" class="remote_del">删除</a></div></li>';
    }

    html += '</ul>';

    $('div.remote_list').append(html);
  }
})
