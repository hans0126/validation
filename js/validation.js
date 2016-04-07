//auth by Hans
function validate(_obj) {

    if (typeof(sprintf) != "function") {
        console.log("This programe depends on sprintf");
        return
    }

    var _self = this;

    //  element: dom element //by name
    //  display: field name
    //  rules: required|matches[password]    
    //  reElement: error result , get element by id
    //  any function name : function

    _self.inputs = [];
    _self.hasError = false;
    _self.startValidate = function(fn) {
        _self.hasError = false;
        for (var i = 0; i < _self.inputs.length; i++) {
            singleValidate(_self.inputs[i]);
        }

        if (typeof(fn) == "function") {
            fn();
        }
    }

    _self.addInput = function(_obj) {
        if (!_obj.element.length) {
            console.log("must use getElementsByName!!");
            return
        }

        for (var key in _obj) {
            if (typeof(_obj[key]) == "function") {
                _obj[key](singleValidate);
            }
        }

        _self.inputs.push(_obj);
    }

    _self.addRule = function(_obj) {
        //ruleName: string
        //ruleFn:Fn
        //errorMsg:String

        if (typeof(_obj.ruleFn) == "function") {
            _self.rules[_obj.ruleName] = _obj.ruleFn;
            _self.errorMsg[_obj.ruleName] = _obj.errorMsg;
        }

    }

    _self.rules = {
        required: required,
        mail: mail,
        min: min,
        max: max,
        twID: twID,
        numeric: numeric
    }

    _self.errorMsg = {
        required: "%s 不能為空值",
        mail: "%s 欄位格式不符",
        max: "%s 字數不能超過 %s",
        min: "%s 字數不能少於 %s",
        twID: "%s 欄位格式錯誤",
        numeric: "%s 欄位須為數值"
    }

    function singleValidate(_obj) {

        if (_obj.reElement) {
            _obj.reElement.innerHTML = "";
        }

        if (_obj.element[0].offsetParent === null) {
            return
        }

        var inputType;

        if (_obj.element[0].tagName.toLowerCase() == "textarea") {
            inputType = _obj.element[0].tagName.toLowerCase();
        } else {
            inputType = _obj.element[0].getAttribute("type").toLowerCase()
        }

        switch (inputType) {
            case "radio":
            case "checkbox":
                var _hasCheck = false;
                for (var i = 0; i < _obj.element.length; i++) {
                    if (_obj.element[i].checked) {
                        _hasCheck = true;
                        break;
                    }
                }

                if (!_hasCheck) {
                    _obj.result = sprintf(_self.errorMsg["required"], _obj.display);
                    _self.hasError = true;

                    if (_obj.reElement) {
                        _obj.reElement.innerHTML = _obj.result;
                    }
                }

                break;

            default:
                var _rules;
                var _reg = /\[(.+)\]/;
                _rules = _obj.rules;
                _rules = _rules.split("|");

                for (var i = 0; i < _rules.length; i++) {
                    var _rule = _rules[i],
                        _value = null;

                    var regResult = _rule.match(_reg);

                    if (regResult) {
                        _value = regResult[1];
                        _rule = _rule.replace(_reg, "");
                    }

                    if (!_self.rules[_rule](_obj.element[0].value, _value)) {
                        _self.hasError = true;
                        _obj.result = sprintf(_self.errorMsg[_rule], _obj.display, _value);

                        if (_obj.reElement) {
                            _obj.reElement.innerHTML = _obj.result;
                        }

                        break
                    }
                }
        }

        return;

    }


    function required(_val) {
        var reg = new RegExp("^$");

        if (!_val || reg.test(_val)) {
            return false;
        } else {
            return true;
        }
    }

    function mail(_val) {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

        if (!_val) {
            return true;
        }


        if (!reg.test(_val)) {

            return false;
        } else {

            return true;
        }

    }

    function max(_val, _num) {
        if (!_val) {
            return true;
        }

        if (_val.length > _num) {

            return false;
        } else {
            return true;
        }
    }

    function min(_val, _num) {
        if (!_val) {
            return true;
        }

        if (_val.length < _num) {
            return false;
        } else {
            return true;
        }
    }

    function twID(_val) {
        //建立字母分數陣列(A~Z)

        if (!_val) {
            return true;
        }

        var city = new Array(
            1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11,
            20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30
        )
        _val = _val.toUpperCase();
        // 使用「正規表達式」檢驗格式
        if (_val.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
            return false;
        } else {
            //將字串分割為陣列(IE必需這麼做才不會出錯)
            _val = _val.split('');
            //計算總分
            var total = city[_val[0].charCodeAt(0) - 65];
            for (var i = 1; i <= 8; i++) {
                total += eval(_val[i]) * (9 - i);
            }
            //補上檢查碼(最後一碼)
            total += eval(_val[9]);
            //檢查比對碼(餘數應為0);
            return ((total % 10 == 0));
        }
    }

    function numeric(_val) {
        if (!_val) {
            return true;
        }

        if (isNaN(_val)) {
            return false
        } else {
            return true;
        }
    }

}
