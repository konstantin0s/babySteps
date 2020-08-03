function emailValidation() {

    const signUpForm = document.getElementById('form');
    const emailField = document.getElementById('email');
    const okButton = document.getElementById('submit');

    emailField.addEventListener('keyup', (event) => {
        let isValidEmail = emailField.checkValidity();

        if (isValidEmail) {
            okButton.disabled = false;
        } else {
            okButton.disabled = true;
        }
    });
}

window.onload = emailValidation;

function validateRequiredField() {

    const okButton = document.getElementById('submit');
    const signUpForm = document.getElementById('form');

    if (signUpForm.checkValidity()) {
        okButton.disabled = false;
    } else {
        okButton.disabled = true;
    }
}
validateRequiredField();
minimLengthInput();

function minimLengthInput() {
    let help = document.getElementById('help');
    let fields = document.querySelectorAll('input');
    for (let field of Array.from(fields)) {
        field.addEventListener('focus', (event) => {
            let text = event.target.getAttribute('data-help');
            help.textContent = text;
            validateInput();

            if (help.textContent === null) {

                console.log('');
            }

        });
        field.addEventListener('blur', (event) => {
            help.textContent = '';
        });

        // console.log(field.length)
        field.addEventListener('change', (event) => {
            console.log(field.value.length)
            if (field.value.length >= 3) {
                help.textContent = '';
            }
        });

    }
}

function validateInput() {
    const okButton = document.getElementById('submit');
    if (this.value < 3) {
        okButton.disabled = false;
    } else {
        okButton.disabled = true;
    }
}