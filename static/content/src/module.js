define(function(require, exports, module) {
  $.root_ = $('body');
  var _qhstrParams, _netbarlist, _tabLoadEnd, _activate;

  module.exports = {
    init: function() {
      this._bindUI();
      this._buildMenu();
      this._main();
    },
    _main: function() {
      relogin();
    },
    _bindUI: function() {
      $.root_.off('click', '.remote_bbtn').on('click', '.remote_bbtn', function(e) {
        var name = 'remote';
        $('.netbar_list_btn').show();
        activeBtn(name);
      })
      $.root_.off('click', '.account_bbtn').on("click", '.account_bbtn', function(e) {
        var name = 'account';
        $('.netbar_list_mask').hide();
        $('.netbar_list_btn').hide();
        activeBtn(name);
      })
      $.root_.off('click', '.netbar_choose').on("click", '.netbar_choose', function(e) {
        var rowobj = $(this);
        var netbarid = rowobj.data("netbarid");
        _netbarid = netbarid;
        $('.remote_bbtn').click();
        $('.netbar_list_mask').hide();
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('input propertychange', '.input_search').on("input propertychange", '.input_search', function(e) {
          _tabLoadEnd = false;
          if (_netbarlist != null) {
            var netbarname = $('.input_search').val();
            _qhstrParams = {"qjson":[{},{"netbarname": netbarname}],"qjsonkeytype":[{"netbarname":"LIKE_ALL"}]}
            $(".page_no").val(1);
            $('.netbar_block section ul').empty();
            _netbarlist.unlock();
            _netbarlist.noData(false);
            _netbarlist.resetload();
            return;
          };
          buildNetbarList(true);
          $('div.netbar_list ul').empty();
      })
      $.root_.off('click', '.open_netbar_list').on("click", '.open_netbar_list', function(e) {
          $('.netbar_list_mask').show();
      })
      $.root_.off('click', '.account_mnt').on('click', '.account_mnt', function(e) {
        loadURL('../apps/accountMnt.html');
      })
      $.root_.off('click', '.feedback').on('click', '.feedback', function(e) {
        loadURL('../apps/feedback.html');
      })

      /* 远程桌面 */
      $('#remote_desktop').on('load', function(e) {
        setTimeout(function() {
          $('#remote_desktop').contents().find('#relative').trigger('click');
          $('#remote_desktop').contents().find('#ime-none').trigger('click');
          if (!$('#remote_desktop').contents().find('#auto-fit').is(':checked')) {
            $('#remote_desktop').contents().find('#auto-fit').trigger('click');
          }
        }, 2000);

        $('#remote_desktop').contents().one('DOMNodeInserted', 'div.buttons', function(e) {
          var rowobj = $(this);
          $('#remote_desktop').contents().find('.logout').hide();
          rowobj.empty().append('<button ng-class="action.className" class="ng-binding ng-scope logout button x_remote_logout">退出</button>');

          rowobj.find('.x_remote_logout').off('click').on('click', function(o) {
            $('.x_login_out').trigger('click');
            o.preventDefault();
          });
          e.preventDefault();
          rowobj = null;
        })
        e.preventDefault();
      })

      // 菜单
      $.root_.off('click', '.menus_switch').on('click', '.menus_switch', function(e) {
        var rowobj = $(this);
        if ($('.remote_desktop_menus').is('.x_hide')) {
          $('.remote_desktop_menus').removeClass('x_hide').addClass('x_show').find('.menus_switch .svg_icon').addClass('reverse_svg');
        }else {
          $('.remote_desktop_menus').removeClass('x_show').addClass('x_hide').find('.menus_switch .svg_icon').removeClass('reverse_svg');
        }
        e.preventDefault();
        rowobj = null;
      })
      // 鼠标模式
      $.root_.off('change', 'input:radio[name="touchedMode"]').on('change', 'input:radio[name="touchedMode"]', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#' + rowobj.val()).trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 键盘模式
      $.root_.off('change', 'input:radio[name="imeMode"]').on('change', 'input:radio[name="imeMode"]', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#' + rowobj.val()).trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 自适应窗口
      $.root_.off('change', 'input:checkbox[name="fitMode"]').on('change', 'input:checkbox[name="fitMode"]', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#' + rowobj.val()).trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 缩小
      $.root_.off('click', '.x_zoom_out').on('click', '.x_zoom_out', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#zoom-out').trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 放大
      $.root_.off('click', '.x_zoom_in').on('click', '.x_zoom_in', function(e) {
        var rowobj = $(this);
        $('#remote_desktop').contents().find('#zoom-in').trigger('click');
        e.preventDefault();
        rowobj = null;
      })
      // 退出远程
      $.root_.off('click', '.x_login_out').on('click', '.x_login_out', function(e) {
        var rowobj = $(this);
        $('.remote_desktop_block').hide();
        $.ajax({
          type: 'GET',
          url: 'http://www.yun58.vip:8086/remotehost/api/tokens/del',
          dataType: 'json',
          success: function(msg) {
            $('.remote_desktop_menus').removeClass('x_show').addClass('x_hide').find('.menus_switch .svg_icon').removeClass('reverse_svg');
            $('#remote_desktop').empty();
            $('#remote_desktop').attr('src', "about:blank");
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50)
              + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
          }
        });
        e.preventDefault();
        rowobj = null;
      })
    },
    _buildMenu: function() {
      buildMenu();
      buildNetbarList();
    }
  };

  function buildNetbarList(searchBool) {
    if (!searchBool) {
      _qhstrParams = { qjson: [{}]};
      var html = "";
      html += '<div class="form-group has-feedback search_block">'
           + '<input type="search" class="form-control input_search" placeholder="搜索">'
           + '<span class="glyphicon glyphicon-search form-control-feedback icon" aria-hidden="true"></span>'
           + '</div><ul></ul>';

      $('section.netbar_list').append(html);
    }
    _netbarlist = $('.netbar_block').dropload({
      domDown: {
        domClass: 'dropload-down',
        domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
        domNoData: '<div class="dropload-noData">已无数据</div>'
      },
      loadDownFn: function(me) {
        $.ajax({
          type: 'GET',
          url: _addr + 'ywh_queryTableList/?',
          data: {
            source: 'netbar_info',
            page: $(".page_no").val(),
            pagesize: 20,
            qhstr: JSON.stringify(_qhstrParams),
            sortname: 'netbarname',
            sortorder: 'ASC'
          },
          dataType: 'json',
          success: function(data) {
            var list = data.Rows;
            if (list == null) {
              $(".page_no").val(parseInt($(".page_no").val()) - 1);
            };
            if (list.length == 0) {
              _tabLoadEnd = true;
            }
            $('.netbar_block').show();
            setTimeout(function() {
              if (_tabLoadEnd) {
                me.resetload();
                me.lock();
                me.noData();
                me.resetload();
                return;
              }
              var result = ''
              for (var i = 0; i < list.length; i++) {
                result += '<li><a href="javascript:void(0)" class="netbar_choose" data-netbarid=' + list[i].netbarid + '><i>'
                     + '<svg class="svg_icon" viewBox="0 0 1024 1024">'
                     + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#remote_svg"></use>'
                     + '</svg></i><span>' + list[i].netbarname + '</span>'
                     + '<i class="pull-right"><svg class="svg_icon" viewBox="0 0 1024 1024">'
                     + '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#right_svg"></use></svg></i></a></li>';
              }
              $('section.netbar_list ul').append(result);
              me.resetload();
            }, 300);
            $(".page_no").val(parseInt($(".page_no").val()) + 1);

          },
          error: function() {
            loading = true;
            $(".page_no").val(parseInt($(".page_no").val()) - 1);
            console.log("查询数据出错啦，请刷新再试");
          }
        });
      }
    });
  }

  function buildMenu() {
    var menus = [{
      name: 'remote',
      text: '远程'
    }, {
      name: 'account',
      text: '我的'
    }]

    var html = '';
    for (var i in menus) {
      var m = menus[i];
      html += '<a href="javascript:void(0);" class="' + m.name + '_bbtn icon_' + m.name + '_svg">';
      html += '<i><svg class="svg_icon" viewBox="' + (m.name == 'account' ? '0 0 48 48' : "0 0 1024 1024") + '" ' + (m.name == 'account' ? 'style="width: 22px;"' : '') + '>'
           +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#_yun_'+ m.name +'_svg"></use>'
           +  '</svg></i><p style="color: #82858B">' + m.text + '</p></a>';
    }

    $('div.menus').append(html);
    activeBtn('remote');
  }

  function activeBtn(name) {
    $('.icon_'+ _activate +'_svg i').empty().append('<svg class="svg_icon" ' + (_activate == 'account' ? 'style="width: 22px;"' : '') + ' viewBox="' + (_activate == 'account' ? '0 0 48 48' : "0 0 1024 1024") + '"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#_yun_' + _activate + '_svg"></use></svg>');
    $('.icon_' + name + '_svg i').empty().append('<svg class="svg_icon" ' + (name == 'account' ? 'style="width: 22px;"' : '') + ' viewBox="' + (name == 'remote' ? '0 0 48 48' : "0 0 1024 1024") + '"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#yun_' + name + '_svg"></use></svg>');
    $('div.menus p').css('color', '#82858B');
    $('div.menus a.' + name + '_bbtn p').css('color', '#43b2e7');
    _activate = name;
    if (name == 'remote' && !_netbarid) {
      $('.open_netbar_list').trigger('click');
      return;
    };
    loadURL('../apps/' + name + '.html');
  }

  function loadURL(a) {
    var b = $('div.content');
    $.ajax({
      "type": "GET",
      "url": a,
      "dataType": "html",
      "cache": !0,
      "beforeSend": function() {
        b.removeData().html(""),
          b.html('<div class="dropload-load"><span class="loading"></span>加载中...</div>'),
          b[0] == $("#content")[0] && ($("body").find("> *").filter(":not(" + ignore_key_elms + ")").empty().remove(),
            drawBreadCrumb(),
            $("html").animate({
              "scrollTop": 0
            }, "fast"))
      },
      "success": function(a) {
        b.css({
            "opacity": "0.0"
          }).html(a).delay(50).animate({
            "opacity": "1.0"
          }, 300),
          a = null,
          b = null
      },
      "error": function(c, d, e) {
        b.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error requesting <span class="txt-color-red">' + a + "</span>: " + c.status + ' <span style="text-transform: capitalize;">' + e + "</span></h4>")
      },
      "async": !0
    })
  }

  function loginOut() {
    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: '/wxroot/loginOut.do',
      dataType: 'json',
      success: function(data) {
        if (data) {
          location.href = "/wxroot/login.html";
        }
      },
      error: function(e) {}
    });
  }

  function relogin() {
    $(document).ajaxComplete(function(event, xhr, settings) {
      if (xhr.getResponseHeader("sessionstatus") == 'timeout') {
        $('.noping_msg').show();
      }
    })
  }
})
