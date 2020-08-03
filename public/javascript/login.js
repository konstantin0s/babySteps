const signUpForm = document.getElementById('form');
const passField = document.getElementById('pass').value;
const userField = document.getElementById('user');
const okButton = document.getElementById('submit');
let fields = document.querySelectorAll('input');

function inputCheck() {

    for (let field of Array.from(fields)) {

        field.addEventListener('keyup', (event) => {
            if ((signUpForm.checkValidity())) {
                if ((field.value.length >= 3)) {
                    okButton.disabled = false;
                } else {
                    okButton.disabled = true;
                }
            } else {
                okButton.disabled = true;
            }
        });
    }
}

inputCheck();

function validName() {
    var nameRegex = /^(?!-)(?!.*-$)[a-zA-Z-]+$/;
    if (userField.value.match(nameRegex) === null || userField.value.length < 3) {
        okButton.disabled = true;
    } else {
        okButton.disabled = false;
    }
}


document.getElementById('user').addEventListener('keyup', () => {
    validName();
});