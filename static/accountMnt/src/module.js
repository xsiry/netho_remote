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
      inputValidator();
      $('.parentid').val(_admin_id);
    },
    _bindUI: function() {
      $.root_.off('click', '.add_account').on('click', '.add_account', function(e) {
        var rowobj = $(this);
        $('.account_list_block').css('overflow-y', 'hidden');
        $('.add_account_mask').show();
        $('.add_account_block').animate({ scrollTop: 0 }, 0);
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.btn_submit').on('click', '.btn_submit', function(e) {
        var rowobj = $(this);
        add();
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.account_update').on('click', '.account_update', function(e) {
        var rowobj = $(this);
        update(rowobj);
        touchRest(rowobj);
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.account_del').on('click', '.account_del', function(e) {
        var rowobj = $(this);
        del(rowobj);
        touchRest(rowobj);
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
      buildList(true);
      reqGroups();
    }
  };

  function inputValidator() {
    $('.add_form').bootstrapValidator({
      message: '该项不能为空',
      fields: {
        sysname: {
          message: '请输入员工姓名',
          validators: {
            notEmpty: {
              message: '请输入员工姓名'
            }
          }
        },
        username: {
          message: '请输入登陆账号',
          validators: {
            notEmpty: {
              message: '请输入登陆账号'
            }
          }
        },
        pswd: {
          validators: {
            notEmpty: {
              message: '请输入登陆密码'
            }
          }
        }
      }
    });
  }

  function add() {
    var valid = $(".add_form").data('bootstrapValidator').isValid();
    if (valid == false) {
      $(".add_form").data('bootstrapValidator').validate();
      return;
    }
    $('.qrpswd').val($('.pswd').val());
    var formArr = $('.add_form').serializeArray();
    var values = {};
    var sysusergroupsArr = [];
    var authorityArr = [];

    values['ustate'] = $('#ustate').checked ? 1 : 2;

    $.each(formArr, function(i, o) {
        if(o.name == "group[]") {
          sysusergroupsArr.push(o.value);
        }else if(o.name == "authority[]") {
          authorityArr.push(o.value);
        }else if(o.name == "ustate") {
          values[o.name] = o.value == 'on' ? 1 : 2;
        }else {
          values[o.name] = o.value;
        }
    });

    values['sysusergroups'] = sysusergroupsArr.join(';');
    values['authority'] = authorityArr.join(';');

    $.ajax({
      type: 'POST',
      url: _addr + 'ywh_saveAction/?',
      data: {
        actionname: 'sys_user',
        datajson: JSON.stringify(values),
        operjson: JSON.stringify({"opertype":["updateInfo"]})
      },
      dataType: 'json',
      success: function(msg) {
        buildList(false);
        $('.account_list_block').css('overflow-y', 'scroll');
        $('div.add_account_mask').hide();
        $('div.add_account_mask form')[0].reset();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50) + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
      }
    });
  }

  function update(rowobj) {
    var sysusid = rowobj.data("sysusid");

    $.ajax({
      type: 'GET',
      url: _addr + 'ywh_queryTableList/?',
      data: {
        source: 'sys_user',
        sourceid: sysusid
      },
      dataType: 'json',
      success: function(msg) {
        $.each(msg, function(k, v) {
          if (k == "sysusergroups") {
            var groups = v.split(';');
            $.each(groups, function(i , o) {
              $('.add_account_mask form input[value='+ o +']').attr("checked","true");
            })
          }else if (k == "authority") {
            var auths = v.split(';');
            $.each(auths, function(i , o) {
              $('.add_account_mask form input[value='+ o +']').attr("checked","true");
            })
          }else if(k == "ustate") {
            $('.add_account_mask form input[name='+ k +']').attr("checked","true");
          }else {
            $('.add_account_mask form input[name='+ k +']').val(v);
          }
        });
        $('.add_account_mask form input[name=sysusid]').val(sysusid);
        $('.add_account_mask').show();
        $(".add_form").data('bootstrapValidator').validate();
        $('.add_account_block').animate({ scrollTop: 0 }, 0);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50) + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
      }
    });
  }

  function del(rowobj) {
    var sysusid = rowobj.data("sysusid");
    $.ajax({
      type: 'POST',
      url: _addr + 'ywh_delAction/?',
      data: {
        tname: 'sys_user',
        tid: sysusid
      },
      dataType: 'json',
      success: function(msg) {
        rowobj.parent().parent().remove();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50) + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
      }
    });
  }

  function reqGroups() {
    $.ajax({
      type: 'GET',
      url: _addr + 'ywh_queryTableList/?',
      data: {
        source: 'sys_group',
        qtype: 'select@online'
      },
      dataType: 'json',
      success: function(msg) {
        var html = '';
        $.each(msg, function(i, o) {
          html += '<div class="form-group form_group_btn">'
               +  '<span>' + o.groupname + '</span><div class="ios_button">'
               +  '<input type="checkbox" id="group_' + o.groupid + '" name="group[]" value="' + o.groupid + '" class="raw-checkbox">'
               +  '<label for="group_' + o.groupid + '" class="emulate-ios-button"></label>'
               +  '</div></div>'
        });
        $('form .account_groups').append(html);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50) + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
      }
    });
  }

  function touchRest(rowobj) {
    rowobj.parent().parent().css('-webkit-transform', "translateX(0px)");
    rowobj.parent().parent().removeClass('touched');
  }

  function buildList(bool) {
    if (bool) {
      var html = "";
          html += '<div class="center-block account_title">员工列表</div><a href="javascript:void(0)" class="center-block add_account"><i>'
               +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
               +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add_remote_svg"></use>'
               +  '</svg></i><span>添加员工账号</span></a><ul></ul>';
      $('div.account_list').append(html);
    }else {
      $('div.account_list ul').empty();
    }

    $.ajax({
      type: 'GET',
      url: _addr + 'ywh_queryTableList/?source=sys_user',
      data: {
        qtype: 'select',
        qhstr: JSON.stringify({"qjson":[{parentid: 0}]}),
        sortname: 'username',
        sortorder: 'ASC'
      },
      dataType: 'json',
      success: function(msg) {
        if (msg) {
          var list = '';
          $.each(msg, function(i, o) {
            list += '<li class="list-li"><a href="javascript:void(0)" class="account_choose"><i>'
                 +  '<svg class="svg_icon" viewBox="0 0 1024 1024">'
                 +  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#account_svg"></use>'
                 +  '</svg></i><span>'+ o.username +'</span></a>'
                 +  '<div class="account_tools"><a href="javascript:void(0);" class="account_update" data-sysusid='+ o.sysusid +'>修改</a>'
                 +  '<a href="javascript:void(0);" class="account_del" data-sysusid='+ o.sysusid +'>删除</a></div></li>';
          });

          $('div.account_list ul').append(list);
        }


      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50) + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
      }
    });
  }
})