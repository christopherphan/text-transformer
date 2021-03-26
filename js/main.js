
function alternatingCase(s){
    let letterNumber = -1;
    return s.split("").map(function(c){
        if (c.toUpperCase() != c.toLowerCase()){
            letterNumber++;
        }
        return desiredCase(c, letterNumber);
    }).join("");
}

function randomCaps(s){
    return s.split("").map(function(c){
        let x = Math.floor(Math.random()*2 + 1);
        return desiredCase(c, x);
    }).join("");
}

function rot13(s){
    return s.split("").map(function(c){
        if(c.match(/[A-Z]/)){
            return String.fromCharCode((c.charCodeAt(0) - 52) % 26 + 65);
        } else if (c.match(/[a-z]/)){
            return String.fromCharCode((c.charCodeAt(0) - 84) % 26 + 97);
        } else {
            return c;
        }
    }).join("");
}

function desiredCase(s, idx){
    if(idx % 2 == 0){
        return s.toUpperCase();
    } else {
        return s.toLowerCase();
    }
}

function checkCurrentChoice(currentOption){
    for (let index = 0; index < options.length; index++) {
        let checkbox = document.getElementById(`checkbox_${index}`);
        if (currentOption == index){
            checkbox.innerText = "X";
        } else {
            checkbox.innerText = " ";
        }
    }
}

function updateText(f){
    outbox.innerText = f(inbox.innerText);
}

function updateEvent(e){
    checkCurrentChoice(currentOption);
    updateText(options[currentOption]["function"]);
    allToChange.forEach(function(k, idx){
        k.innerText = options[currentOption]["function"](initialLabels[idx]);
    })
    descriptionDiv.innerText = options[currentOption]["function"](
            options[currentOption]["info"])
    outputSpan.innerText += " "+ options[currentOption]["function"](
        options[currentOption]["label"]); 
}

function clearAwayNoScript(){
    const apologies = [document.getElementById("cover_screen"), document.getElementById("sorry_text")];
    apologies.forEach(element => {
        element.setAttribute("class", "sorry-gone");
    });
    toggleAboutText();
}

function makeButtonListeners(elt, eltText, clickAction){

    function clickHandler(evt){
        eltText.setAttribute("class", "button button-highlight");
        let reset = setTimeout(function(){
            eltText.setAttribute("class", "button");
        }, highlightTime);
        clickAction(); 
    }

    function mouseoverHandler(evt){
        eltText.setAttribute("class", "button button-hover");
    }

    function mouseoutHandler(evt){
        eltText.setAttribute("class", "button");
    }

    elt.addEventListener("click", clickHandler);
    elt.addEventListener("mouseover", mouseoverHandler);
    elt.addEventListener("mouseout",  mouseoutHandler);
}

function toggleAboutText(evt){
    let state = aboutTextDiv.getAttribute("class");
    if (state == "text-hidden"){
        aboutTextDiv.setAttribute("class", "text-visible");
        aboutCloseButton.setAttribute("class", "button");
        clearButton.setAttribute("class", "button button-hidden");
        aboutCloseAnchor.setAttribute("class", "text-visible");
        changeSarcastic();
        sarcasticCycles = 0;
        sarcasticMin = false;
    } else {
        aboutTextDiv.setAttribute("class", "text-hidden");
        aboutCloseButton.setAttribute("class", "button button-hidden");
        aboutCloseAnchor.setAttribute("class", "text-hidden");
        clearButton.setAttribute("class", "button");
    }
}

function changeSarcastic(){
    let state = aboutTextDiv.getAttribute("class");
    if (state == "text-visible"){
        sarcasticCycles++;
        if (options[currentOption]["label"] == "rot13"){
            var newText = rot13(sarcasticOriginal);
        } else {
            var newText = sarcasticOriginal;
        }
        sarcasticText.innerText = randomCaps(newText);
        updateSarcasticTime();
        setTimeout(changeSarcastic, sarcasticTime());
    }
}

function sarcasticTime(){
    if (sarcasticMin){
        return minSarcasticTime;
    } else {
        let decayedTime = Math.floor(sarcasticInterval*(sarcasticDecay**sarcasticCycles));
        if (decayedTime <= minSarcasticTime){
            sarcasticMin = true;
            return minSarcasticTime;
        } else {
            return decayedTime;
        }
    }
}

function updateSarcasticTime(){
    if (showingSarcasticTime){
        descriptionDiv.innerText = options[currentOption]["function"](
            `Currently changing every ${sarcasticTime()} milliseconds.`);
    }
}


