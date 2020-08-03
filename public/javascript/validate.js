let globalVar = (function() {
    // global variables
    const signUpForm = document.getElementById('form');
    const emailField = document.getElementById('email');
    const okButton = document.getElementById('submit');
    let help = document.querySelector('#help');
    let fields = document.querySelectorAll('input');

    return {
        signUpForm: signUpForm,
        emailField: emailField,
        okButton: okButton,
        help: help,
        fields: fields
    };
}());

function emailValidation() {
    globalVar.emailField.addEventListener('keyup', (event) => {
        let isValidEmail = globalVar.emailField.checkValidity();

        if (isValidEmail) {
            globalVar.okButton.disabled = false;
        } else {
            globalVar.okButton.disabled = true;
        }
    });
}

window.onload = function() {
    emailValidation();
    validateRequiredField();
    minimLengthInput();
}

function validateRequiredField() {

    if (globalVar.signUpForm.checkValidity()) {
        globalVar.okButton.disabled = false;
    } else {
        globalVar.okButton.disabled = true;
    }
}


function minimLengthInput() {
    for (let field of Array.from(globalVar.fields)) {
        field.addEventListener('focus', (event) => {
            let text = event.target.getAttribute('data-help');
            // console.log(text)
            if (globalVar.help) {
                globalVar.help.textContent = text;
            }

            if (field.value.length >= 3) {
                globalVar.help.textContent = '';
            }

            if (globalVar.help.textContent === null) {
                console.log('babySteps');
            }

        });
        field.addEventListener('blur', (event) => {
            globalVar.help.textContent = '';
        });

        // console.log(field.length)
        field.addEventListener('change', (event) => {
            // console.log(field.value.length)
            if (field.value.length >= 3) {
                globalVar.help.textContent = '';
            }
        });

    }
}

function validateInput() {
    if (this.value < 3) {
        globalVar.okButton.disabled = false;
    } else {
        globalVar.okButton.disabled = true;
    }
}