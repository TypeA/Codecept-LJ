// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({

    header: {
      loginMenuItem: '.s-header-item__link--login',
      createNewAccountMenuItem: '.s-nav-item-signup a',
      usernameMenuItem: '.s-header-item__link--user span'
    },

    loginForm: {
      loginFormLoginField: '.b-loginform-field .b-loginform-field__input--user',
      loginFormPasswordField: '.b-loginform-field #lj_loginwidget_password',
      loginFormLoginButton: '.b-loginform__form.pkg .b-loginform-btn--login'
    },

    openLoginFormAndSignIn: function (login, password) {
      this.click(this.header.loginMenuItem);
      this.fillField(this.loginForm.loginFormLoginField, login);
      this.fillField(this.loginForm.loginFormPasswordField, password);
      this.click(this.loginForm.loginFormLoginButton);
    },

    dontSeeCreateAccountButton: function () {
      this.waitForInvisible(this.header.createNewAccountMenuItem);
      this.dontSeeElement(this.header.createNewAccountMenuItem);
    },

    seeMyUsernameInHeader: function (login) {
      this.waitForElement(this.header.usernameMenuItem);
      this.seeElement(this.header.usernameMenuItem);
      this.see(login.toUpperCase());
    },

    waitForVisibleText: function (text,element, time = codeceptConfig.helpers.Appium.waitForTimeout / 1000) {
      this.waitForVisible(element, time);
      this.waitForText(text, time, element);
    }


  });
}
