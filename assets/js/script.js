// Patient Health Questionnaire 9-item depression scale (PHQ-9)
const phqQuestions = [
    /*0*/ "Little interest or pleasure in doing things",
    /*1*/ "Feeling down, depressed, or hopeless",
    /*2*/ "Trouble falling or staying asleep, or sleeping too much",
    /*3*/ "Feeling tired or having little energy",
    /*4*/ "Poor appetite or overeating",
    /*5*/ "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    /*6*/ "Trouble concentrating on things, such as reading the newspaper or watching television",
    /*7*/ "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    /*8*/ "Thoughts that you would be better off dead or of hurting yourself in some way",
];

// Generalised Anxiety Disorder (GAD-7)
const gadQuestions = [
    /*0*/ "Feeling nervous, anxious or on edge",
    /*1*/ "Not being able to stop or control worrying",
    /*2*/ "Worrying too much about different things",
    /*3*/ "Trouble relaxing",
    /*4*/ "Being so restless that it is hard to sit still",
    /*5*/ "Becoming easily annoyed or irritable",
    /*6*/ "Feeling afraid as if something awful might happen",
];

// Allowed answers with score mapping
const answers = [
    ["Not at all", 0],
    ["Several days", 1],
    ["More than half the days", 2],
    ["Nearly every day", 3],
];

// Severity stage
const phqSeverity = [
    ["0-4", "Minimal or no depression symptoms"],
    ["5-9", "Mild depression symptoms"],
    ["10-14", "Moderate depression symptoms"],
    ["15-27", "Moderately severe to severe depression symptoms"],
];

const phqRecommendations = [
    [
        "0-4",
        "If you score in this range, it's generally not necessary to visit a doctor solely based on your PHQ-9 score. However, if you have other concerns about your mental health or well-being, it's always a good idea to discuss them with a healthcare professional",
    ],
    [
        "5-9",
        "If you score in this range, it's recommended to consider seeking medical advice. While your symptoms may be mild, they could still benefit from professional assessment and support. Your doctor can help determine the best course of action, which may include monitoring your symptoms, counselling, or other treatment options.",
    ],
    [
        "10-14",
        "If you score in this range, it's advisable to seek medical attention. Moderate depression symptoms may significantly impact your daily functioning and quality of life. Your doctor can provide a thorough evaluation, offer support, and discuss treatment options such as therapy, medication, or a combination of both.",
    ],
    [
        "15-27",
        "If you score in this range, it's crucial to seek medical help promptly. These scores indicate a higher severity of depressive symptoms that may require more intensive intervention. Your doctor can conduct a comprehensive assessment, provide appropriate treatment, and ensure you receive the support you need to manage your symptoms effectively.",
    ],
];

const gadSeverity = [
    ["0-4", "Minimal or no anxiety symptoms"],
    ["5-9", "Mild anxiety symptoms"],
    ["10-14", "Moderate anxiety symptoms "],
    ["15-27", "Severe anxiety symptoms"],
];

const gadRecommendations = [
    [
        "0-4",
        "If you score in this range, it's typically not necessary to visit a doctor solely based on your GAD-7 score. However, if you have other concerns about your mental health or well-being, it's always a good idea to discuss them with a healthcare professional.",
    ],
    [
        "5-9",
        "If you score in this range, it's recommended to consider seeking medical advice. Mild anxiety symptoms may still impact your daily life and well-being. Your doctor can provide guidance, support, and discuss potential treatment options, such as therapy or lifestyle changes.",
    ],
    [
        "10-14",
        "If you score in this range, it's advisable to seek medical attention. Moderate anxiety symptoms may significantly affect your quality of life and functioning. Your doctor can conduct a comprehensive evaluation, offer treatment options, and help you manage your symptoms effectively.",
    ],
    [
        "15-27",
        "If you score in this range, it's crucial to seek medical help promptly. Severe anxiety symptoms can be debilitating and may require professional intervention. Your doctor can provide urgent support, recommend appropriate treatment, and help you develop coping strategies to manage your symptoms.",
    ],
];

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

    // Set event listener to target 'Enter' keydown event, wchich by default submits the form
    htmlQuestionnaire.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            // Prevent the default behavior of form submission
            event.preventDefault();
        }
    });

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
            //clear sections
            clearHtmlQuestionnaire();
            clearScoreSection();
            // Reset the counter
            currentStep = 1;

            if (questionnaireId === "phq9") {
                document.getElementById("gad7").parentNode.style.display = "none";
            }

            if (questionnaireId === "gad7") {
                document.getElementById("phq9").parentNode.style.display = "none";
            }

            //if age form was previously displayed on screen, clear the content
            if (ageForm) {
                ageForm.innerHTML = "";
            }

            // clear text in user age feedback under the age form, only if previously was displayed on screen
            if (userAgeFeedback) {
                userAgeFeedback.innerHTML = "";
            }

            // Check what questionnaire was triggered, find related questins and pass it as arguments to anoder function
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
            userAgeFeedback.style.display = "block";
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
                    ageForm.parentNode.style.display = "none";
                    userAgeFeedback.style.display = "none";
                    displayQuestions(questions, questionnaireId);
                } else {
                    userAgeFeedback.innerHTML = handlingOutcome;
                }
            });
        }
    }

    /**
     * Target user age form and fill in with HTMl snippet
     * It will display element first as by default it is hidden
     */
    function askUserAge() {
        document.getElementById("userAge").style.display = "block";
        document.getElementById("userAge").innerHTML = userAgeForm();
        //set focus on input  type number after ageForm is loaded
        document.getElementById("age").focus();
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
          <button type="submit" class="brown">Confirm</button>
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

            // Loop throught two dimensional array. Use first index only.
            for (let j = 0; j < answers.length; j++) {
                html += `<div class="group">
                <label for="answer${answerLoop}">${answers[j][0]}</label>
                <input type="radio" id="answer${answerLoop}" name="answer${i}" value="${answers[j][0]}" onclick="clearFeedback()">
                </div>`;
                answerLoop++;
            }

            html += `<p id="feedback${i}" class="feedback"></p>`;
            html += `<div class="buttons">`;

            // Display submit button in the last iteration of the loop
            if (i === 0) {
                html += `\n<button onclick="nextStep()" class="brown">Next</button>`;
            } else if (i < questions.length - 1) {
                html += '\n<button onclick="prevStep()" class="brown">Previous</button>';
                html += `\n<button onclick="nextStep()" class="brown">Next</button>`;
            } else {
                html += `\n<button onclick="prevStep()" class="brown">Previous</button>`;
                html += `\n<button type="submit" onclick="formSubmit(event)" class="brown">Submit</button>`;
            }

            html += `\n</div>\</div>`;
        }

        html += "\n</form>\n";

        return html;
    }

    /**
     * Display all questions
     * @param {Array} questions
     */
    function displayQuestions(questions, questionnaireId) {
        htmlQuestionnaire.style.display = "block";
        htmlQuestionnaire.innerHTML = multistepForm(questions, questionnaireId);
    }
});

