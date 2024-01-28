// Patient Health Questionnaire 9-item depression scale (PHQ-9)
const phqQuestions = [
    /*1*/ "Little interest or pleasure in doing things",
    /*2*/ "Feeling down, depressed, or hopeless",
    /*3*/ "Trouble falling or staying asleep, or sleeping too much",
    /*4*/ "Feeling tired or having little energy",
    /*5*/ "Poor appetite or overeating",
    /*6*/ "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    /*7*/ "Trouble concentrating on things, such as reading the newspaper or watching television",
    /*8*/ "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    /*9*/ "Thoughts that you would be better off dead or of hurting yourself in some way",
];

// Generalised Anxiety Disorder (GAD-7)
const gadQuestions = [
    /*1*/ "Feeling nervous, anxious or on edge",
    /*2*/ "Not being able to stop or control worrying",
    /*3*/ "Worrying too much about different things",
    /*4*/ "Trouble relaxing",
    /*5*/ "Being so restless that it is hard to sit still",
    /*6*/ "Becoming easily annoyed or irritable",
    /*7*/ "Feeling afraid as if something awful might happen",
];

// Possible answers
const answers = [/*1*/ "Not at all", /*2*/ "Several days", /*3*/ "More than half the days", /*4*/ "Nearly every day"];

// Counter for multistep form
let currentStep = 1;

// User age - initiate with -1. Nobody can be older than -1
let userAge = -1;

// Declare age related variables
let ageForm;
let userAgeFeedback;
let ageProvided = false;

// Declare array for user answers
let userResponses = [];

// Target htmlQuestionnaire section
let htmlQuestionnaire = document.getElementById("htmlQuestionnaire");

// Wait for the DOM to finish loading, before listening to questionnaire click event
// Get the questionnaires by class name and event listeners to them
document.addEventListener("DOMContentLoaded", function () {
    // Declare variable to target questionnaires class
    let questionnaires = document.getElementsByClassName("questionnaires");

    for (let questionnaire of questionnaires) {
        // Change pointer cursor when hovering over any of the questionnaires
        questionnaire.addEventListener("mouseover", function () {
            // Use 'this' keyword to know which element triggers the hover event
            this.style.cursor = "pointer";
        });

        // Set click event listener on the questionnaires
        questionnaire.addEventListener("click", function () {
            //target questionnaire id
            let questionnaireId = this.getAttribute("id");
            //clear questionnaire
            htmlQuestionnaire.innerHTML = "";
            // Reset the counter
            currentStep = 1;

            //if age form was previously displayed on screen, clear the content
            if (ageForm) {
                ageForm.innerHTML = "";
            }

            // clear text in user age feedback under the age form, only if previously was displayed on screen
            if (userAgeFeedback) {
                userAgeFeedback.innerHTML = "";
            }

            // Ask for user age and display generated form in 'htmlQuestionnaire' section
            if (questionnaireId === "phq9") {
                checkAgeAndProceed(questionnaireId, phqQuestions);
            } else if (questionnaireId === "gad7") {
                checkAgeAndProceed(questionnaireId, gadQuestions);
            } else {
                alert("We are sorry! There is an error with selected screening tool");
            }
        });
    }

    // Common functions for PHQ-9 and GAD-7
    /**
     * Prompt the user to provide their age if it was not provided earlier.
     * Verify the user-provided details against the age criteria.
     * If the criteria are met, display the requested questionnaire
     * @param {String} questionnaireId
     * @param {Array} questions
     */
    function checkAgeAndProceed(questionnaireId, questions) {
        if (canIproceed(questionnaireId, userAge) === true) {
            displayQuestions(questions, questionnaireId);
        } else {
            askUserAge();

            //target age related sections
            ageForm = document.getElementById("ageForm");
            userAgeFeedback = document.getElementById("userAgeFeedback");
            let responseFromCaniProceed = canIproceed(questionnaireId, userAge);
            //set the feedback again if it was provided already at least once
            if (responseFromCaniProceed !== true && userAge > -1) {
                userAgeFeedback.innerHTML = responseFromCaniProceed;
            }

            // Attach event listener to user age form
            ageForm.addEventListener("submit", function (event) {
                // this is one of the way of passing two arguments (inlcuding 'event') to call back function
                let handlingOutcome = handleAgeSubmit(event, questionnaireId);

                if (handlingOutcome === true) {
                    ageForm.innerHTML = "";
                    userAgeFeedback.innerHTML = "";
                    displayQuestions(questions, questionnaireId);
                } else {
                    userAgeFeedback.innerHTML = handlingOutcome;
                }
            });
        }
    }

    /**
     * Target user age form and fill in with HTMl snippet
     */
    function askUserAge() {
        document.getElementById("userAge").innerHTML = userAgeForm();
    }

    /**
     * Generate user age form
     * @returns html - HTML snipppet
     */
    function userAgeForm() {
        let html = "";

        html = `
        <form id="ageForm">
          <label for="age">What is your age?</label>
          <input type="number" id="age" name="age" min="0" max="100" required>
          <button type="submit">Submit</button>
        </form>
        `;

        return html;
    }

    /**
     * Handle user age form when submit button pressed
     */
    function handleAgeSubmit(event, questionnaireId) {
        // Prevent the form from default submitting action
        event.preventDefault();
        userAge = document.getElementById("age").value; //get the value the user provided
        return canIproceed(questionnaireId, userAge);
    }

    /**
     * Verify if the age criteria are met and provide feedback if necessary.
     * Return 'true' if the criteria are met.
     * @param {String} questionnaireId
     * @returns {Boolean, String} - 'True' - if age criteria are met. String - feedback.
     */
    function canIproceed(questionnaireId, userAge) {
        if (questionnaireId === "phq9") {
            let minAge = 13;
            return userAge >= minAge
                ? true
                : `Based on the provided details, your age is ${userAge}. If it is incorrect amend your age accordingly. Please be aware that this questionnaire is intended for individuals ${minAge} years and older. You can try the <a href="https://changes.ie/wp-content/uploads/2022/02/Patient-Health-Questionnaire-Adult-PHQ-9.pdf" target="_blank" rel="noopener noreferrer">PHQ-A questionnaire for adolescents</a> for more suitable options.`;
        } else if (questionnaireId === "gad7") {
            let minAge = 12;
            return userAge >= minAge
                ? true
                : `Based on the provided details, your age is ${userAge}. If it is incorrect amend your age accordingly. Please be aware that this questionnaire is intended for individuals ${minAge} years and older. For more information, you can visit <a href='https://mentalhealth.ie/generalised-anxiety-disorder' target='_blank' rel='noopener noreferrer'>this link</a>.`;
        } else {
            return "Error occured within handle age submit form. Form clicked is not defined";
        }
    }

    /**
     * Generate and return HTML snippet of all questions
     * @param {Array} questions - Array of all questions in questionnaire
     */
    function multistepForm(questions, questionnaireId) {
        // Counter variable for purpose of generating unique id answers
        let answerLoop = 0;

        // Declare html variable to store html snippet
        let html = "";

        html = `\n<h1>Over the last 2 weeks, how often have you been bothered by the following problems?</h1>`;
        html += `\n<form id="multistep-form-${questionnaireId}" onsubmit="return false">`;

        // Loop through question
        for (let i = 0; i < questions.length; i++) {
            // Set first step active
            if (i === 0) {
                html += `\n<div id="step${i + 1}" class="step active">`;
            } else {
                html += `\n<div id="step${i + 1}" class="step">`;
            }

            html += `\n<h2>${questions[i]}</h2>`;

            for (let j = 0; j < answers.length; j++) {
                html += `
                <input type="radio" id="answer${answerLoop}" name="answer${i}" value="${answers[j]}" onclick="clearFeedback()">
                <label for="answer${answerLoop}">${answers[j]}</label><br>
                `;
                answerLoop++;
            }

            html += `<p id="feedback${i}" class="feedback"></p>`;

            // Display submit button in the last iteration of the loop
            if (i === 0) {
                html += `\n<button onclick="nextStep()">Next</button>`;
            } else if (i < questions.length - 1) {
                html += '\n<button onclick="prevStep()">Previous</button>';
                html += `\n<button onclick="nextStep()">Next</button>`;
            } else {
                html += '\n<button onclick="prevStep()">Previous</button>';
                html += `\n<button type="submit"  onclick="formSubmit(event)">Submit</button>`;
            }

            html += `\n</div>`;
        }

        html += "\n</form>\n";

        return html;
    }

    /**
     * Display all questions
     * @param {Array} questions
     */
    function displayQuestions(questions, questionnaireId) {
        htmlQuestionnaire.innerHTML = multistepForm(questions, questionnaireId);
    }

    

    function calculateTotal() {}

    function displayUserAnswers() {}

    function displayResult() {}
});

