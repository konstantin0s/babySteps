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