const signUpForm = document.getElementById('form');
const passField = document.getElementById('pass');
const okButton = document.getElementById('submit');

passField.addEventListener('keyup', (event) => {
    var passW = /^(?=.*\d)(?=.*[a-z]).{5,20}$/;
    let isValidPass = passField.value.match(passW);

    if (isValidPass) {
        okButton.disabled = false;
    } else {
        okButton.disabled = true;
    }
});