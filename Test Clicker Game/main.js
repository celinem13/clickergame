// Info for updating the game?
var timer = 256
var tickRate = 16
var visualRate = 256

// Base resources given to player at start of the game
var resources = {
        "student_souls":0,
        "class_spots": 1,
        }
// Costs of the first purchase of items
var costs = {
        "class_spots":10,
        "professor":20,
        "professor_sections":15,
        "major": 1000,
        "CAPS": 2,
        "building": 10000
        }
// What rate the cost changes per purchase
var growthRate = {
        "class_spots":1.1,
        "professor":2.88,
        "professor_sections":1.42,
        "major": 4,
        "CAPS" : 1.4,
        "building": 2.46
        }
var mood = {
    "happiness":100
}

// Holds the value of student_souls produced based on how many professors and class_spots there are (per tick?)
var increments = [
    {
        "input": ["professor", "professor_sections", "major", "building"],
        "output":"student_souls"}
        ]

// What value student_souls must be to reveal new buttons, and that those buttons are
var unlocks = {
        "class_spots":{"student_souls":5},
        "professor":{"student_souls":30},
        "professor_sections": { "professor": 1 },
        "major": { "professor": 5},
        "CAPS":{"major": 2},
        "happiness": {"CAPS": 1},
        "building": {"student_souls": 4000}
        }

// Funcion called when "Acquire Students' Souls" button is pressed
// Increases student_souls by the number of class_spots stored in resources
function getStudentSouls(num)
{
    resources["student_souls"] += num*resources["class_spots"]

    updateText()
};

// Funcion called when 'Increase Class Spots' button is pressed
// Checks if there is enough student_souls, then updates class_spots, student_souls, and class_spots cost
function increaseClassSpots(num) {
    if (resources["student_souls"] >= costs["class_spots"] * num) {
        resources["class_spots"] += num
        resources["student_souls"] -= num * costs["class_spots"]

        costs["class_spots"] *= growthRate["class_spots"]

        updateText()
    }
};

// Funcion called when 'Hire professor' button is pressed
// Checks if there is enough student_souls, then updates professor #, student_souls, and professor costs

function hireProfessor(num)
{
    if (resources["student_souls"] >= costs["professor"]*num)
    {
        /// If first time clicking button:

        // Set professor # to 0, so that it gets updated to 1 by the end of the function
        if (!resources["professor"])
        {
            initializeBonus()
        }

        /// All times the button is clicked:
        resources["professor"] += num
        resources["student_souls"] -= num*costs["professor"]
	
        costs["professor"] *= growthRate["professor"]

        if (resources["CAPS"]){
            calculateHappiness ()
        }

        updateText()
    }
};

function initializeBonus()
{
    resources["professor"] = 0
    resources["professor_sections"] = 1
    resources["major"] = 1
    resources["building"] = 1
};

// Funcion called when 'increase professor section' button is pressed
// Checks if there is enough student_souls, then updates student_souls, professor_section, and professor_section cost
function increaseProfessorSections(num)
{
    if (resources["student_souls"] >= costs["professor_sections"] * num) {
        resources["professor_sections"] += num
        resources["student_souls"] -= num * costs["professor_sections"]

        costs["professor_sections"] *= growthRate["professor_sections"]

        updateText()
    }
};

function increaseMajors(num)
{
    // Set major # to 0, so that it gets updated to 1 by the end of the function
    if (!resources["major"]) {
        resources["major"] = 0
    }

    if (resources["student_souls"] >= costs["major"] * num) {
        resources["major"] += num
        resources["student_souls"] -= num * costs["major"]

        costs["major"] *= growthRate["major"]
        costs["major"] = Math.round(costs["major"])

        if (resources["CAPS"]){
            calculateHappiness ()
        }

        updateText()
    }
};

// currently has no effecct on happiness, and costs class spots rather than student souls, for some varaity
function hireCAPS(num)
{
    if (!resources["CAPS"]) {
        resources["CAPS"] = 0
    }

    if (resources["class_spots"] >= costs["CAPS"] * num) {
        resources["CAPS"] += num
        resources["class_spots"] -= num * costs["CAPS"]

        costs["CAPS"] *= growthRate["CAPS"]
        costs["CAPS"] = Math.round(costs["CAPS"])

        calculateHappiness ()

        updateText()
    }
};

// Happiness is a function of (CAPS Persons / (Professor #) multiplied by 100 to turn into a percentage
// If happiness is < 80%, doc that percentage from total student souls
function calculateHappiness ()
{
    mood["happiness"] = ( resources["CAPS"] / resources["professor"] ) * 100

};


function increaseBuildings(num) {
    
    if (!resources["building"]) {
        resources["building"] = 0
    }

    if (resources["student_souls"] >= costs["building"] * num) {
        resources["building"] += num
        resources["student_souls"] -= num * costs["building"]

        costs["building"] *= growthRate["building"]

        updateText()
    }
};


//I don't think this needs to be touched? It seems to update whether text boxes are to be shown based on how much student_souls has been earned
function updateText()
{
    for (var key in unlocks)
    {
        var unlocked = true
        for (var criterion in unlocks[key])
        {
            unlocked = unlocked && resources[criterion] >= unlocks[key][criterion]
        }

        if (unlocked)
        {
            for (var element of document.getElementsByClassName("show_"+key))
            {
                element.style.display = "block"
            }
        }
    }
    
    for (var key in resources)
    {
        for (var element of document.getElementsByClassName(key))
        {
            //Round the soul total to a whole number
            element.innerHTML = Math.round(resources[key].toFixed(2))
        }
    }


    for (var key in costs)
    {
        for (var element of document.getElementsByClassName(key+"_cost"))
        {
            element.innerHTML = costs[key].toFixed(2)
        }
    }

    // Print Happiness
    for (var key in mood)
    {
        for (var element of document.getElementsByClassName(key))
        {
            element.innerHTML = mood[key].toFixed(2)
        }
    }
};


window.setInterval(function(){
    timer += tickRate

    // Creates auto
    for (var increment of increments)
    {
        total = 1

        //Professor automatic soul generation
        //total = professor_# and a 10% bonus per professor section

        //total *= increment[0] * (1 + 0.1 * increment[1])
        

        //total +=

        // Major bonus + (prof_sectionsb * major)
        //total += increment[0][1] * bonuses[0][0]

        
        for (var input of increment["input"]) {
            total *= resources[input]
        }

        // Happiness effects automatic soul output per tickRate, therefore will not subtract from toal soul output
        if (mood["happiness"] < 70){
            total = (1 - mood["happiness"]/100) * total
        }

        // 30% bonus if student happiness is at 100%
        if (mood["happiness"] === 100){
            total += total * 0.3
        }

        if (total)
        {
            console.log(total)
            resources[increment["output"]] += total/tickRate
        }
    }
    
    if (timer > visualRate)
    {
        timer -= visualRate
        updateText()
    }
  

}, tickRate);