const clearButtonText = document.getElementById("clear_button_text");
const highlightTime = 250;
const sarcasticInterval = 500;
const sarcasticDecay = 0.99;
const minSarcasticTime = 5;
const mainDiv = document.getElementById("main");
const inbox = document.getElementById("inbox");
const outbox = document.getElementById("outbox");
const title = document.getElementById("title");
const allToChangeIDs = [
    "title", 
    "input_label", 
    "output_label", 
    "copyright_text", 
    "about_link_text",
    "clear_button_text", 
    "desc", 
    "github_link_text",
    "about_0",
    "about_1",
    "about_2",
    "about_3",
    "about_4",
    "about_5",
    "about_6"
]; 
const allToChange = allToChangeIDs.map(k => document.getElementById(k));
const outputSpan = document.getElementById("output_label");
const initialLabels = allToChange.map(k => k.innerText);
const descriptionDiv = document.getElementById("desc");
const clearButton = document.getElementById("clear_button");
const sourceButton = document.getElementById("github_link");
const sourceButtonAnchor = document.getElementById("github_link_a");
const sourceButtonText = document.getElementById("github_link_text");
const aboutButton = document.getElementById("about_link");
const aboutButtonText = document.getElementById("about_link_text");
const copyrightAnchor = document.getElementById("copyright_anchor");
const aboutTextDiv = document.getElementById("about_text");
const sarcasticText = document.getElementById("sarcastic");
const sarcasticOriginal = sarcasticText.innerText;
const licenseInfoDiv = document.getElementById("license_info");
const aboutCloseButton = document.getElementById("about_close");
const aboutCloseAnchor = document.getElementById("about_close_a");
const aboutCloseText = document.getElementById("about_close_text");
var showingSarcasticTime = false;
var sarcasticMin = false;

const options = [
    {"label": "Identity", "function": k => k, 
        "info": "Text remains unchanged."},
    {"label": "Alternating caps", "function": alternatingCase, 
        "info": "Letters alternate between uppercase and lowercase."},
    {"label": "Random caps", "function": randomCaps, 
        "info": "Letters are randomly set to uppercase or lowercase."},
    {"label": "rot13", "function": rot13, 
        "info": "Each letter is rotated 13 places in the alphabet."}
];

var currentOption = 0;
var sarcasticCycles = 0;

var optionSpans = new Array();
var checkBoxSpans = new Array();
const optionsDiv = document.getElementById("options");

options.forEach(function(option, idx){
    optionSpans[idx] = document.createElement("span");
    optionSpans[idx].setAttribute("class", "option");
    optionSpans[idx].setAttribute("id", `option_${idx}`);
    optionSpans[idx].setAttribute("style", `grid-area: 8/${idx+1}/9/${idx + 2}; margin-top: 5px;`);
    optionSpans[idx].innerHTML = `[<span id="checkbox_${idx}"> </span>] ${option["label"]}`;
    optionsDiv.appendChild(optionSpans[idx]);
    checkBoxSpans[idx] = document.getElementById(`checkbox_${idx}`);
    optionSpans[idx].addEventListener("click", function(e){
        optionSpans[idx].setAttribute("class", "option option-highlight");
        currentOption = idx;
        updateEvent();
        let reset = setTimeout(function(){
            optionSpans[idx].setAttribute("class", "option");
        }, highlightTime);
    });
    optionSpans[idx].addEventListener("mouseover", function(e){
        descriptionDiv.innerText = options[currentOption]["function"](
            options[idx]["info"]);
        optionSpans[idx].setAttribute("class", "option option-hover");
    });
    optionSpans[idx].addEventListener("mouseout", function(e){
        descriptionDiv.innerText = options[currentOption]["function"](
            options[currentOption]["info"]);
        optionSpans[idx].setAttribute("class", "option");
    });
});

makeButtonListeners(clearButton, clearButtonText,
    function(){
        inbox.innerText = "";
        updateEvent();}
);

makeButtonListeners(aboutButton, aboutButtonText, toggleAboutText);

aboutCloseAnchor.addEventListener("click", toggleAboutText);

licenseInfoDiv.addEventListener("mouseover", function(e){
    if (options[currentOption]["label"] != "Identity"){
        descriptionDiv.innerText = options[currentOption]["function"](
            "Sorry, I didn't want to mess up the license text.");
    }
});
licenseInfoDiv.addEventListener("mouseout", updateEvent);

sarcasticText.addEventListener("mouseover", function(e){
    showingSarcasticTime = true;
});
sarcasticText.addEventListener("mouseout", function(e){
    showingSarcasticTime = false;    
    updateEvent();
});

checkCurrentChoice(currentOption);
updateEvent();
clearAwayNoScript();

inbox.addEventListener("input", updateEvent);