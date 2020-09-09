'use strict';

let I;
let assert = require('assert');

module.exports = {

    _init() {
        I = require('../steps_file.js')();
    },
    url:  '/login.bml',

    unlogged: {
        usernameField: '.b-service .b-loginform-field__input--user',
        passwordField: '.b-service #lj_loginwidget_password',
        loginButton: '.appwidget .b-loginform-btn[name="action:login"]:not(.lj-openid-auth-submit)',
        rememberMeLabel: '.b-service .b-loginform-checkbox__label'
    },

    logged: {
        logoutButton :'button[name="action:logout"]'
    },

    errorMessage: {
        errorPassword: '.appwidget .b-loginform-field__errorMsg[ng-show="loginForm.errorPassword"]',
        errorUsername: '.appwidget .b-loginform-field__errorMsg[ng-show="loginForm.errorUsername"]'
    },

    fillLoginFormAndSubmit(login, password) {
        I.fillField(this.unlogged.usernameField, login);
        I.fillField(this.unlogged.passwordField, password);
        I.click(this.unlogged.loginButton);
    },

    getErrorText(errorType) {
        switch (errorType) {
            case 'errorPassword':
                I.waitForVisible(this.errorMessage.errorPassword);
                return I.grabTextFrom(this.errorMessage.errorPassword);
            case 'errorLogin':
                I.waitForVisible(this.errorMessage.errorUsername);
                return I.grabTextFrom(this.errorMessage.errorUsername);
            default:
                break;
        }
    },

    setCheckboxRememberMe(isChecked) {
        if(isChecked){
            I.click(this.unlogged.rememberMeLabel);
        }
    },
}
