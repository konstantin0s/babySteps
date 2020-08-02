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
            if (help) {
                help.textContent = text;
                validateInput();
                if (field >= 3) {
                    field.addEventListener('change', (event) => {
                        help.textContent = '';
                    });
                }
            }
            if (help.textContent === null) {

                console.log('lalaal')
            }

        });
        field.addEventListener('blur', (event) => {
            help.textContent = '';
        });
    }
}

function validateInput() {
    const okButton = document.getElementById('submit');
    if (this.value < 3) {
        alert('minum 3 ')
        okButton.disabled = false;
        // this.style.cssText = "border-width:5px;border-color:red;border-style:solid;border-radius:3px;";
    } else {
        okButton.disabled = true;
        // this.style.cssText = "border-width:5px;border-color:limegreen;border-style:solid;border-radius:3px;";
    }
}