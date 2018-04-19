var idValidator = new IDValidator(GB2260);

function showError(info) {
    $("#error").html(info);
    $("#error").show();
    setTimeout(function() {
        $("#error").hide();
    }, 1500)
}

function getProvinces() {
    var htm = "<option value=''>请选择</option>";
    for(var item of addrCode.province) {
        htm += "<option value='"+item.code+"'>" + item.name+ "</option>";
    }
    return htm;
}
function getCitys(provinceCode) {
    var htm = "<option value=''>请选择</option>";
    if(provinceCode) {
        for(var item of addrCode.city) {
            if(item.parentId == provinceCode) {
                htm += "<option value='"+item.code+"'>" + item.name+ "</option>";
            }
        }
    }
    return htm;
}

function getAreas(cityCode) {
    var htm = "<option value=''>请选择</option>";
    if(cityCode) {
        for(var item of addrCode.area) {
            if(item.parentId == cityCode) {
                htm += "<option value='"+item.code+"'>" + item.name+ "</option>";
            }
        }
    }
    return htm;
}

//缓存中读取数据并初始化页面
(function() {
    var st_tab =  window.localStorage.getItem("tab"),
    tab = $("span[data-tab='"+st_tab+"']"),
    ctn = $("#ctn"+ st_tab);
    tab.addClass("active");
    tab.siblings(".tab-btn").removeClass("active");
    ctn.show();
    ctn.siblings(".func-contain").hide();
    //读取身份证号码验证数据
    var st_identyNo1 = window.localStorage.getItem("identyNo1") || "",
        st_bd1 = window.localStorage.getItem("bd1")|| "";
    $("#identyNo1").val(st_identyNo1);
    $("#bd1").html(st_bd1);
    //身份证生成
    var st_province2 = window.localStorage.getItem("province2") || "",
        st_city2 = window.localStorage.getItem("city2") || "",
        st_area2 = window.localStorage.getItem("area2") || "",
        st_birth2 = window.localStorage.getItem("birth2") || "",
        st_gender2 = window.localStorage.getItem("gender2") || "",
        st_bd2 = window.localStorage.getItem("bd2") || "";
    $("#birth2").val(st_birth2);
    $("#gender2").val(st_gender2);
    //省市区循环回填
    $("#province2").html(getProvinces());
    $("#city2").html(getCitys(st_province2));
    $("#area2").html(getAreas(st_city2));
    $("#province2").val(st_province2);
    $("#city2").val(st_city2);
    $("#area2").val(st_area2);
    $("#bd2").html(st_bd2);
    //省市区联动
    $("#province2").change(function(){
        var code = $("#province2").val();
        $("#city2").html(getCitys(code));
        $("#area2").html(getAreas(""));
    });
    $("#city2").change(function() {
        var code = $("#city2").val();
        $("#area2").html(getAreas(code));
    });
})();






//添加生日时间控件
$('#birth2').cxCalendar();

//tab切换
$(".tab-btn").click(function(){
    var self = $(this), index = self.attr("data-tab"),
    ctn = $("#ctn" + index);
    self.siblings(".tab-btn").removeClass("active");
    self.addClass("active");
    ctn.show();
    ctn.siblings(".func-contain").hide();
    window.localStorage.setItem("tab", index);
});

//身份证号码验证
$("#confirm1").click(function() {
    var identyNo = $("#identyNo1").val();
    if(!identyNo || !identyNo.trim()) {
        showError("请输入要检验的号码");
        return;  
    }
    var info = idValidator.getInfo(identyNo);
    if(info) {
        info = JSON.stringify(info);
    }else {
        info = info.toString();
    }
    window.localStorage.setItem("bd1", info);
    window.localStorage.setItem("identyNo1", identyNo);
    $("#bd1").html(info);
});


//身份证生成
$("#confirm2").click(function() {
    var province = $("#province2").val(),
        city = $("#city2").val(),
        area = $("#area2").val(),
        birth = $("#birth2").val(),
        gender = $("#gender2").val(),
        opts = {
            addr: area || city || province || "",
            birth: birth || "",
            gender: gender || ""
        },
        info = "";
    //获取身份证号码
    for(var i= 0; i<5; i++) {
        info += "<p class='p'>" + idValidator.makeIDByCondition(opts); + "</p>"
    }
    $("#bd2").html(info);
    //记录缓存数据
    window.localStorage.setItem("bd2", info);
    window.localStorage.setItem("province2", province);
    window.localStorage.setItem("city2", city);
    window.localStorage.setItem("area2", area);
    window.localStorage.setItem("birth2", birth);
    window.localStorage.setItem("gender2", gender);
});