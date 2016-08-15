"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Represents a validation rule
 */
var ValidationRule = (function () {
    function ValidationRule(params) {
        this.conditions = [];
        this._invalidMessage = "Invalid";
        this.params = params;
        this._invalidMessage = "";
    }
    Object.defineProperty(ValidationRule.prototype, "invalidMessage", {
        /**
         * Retrieves the invalid message for the ValidationRule
         */
        get: function () {
            return this._invalidMessage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if the ValidationRule is valid
     */
    ValidationRule.prototype.isValid = function (fromValue, toValue) {
        this.fromValue = fromValue;
        this.toValue = toValue;
        // Reset the invalid message
        this._invalidMessage = '';
        for (var i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i]() === false) {
                return false;
            }
        }
        return true;
    };
    /**
     * Ads an invalid message to the ValidationRule
     */
    ValidationRule.prototype.addInvalidMessage = function (message) {
        this._invalidMessage += message;
    };
    return ValidationRule;
}());
exports.ValidationRule = ValidationRule;
var LengthValidator = (function (_super) {
    __extends(LengthValidator, _super);
    function LengthValidator() {
        var _this = this;
        _super.apply(this, arguments);
        this.conditions = [
            function () {
                var match = true;
                if (_this.toValue.length < _this.params['min']) {
                    match = false;
                    _this.addInvalidMessage(_this.toValue + " is shorter than " + _this.params['min']);
                }
                if (_this.toValue.length > _this.params['max']) {
                    match = false;
                    _this.addInvalidMessage(_this.toValue + " is longer than " + _this.params['max']);
                }
                return match;
            }
        ];
    }
    return LengthValidator;
}(ValidationRule));
exports.LengthValidator = LengthValidator;
/**
 * RegExpValidator
 */
var RegExpValidator = (function (_super) {
    __extends(RegExpValidator, _super);
    function RegExpValidator() {
        var _this = this;
        _super.apply(this, arguments);
        this.conditions = [
            function () {
                var match = true;
                if (!_this.toValue || !_this.toValue.match || !_this.toValue.match(_this.params['rule'])) {
                    match = false;
                }
                return match;
            }
        ];
    }
    return RegExpValidator;
}(ValidationRule));
exports.RegExpValidator = RegExpValidator;
/**
 * EmailValidator
 */
var EmailValidator = (function (_super) {
    __extends(EmailValidator, _super);
    function EmailValidator() {
        var _this = this;
        _super.apply(this, arguments);
        this.conditions = [
            // Check for email regexp...
            function () {
                var match = true;
                var regExpValidator = new RegExpValidator({ rule: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i });
                if (!regExpValidator.isValid(_this.fromValue, _this.toValue)) {
                    _this.addInvalidMessage(_this.toValue + ' is not a valid email address');
                    match = false;
                }
                return match;
            }
        ];
    }
    return EmailValidator;
}(ValidationRule));
exports.EmailValidator = EmailValidator;
/**
 * RequiredValidator
 */
var RequiredValidator = (function (_super) {
    __extends(RequiredValidator, _super);
    function RequiredValidator() {
        var _this = this;
        _super.apply(this, arguments);
        this.conditions = [
            function () {
                var match = true;
                if (typeof (_this.toValue) === "undefined") {
                    match = false;
                    _this.addInvalidMessage("A value is required and was not provided");
                }
                return match;
            }
        ];
    }
    return RequiredValidator;
}(ValidationRule));
exports.RequiredValidator = RequiredValidator;
var AllowedValueSwitchValidator = (function (_super) {
    __extends(AllowedValueSwitchValidator, _super);
    function AllowedValueSwitchValidator() {
        var _this = this;
        _super.apply(this, arguments);
        // Sample of value changes declaration:
        // { matches: [
        //     { from: "open", to: ["scheduled", "canceled", "closed"] }
        // ]}
        this.conditions = [
            function () {
                var match = false;
                if (_this.params && _this.params['matches'] && _this.params['matches'].length) {
                    for (var i = 0; i < _this.params['matches'].length; i++) {
                        var rule = _this.params['matches'][i];
                        if (rule['from'] && rule['to'] && rule['to'].length) {
                            // Origin value matched
                            if (rule['from'] === _this.fromValue) {
                                // Check that the destination value also matches
                                for (var i2 = 0; i2 < rule['to'].length; i2++) {
                                    if (!match) {
                                        if (_this.toValue === rule['to'][i2] && !match) {
                                            match = true;
                                        }
                                    }
                                }
                            }
                            else {
                                match = false;
                            }
                        }
                    }
                }
                if (!match) {
                    _this.addInvalidMessage(_this.fromValue + " cannot change to '" + _this.toValue + "'");
                }
                return match;
            }
        ];
    }
    return AllowedValueSwitchValidator;
}(ValidationRule));
exports.AllowedValueSwitchValidator = AllowedValueSwitchValidator;
