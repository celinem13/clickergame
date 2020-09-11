// Info for updating the game?
var timer = 256
var tickRate = 16
var visualRate = 256

// Base resources given to player at start of the game
var resources = {
        "student_souls": 0,
        "class_spots": 1,
        "professor": 0,
        "professor_sections": 0,
        "major": 0,
        "CAPS": 0,
        "building": 0
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
        "building": 6.7
        }

var mood = {
    // Set to 99% so no bonuses or detriments happen while player is still in early game
    "happiness":99
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
        "CAPS":{"major": 1.20},
        "happiness": {"CAPS": 1},
        "building": {"student_souls": 5000}
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

// Funcion called when 'increase professor section' button is pressed
// Checks if there is enough student_souls, then updates student_souls, professor_section, and professor_section cost
function increaseProfessorSections(num)
{
    if (resources["student_souls"] >= costs["professor_sections"] * num) {
        resources["professor_sections"] += num * 0.4
        resources["student_souls"] -= num * costs["professor_sections"]

        costs["professor_sections"] *= growthRate["professor_sections"]

        updateText()
    }
};

function increaseMajors(num)
{

    if (resources["student_souls"] >= costs["major"] * num) {
        resources["major"] += num * .6
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
    // Only allow Caps to be purchased if happiness is <= 100, should help prevent over 100% happiness
    if (mood["happiness"] <= 100){

        if (resources["class_spots"] >= costs["CAPS"] * num) {
            resources["CAPS"] += num
            resources["class_spots"] -= num * costs["CAPS"]

            costs["CAPS"] *= growthRate["CAPS"]
            costs["CAPS"] = Math.round(costs["CAPS"])

            calculateHappiness ()

            updateText()
        }
    }
};

// Happiness is a function of (CAPS Persons / (Professor #) multiplied by 100 to turn into a percentage
function calculateHappiness ()
{
    mood["happiness"] = ( resources["CAPS"] / resources["professor"] ) * 100

};


function increaseBuildings(num) {

    if (resources["student_souls"] >= costs["building"] * num) {
        resources["building"] += num * 1.2
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
            //Round the soul total, class spots, CAPS, and professor to a whole number
            if (key === "student_souls" || key === "class_spots" || key === "professor" || key === "CAPS"){
                element.innerHTML = Math.round(resources[key].toFixed(2))
            } else {
                element.innerHTML = resources[key].toFixed(2)
            }

        }
    }


    for (var key in costs)
    {
        for (var element of document.getElementsByClassName(key+"_cost"))
        {
            element.innerHTML = Math.round(costs[key].toFixed(2))
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
    if (resources["professor"] > 0 && resources["student_souls"] > 0)  {
        // Creates auto souls
        for (var increment of increments)
        {
            total = 1

            // Punishment for low student happiness, under 30% and starts to take away souls, how much is proportional to how low
            if (mood["happiness"] < 30){
                    total = (mood["happiness"] - 500)
            } else {
                tempbonus = 0
                //Automatic soul generation, this is incredibly inefficient, but it kept breaking when I tried to not use the for-loop
                for (var input of increment["input"]) {

                    if (input === "professor_sections")
                    {
                        // 40% bonus per section
                        tempbonus += resources["professor_sections"]

                    } else if (input === "major"){
                         // 60% bonus per major
                        tempbonus += resources["major"]

                    } else if (input === "building"){
                        // 120% bonus per building
                        tempbonus += resources["building"]

                    }
                }

                total = resources["professor"] + resources["professor"] * tempbonus

                // Happiness here effects automatic soul output per tickRate, therefore will not subtract from total soul output
                if (mood["happiness"] < 70){
                    total = (1 - mood["happiness"]/100) * total
                }

                // 30% bonus if student happiness is at 100%
                if (mood["happiness"] >= 100){
                    total += total * 0.3
                }

            }


            if (total)
            {
                console.log(total)
                resources[increment["output"]] += total/tickRate
            }
        }
    } else if (resources["student_souls"] < 0) {
        resources["student_souls"] = 0
    }
    
    if (timer > visualRate)
    {
        timer -= visualRate
        updateText()
    }
  

}, tickRate);
