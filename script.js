//constants
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const NAME_REGEX = /^[A-Za-z]+/;
const SURNAME_REGEX = /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/;

//select the elements
const formContact = document.getElementById("contact-form");

const inputFirstName = document.getElementById("first-name");

const inputLastName = document.getElementById("last-name");

const inputEmail = document.getElementById("email");

const radioGeneralEnquiry = document.getElementById("general-enquiry");
const radioGeneralEnquiryCustom = document.getElementById(
  "custom-radio-general-enquiry"
);

const radioSupportRequest = document.getElementById("support-request");
const radioSupportRequestCustom = document.getElementById(
  "custom-radio-support-request"
);

const radioErrorElement = document.getElementById("contact-method-error");

const textareaMessage = document.getElementById("message");

const checkboxConsent = document.getElementById("consent");
const checkboxCustom = document.getElementById("custom-check");

const submitButton = document.getElementById("submit-button");

const successToast = document.getElementById("success-message");

//app state
const state = {
  firstName: "",
  lastName: "",
  email: "",
  contactMethod: "",
  message: "",
  consent: false, //.checked
  error: {
    message: "",
    input: "", //id of the input element error occured
    field: "", //id of the corresponding error field
  },
};

//event listeners
formContact.addEventListener("submit", onSubmit);
inputFirstName.addEventListener("input", setFirstName);
inputLastName.addEventListener("input", setLastName);
inputEmail.addEventListener("input", setEmail);
radioGeneralEnquiry.addEventListener("click", setContactMethod);
radioSupportRequest.addEventListener("click", setContactMethod);
textareaMessage.addEventListener("input", setMessage);
checkboxConsent.addEventListener("input", setConsent);

//callback functions
/**
 * function to submit the contact form
 * @param e - form submit event
 */
function onSubmit(e) {
  //prevent page reload
  e.preventDefault();

  //check for required fields
  //check for first name
  if (!state.firstName) {
    //update the error state
    setError("This field is required", "first-name-error", "first-name");

    //display the error
    showError();

    throw new Error(state.error.message);
  }

  //check for last name
  if (!state.lastName) {
    //update the error state
    setError("This field is required", "last-name-error", "last-name");

    //display the error
    showError();

    throw new Error(state.error.message);
  }

  //check for email
  if (!state.email) {
    //update the error state
    setError("This field is required", "email-error", "email");

    //display the error
    showError();

    throw new Error(state.error.message);
  }

  //check for contact method
  if (!state.contactMethod) {
    //update the error state
    state.error.message = "Please select a query type";

    //add aria invalid to both of the inputs
    radioGeneralEnquiry.setAttribute("aria-invalid", "true");
    radioSupportRequest.setAttribute("aria-invalid", "true");

    //display the error
    radioErrorElement.innerText = state.error.message;
    radioErrorElement.classList.remove("hidden");

    throw new Error(state.error.message);
  }

  //check for message
  if (!state.message) {
    //update the error state
    setError("This field is required", "message-error", "message");

    //display the error
    showError();

    throw new Error(state.error.message);
  }

  //check for consent
  if (!state.consent) {
    //update the error state
    setError(
      "To submit this form, please consent being contacted",
      "consent-error",
      "consent"
    );

    //display the error
    showError();

    throw new Error(state.error.message);
  }

  //validate fields
  //validate first name
  if (!validateName(state.firstName)) {
    //update the error state
    setError(
      "Please enter a valid first name",
      "first-name-error",
      "first-name"
    );

    //display the error
    showError();
  }

  //validate last name
  if (!validateSurname(state.lastName)) {
    //update the error state
    setError("Please enter a valid last name", "last-name-error", "last-name");

    //display the error
    showError();
  }

  //validate email
  if (!validateEmail(state.email)) {
    //update the error state
    setError("Please enter a valid email address", "email-error", "email");

    //display the error
    showError();

    throw new Error(state.error.message);
  }

  //if there are no errors submit the form
  //reset error state
  setError();

  //select all error elements
  const errorNodeList = document.querySelectorAll("error");

  //hide error elements
  errorNodeList.forEach((element) => {
    element.classList.add("hidden");
  });

  //reset app state
  state.firstName = "";
  state.lastName = "";
  state.email = "";
  state.contactMethod = "";
  state.message = "";
  state.consent = false;

  //clear input fields
  inputFirstName.value = "";
  inputLastName.value = "";
  inputEmail.value = "";
  radioGeneralEnquiry.checked = false;
  radioSupportRequest.checked = false;
  textareaMessage.value = "";
  checkboxConsent.checked = false;

  //display the success cpmponent
  successToast.classList.remove("hidden");
}

/**
 * function to update the state.firstName on every input change
 * @param e - change event
 */
function setFirstName(e) {
  state.firstName = e.target.value;
}

/**
 * function to update the state.lastName on every input change
 * @param e - change event
 */
function setLastName(e) {
  state.lastName = e.target.value;
}

/**
 * function to update the state.email on every input change
 * @param e - change event
 */
function setEmail(e) {
  state.email = e.target.value;
}

/**
 * function to update the state.contactMethod
 * @param e - click event on the radio buttons
 */
function setContactMethod(e) {
  state.contactMethod = e.target.value;

  //get the id of the custom radio button
  const customId = e.target.value.replace(" ", "-");

  //toggle selected radio
  if (customId === "general-enquiry") {
    radioGeneralEnquiryCustom.classList.add("custom-radio-selected");

    radioSupportRequestCustom.classList.remove("custom-radio-selected");
  }

  if (customId === "support-request") {
    radioSupportRequestCustom.classList.add("custom-radio-selected");

    radioGeneralEnquiryCustom.classList.remove("custom-radio-selected");
  }
}

/**
 * function to update the state.message
 * @param e - change event
 */
function setMessage(e) {
  state.message = e.target.value;
}

/**
 * function to update state.consent
 * @param e - change event
 */
function setConsent(e) {
  //boolean
  state.consent = e.target.checked;

  //update the custom checkbox with checked
  if (e.target.checked) {
    checkboxCustom.classList.add("custom-check-selected");
  } else {
    checkboxCustom.classList.remove("custom-check-selected");
  }
}

//helper functions
/**
 * function to set required field errors
 * @param errorMessage - error message text
 * @param field - id of the corresponding error element
 * @param input - id of the input element error occured
 */
function setError(errorMessage = "", field = "", input = "") {
  state.error.message = errorMessage;
  state.error.input = input;
  state.error.field = field;
}

/**
 * function to set and display errors
 */
function showError() {
  //select the field elements
  const errorElement = document.getElementById(state.error.field);
  const errorInput = document.getElementById(state.error.input);

  //add aria-invalid to the input
  errorInput.setAttribute("aria-invalid", "true");

  //update input field with error class
  errorInput.classList.add("input-error");

  //update error element
  errorElement.innerText = state.error.message;
  errorElement.classList.remove("hidden");
}

/**
 * function to validate email
 * @param email - email text
 */
function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * function to validate first name
 * @param name - first name
 */
function validateName(name) {
  return NAME_REGEX.test(name);
}

/**
 * function to validate last name
 * @param surname - last name
 */
function validateSurname(surname) {
  return SURNAME_REGEX.test(surname);
}
