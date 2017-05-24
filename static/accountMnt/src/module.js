define(function(require, exports, module) {
  $.root_ = $('.account_main');

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
    },
    _bindUI: function() {
      $.root_.off('click', '.add_account').on('click', '.add_account', function(e) {
        var rowobj = $(this);
        $('.add_account_mask').show();
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.account_update').on("click", '.account_update', function(e) {
        var rowobj = $(this);
        $('.add_account_mask').show();
        e.preventDefault();
        rowobj = null;
      })
      $('.account_list').on('touchstart', function(e) {
        //判断是否只有一个触摸点
        if (e.changedTouches.length == 1) {
          var moveMax = $('.account_tools').width(); //按钮区域宽度
          var movePadding = parseFloat($('.account_tools').css('padding-left'));

          _nowTouchObj = $(e.target.parentNode);

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
              // $('.account_list_block').css('overflow-y', 'auto');
            }
          })
        }
      })

      $('.account_list').on('touchmove', function(e) {
        if (e.changedTouches.length == 1) {
          var moveMax = $('.account_tools').width(); //按钮区域宽度
          var movePadding = parseFloat($('.account_tools').css('padding-left'));
          var moveX = e.changedTouches[0].clientX;
          //计算手指起始点的X坐标与当前触摸点的X坐标的差值
          var disX = _initX - moveX;
          var cssLeft = parseFloat(_nowTouchObj.css('left'));

          if (disX > movePadding) {
            // $('.account_list_block').css('overflow-y', 'hidden');
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
      buildList();
    }
  };

  function buildList() {
    var html = "";
    html += '<div class="center-block account_title">员工列表</div><a href="javascript:void(0)" class="center-block add_account"><i>'
    +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
    +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add_remote_svg"></use>'
    +  '</svg></i><span>添加员工账号</span></a><ul>';
 
    for (var i = 0; i < 20; i++) {
      html += '<li class="list-li"><a href="javascript:void(0)" class="account_choose"><i>'
           +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
           +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#account_svg"></use>'
           +  '</svg></i><span>员工姓名'+i+'号</span>'
           +  '<i class="pull-right"><svg class="svg_icon" viewBox="0 0 1024 1024">'
           +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#right_svg"></use>'
           +  '</svg></i></a>'
           +  '<div class="account_tools"><a href="javascript:void(0);" class="account_update">修改</a><a href="javascript:void(0);" class="account_del">删除</a></div></li>';
    }

    html += '</ul>';

    $('div.account_list').append(html);
  }
})