/**
 * Set active class on sibling element when next button clicked. Request answer if not provided.
 */
function nextStep() {
    // let formName = htmlQuestionnaire.querySelector("form").getAttribute("id");

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
        displayResult(event);
    } else {
        requestAnswer();
    }
}

/**
 * Collect user answers and save in variable 'userResponses' array
 * @param {Event} event
 */
function collectAnswers(event) {
    let formId = event.target.parentNode.parentNode.parentNode.getAttribute("id");
    let form = document.getElementById(formId);
    userResponses = [];

    if (formId === "multistep-form-phq9") {
        for (let i = 0; i < phqQuestions.length; i++) {
            userResponses.push(form.querySelector('input[name="answer' + i + '"]:checked').value);
        }

        clearHtmlQuestionnaire();
    }

    if (formId === "multistep-form-gad7") {
        for (let i = 0; i < gadQuestions.length; i++) {
            userResponses.push(form.querySelector('input[name="answer' + i + '"]:checked').value);
        }

        clearHtmlQuestionnaire();
    }
}

/**
 * Calculate score
 * @returns {Number} - score
 */
function getScore() {
    let score = 0;

    // Based on user responses check in possible answer array if value exist
    // if exist, map the score which is stored in two dimensional table
    userResponses.forEach(function (value) {
        for (let i = 0; i < answers.length; i++) {
            if (value === answers[i][0]) {
                score += answers[i][1];
            }
        }
    });

    return score;
}

/**
 * Generate HTML and display result on screen
 * @param {Event} event
 */
function displayResult(event) {
    const scoreSection = document.getElementById("score");
    const formId = event.target.parentNode.parentNode.parentNode.getAttribute("id");
    //return value from anonymous function
    const questionnaire = (function () {
        if (formId.includes("phq9")) {
            return "PHQ-9";
        }
        if (formId.includes("gad7")) {
            return "GAD-7";
        }
    })();
    let score = getScore();
    let severity = getSeverity(formId);
    let recommendation = getRecommendations(formId);
    let scoreIteration = getIterationNo(score, severity);
    let html = `<p>Based on the answers provided and scoring according to ${questionnaire}, the results are as follows: </p>`;
    html += `<p>Score: ${score}</p>`;
    html += `<p>Severity: ${severity[scoreIteration][1]}</p>`;

    html += `<p>Recommendation: ${recommendation[scoreIteration][1]}</p>`;

    scoreSection.innerHTML = html;
}

/**
 * Calculates the iteration number in which it appears in the array based on the result.
 * @param {String} severity
 * @returns {Number} scoreIteration
 */
function getIterationNo(score, severity) {
    let splitSeverity = [];
    let scoreIteration = 0;
    let min = 0;
    let max = 0;

    for (let i = 0; i < severity.length; i++) {
        splitSeverity.push(severity[i][0].split("-"));
    }

    for (let i = 0; i < splitSeverity.length; i++) {
        min = splitSeverity[i][0];
        max = splitSeverity[i][1];

        if (score >= min && score <= max) {
            scoreIteration = i;
        }
    }

    return scoreIteration;
}

/**
 * Returns reference to appopriate severity array
 * @param {String} formId
 * @returns {String} severity
 */
function getSeverity(formId) {
    let severity;

    if (formId === "multistep-form-phq9") {
        severity = phqSeverity;
    }

    if (formId === "multistep-form-gad7") {
        severity = gadSeverity;
    }

    return severity;
}

/**
 * Returns reference to appopriate recommendation array
 * @param {String} formId
 * @returns {String} recommendation
 */
function getRecommendations(formId) {
    let recommendation;

    if (formId === "multistep-form-phq9") {
        recommendation = phqRecommendations;
    }

    if (formId === "multistep-form-gad7") {
        recommendation = gadRecommendations;
    }

    return recommendation;
}

/**
 * Clear 'htmlQuestionnaire' section
 */
function clearHtmlQuestionnaire() {
    htmlQuestionnaire.innerHTML = "";
}

/**
 * Clear 'score' section
 */
function clearScoreSection() {
    document.getElementById("score").innerHTML = "";
}