/**
 * Set active class on sibling element when next button clicked. Request answer if not provided.
 */
function nextStep() {
    if (isChecked()) {
        document.getElementById("step" + currentStep).classList.remove("active");
        currentStep++;
        document.getElementById("step" + currentStep).classList.add("active");
    } else {
        requestAnswer();
    }
}

/**
 * Set active class on sibling element when previous butoon clicked
 */
function prevStep() {
    document.getElementById("step" + currentStep).classList.remove("active");
    currentStep--;
    document.getElementById("step" + currentStep).classList.add("active");
}

/**
 * Display feedback that answer has not been selected
 */
function requestAnswer() {
    document.getElementById(`feedback${currentStep - 1}`).innerText = "Please select your answer";
}

/**
 *  Clear feedback section
 */
function clearFeedback() {
    document.getElementById(`feedback${currentStep - 1}`).textContent = "";
}

/**
 * Checking if answer has been selected, display feedback if it was not
 * @returns {Boolean}
 */
function isChecked() {
    let radioGroup = document.getElementsByName(`answer${currentStep - 1}`);
    let checked = false;
    // Loop through the radio buttons to check if at least one is checked
    for (let i = 0; i < radioGroup.length; i++) {
        if (radioGroup[i].checked === true) {
            checked = true;
            // Break loop if at least one radio button is checked
            break;
        }
    }
    return checked;
} 

/**
 * Takes control of form submission. Also ensures that the final question is answered.
 * @event event
 */
function formSubmit(event) {
    if (isChecked()) {
        // Prevent the form from default submitting action
        event.preventDefault();
        collectAnswers(event);

    } else {
        requestAnswer();
    }
}

/**
 * Collect user answers and save in 'userResponses' array
 * @param {Event} event 
 */
function collectAnswers(event) {

    let formId = event.target.parentNode.parentNode.getAttribute("id");
    let form = document.getElementById(formId);
    userResponses = [];
    let phq9Length = phqQuestions.length;
    let gad7Length = gadQuestions.length;

    if (formId === "multistep-form-phq9") {

        for(let i = 0; i < phq9Length; i++) {
            userResponses.push(form.querySelector('input[name="answer' + i + '"]:checked').value);
        }

    }

    if (formId === "multistep-form-gad7") {

        for(let i = 0; i < gad7Length; i++) {
            userResponses.push(form.querySelector('input[name="answer' + i + '"]:checked').value);
        }
        
    }        

}