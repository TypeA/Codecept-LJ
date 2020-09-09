//Данные для тестов "Войти в ЖЖ"
let accounts = new DataTable(['login', 'password']);
accounts.add(['lolololong', '123Qqq']);
accounts.add(['lololong', '123Qqq']);

//Данные для теста "Неуспешная авторизация";
let negativeAccounts = new DataTable(['login', 'password', 'errorMessage', 'errorLocation']);
negativeAccounts.add(['asd12313q', 'asdqwe', 'Username not found. Создать?', 'errorLogin']); //incorrect login
negativeAccounts.add(['', '123123', 'Enter your login', 'errorLogin']);          //empty login
negativeAccounts.add(['qa_team1', 'asdasd', 'Incorrect password', 'errorPassword']);  //incorrect password
negativeAccounts.add(['qa_team3', '', 'Enter password', 'errorPassword']);        //empty password
negativeAccounts.add(['qa_team5', 'Rome17', 'This journal has been deleted', 'errorLogin']); //deleted account
negativeAccounts.add(['test111', 'Rome17', 'Вход в систему под паролем сообщества запрещён.', 'errorLogin']); //community login
negativeAccounts.add(['qa_team4', 'qweqweqw', 'Your IP address is temporarily banned', 'errorLogin']); //ip banned

//Данные для теста "Чекбокс запомни меня"
const expiryPeriod = 60; // срок жизни куки логина
let rememberMeAccounts = new DataTable(['login', 'password', 'isChecked']);
rememberMeAccounts.add(['serj_test', 'PerPer123', true]);
rememberMeAccounts.add(['serj_test', 'PerPer123', false]);

Feature('@smoke authorization success');

Before((I) => {
    I.clearCookie();
});

Data(accounts).Scenario('Войти в ЖЖ через /login.bml', (I, loginPage, current) => {
    I.amOnPage(loginPage.url);
    loginPage.fillLoginFormAndSubmit(current.login, current.password);
    I.waitForVisible(loginPage.logged.logoutButton);
    I.seeElement(loginPage.logged.logoutButton);
    I.seeMyUsernameInHeader(current.login);
});

Data(accounts).Scenario('Войти в ЖЖ через форму логина', (I, mainPage, current) => {
    I.amOnPage(mainPage.url);
    I.openLoginFormAndSignIn(current.login, current.password);
    I.dontSeeCreateAccountButton();
    I.seeMyUsernameInHeader(current.login);
});

Feature('@smoke authorization negative');

Before((I, loginPage) => {
    I.amOnPage(loginPage.url);
    I.setCookie({name: 'langpref', value: 'ru_RU'});
    I.refreshPage();
});

Data(negativeAccounts).Scenario('Неуспешная авторизация', function* (I, loginPage, current) {
    let n = 1;
    let i;
    if (current.errorMessage === 'Your IP address is temporarily banned') {
        n = 4;
    }
    for (i = 0; i < n; i++) {
        loginPage.fillLoginFormAndSubmit(current.login, current.password);
    }
    let errorMessage = yield loginPage.getErrorText(current.errorLocation);
    let assert = require('assert');
    assert.equal(errorMessage, current.errorMessage);
});


Feature('@smoke authorization cookie');

Data(rememberMeAccounts).Scenario('Чекбокс Запомнить', function* (I, loginPage, current) {
    I.amOnPage(loginPage.url);
    loginPage.setCheckboxRememberMe(current.isChecked);
    loginPage.fillLoginFormAndSubmit(current.login, current.password);
    I.waitForVisible(loginPage.logged.logoutButton);
    let cookie = yield I.grabCookie('ljloggedin');
    let assert = require('assert');
    if (current.isChecked) {
        let date = new Date;
        date.setDate(date.getDate() + expiryPeriod);
        let timeNow = (Math.floor(date.getTime() / 10000));
        let cookieExpery = (Math.floor(cookie.expiry / 10));
        assert.equal(cookieExpery, timeNow);
    } else {
        assert.equal(cookie.expiry, undefined);
    }

});
