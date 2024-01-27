// Patient Health Questionnaire 9-item depression scale (PHQ-9) 
const phqQuestions = [
    /*1*/'Little interest or pleasure in doing things', 
    /*2*/'Feeling down, depressed, or hopeless', 
    /*3*/'Trouble falling or staying asleep, or sleeping too much',
    /*4*/'Feeling tired or having little energy',
    /*5*/'Poor appetite or overeating',
    /*6*/'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
    /*7*/'Trouble concentrating on things, such as reading the newspaper or watching television',
    /*8*/'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
    /*9*/'Thoughts that you would be better off dead or of hurting yourself in some way'
];

// Generalised Anxiety Disorder (GAD-7)
const gadQuestions = [
    /*1*/'Feeling nervous, anxious or on edge',
    /*2*/'Not being able to stop or control worrying',
    /*3*/'Worrying too much about different things',
    /*4*/'Trouble relaxing',
    /*5*/'Being so restless that it is hard to sit still',
    /*6*/'Becoming easily annoyed or irritable',
    /*7*/'Feeling afraid as if something awful might happen'
];

// Possible answers 
const answers = [
    /*1*/'Not at all',
    /*2*/'Several days',
    /*3*/'More than half the days',
    /*4*/'Nearly every day'
];

// Counter for multistep form 
let currentStep = 1;

// User age - initiate with 0
let userAge = 0;

// Wait for the DOM to finish loading, before listening to questionnaire click event
// Get the questionnaires by class name and event listeners to them
document.addEventListener("DOMContentLoaded", function() {
  
    // Declare variable to target questionnaires class
    let questionnaires = document.getElementsByClassName("questionnaires");

    for (let questionnaire of questionnaires) {

        // Change pointer cursor when hovering over any of the questionnaires
        questionnaire.addEventListener("mouseover", function() {
            // Use 'this' keyword to know which element triggers the hover event
            this.style.cursor = "pointer";
        });

        // Set click event listener on the questionnaires
        questionnaire.addEventListener("click", function() {
            // Reset the counter
            currentStep = 1;
            // Display generated form in 'htmlQuestionnaire' section 
            if (questionnaire.getAttribute("id") === "phq9") {    
                displayQuestions(phqQuestions);
            } else if (questionnaire.getAttribute("id") === "gad7") {
                displayQuestions(gadQuestions);
           }
           else {
                alert("We are sorry! There is an error with selected screening tool");
           }
        });

    }

})

// Common functions for PHQ-9 and GAD-7

/**
 * Generate and return HTML snippet of all questions
 * @param {Array} questions - Array of all questions in questionnaire
 */
function generateMultistepForm(questions) {
    // Counter variable for purpose of generating unique id answers
    let answerLoop = 0;

    // Declare html variable to store html snippet 
    let html ='';

    html = `\n<h1>Over the last 2 weeks, how often have you been bothered by the following problems?</h1>`;
    html += `\n<form id="multistep-form" onsubmit="return false">`;

    // Loop through question
    for (let i = 0; i < questions.length; i++) {
        // Set first step active
        if (i === 0) {
            html += `\n<div id="step${i+1}" class="step active">`;
        } else {
            html += `\n<div id="step${i+1}" class="step">`;
        }
        
        html += `\n<h2>${questions[i]}</h2>`;
     
        for (let j = 0; j < answers.length; j++) {
            html += `
            <input type="radio" id="answer${answerLoop}" name="answer${i}" value="${answers[j]}" onclick="clearFeeback()">
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
            html += `\n<button type="submit" onclick="formSubmit(event)">Submit</button>`;
        }

        html += `\n</div>`;
    }

    html += '\n</form>\n';

    return html;
}

/**
 * Display all questions
 * @param {Array} questions 
 */
function displayQuestions(questions) {

    // Target htmlQuestionnaire section
    let htmlQuestionnaire = document.getElementById("htmlQuestionnaire");
    htmlQuestionnaire.innerHTML = generateMultistepForm(questions);

}

/**
 * Set active class on next/previous element. Request answer if not provided.
 */
function nextStep() {
    
    if (isChecked()) {
        document.getElementById('step' + currentStep).classList.remove('active');
        currentStep++;
        document.getElementById('step' + currentStep).classList.add('active');
    } else {
        requestAnswer();
    }

}

/**
 * Set active class on next/previous element
 */
function prevStep() {
    
    document.getElementById('step' + currentStep).classList.remove('active');
    currentStep--;
    document.getElementById('step' + currentStep).classList.add('active');

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
        if(radioGroup[i].checked === true) {
            checked = true;
            // Break loop if at least one radio button is checked
            break; 
        } 
    }

    return checked;

}

/**
 * Display feedback that answer has not been selected
 */
function requestAnswer() {

    document.getElementById(`feedback${currentStep - 1}`).innerText = "Please select your answer";

}

/**
*  Clears feedback section 
*/
function clearFeeback(){

    document.getElementById(`feedback${currentStep - 1}`).textContent = "";

};

/**
 * Takes control of form submission. Also ensures that the final question is answered.
 * @event event 
 */
function formSubmit(event) {
    
    if(isChecked()) {
        event.preventDefault(); // Prevent the form from submitting
    } else {
        requestAnswer();
    }
}

function collectAnswer() {
}

function calculateTotal() {
}

function displayUserAnswers(){
}

function displayResult() { 
}