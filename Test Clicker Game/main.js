// Info for updating the game?
var timer = 256
var tickRate = 16
var visualRate = 256

// Base resources given to player at start of the game
var resources = {
        "student_souls":0,
        "class_spots":1
        }
// Costs of the first purchase of items
var costs = {
        "class_spots":15,
        "professor":200,
        "professor_sections":15
        }
// What rate the cost change (per purchase?)
var growthRate = {
         "class_spots":1,
         "professor":2,
         "professor_sections":2
          }

// Holds the value of student_souls produced based on how many professors and class_spots there are (per tick?)
var increments = [
        {"input":["professor","professor_sections"],
        "output":"student_souls"}
         ]

// What value student_souls must be to reveal new buttons, and that those buttons are
var unlocks = {
        "class_spots":{"student_souls":10},
        "professor":{"student_souls":100},
        "professor_sections":{"professor":1}
        }

// Funcion called when "Acquire Students' Souls" button is pressed
// Increases student_souls by the number (of times the button is pressed?) by the number of class_spots stored under resources
function getStudentSouls(num)
{
    resources["student_souls"] += Math.round(num*resources["class_spots"])
    updateText()
};

// Funcion called when 'increase professor Pickax' button is pressed
// Checks if there is enough student_souls, then updates student_souls, professor pickax #, and professor pickax costs
function increaseProfessorSections(num)
{
    if (resources["student_souls"] >= costs["professor_sections"]*num)
    {
        resources["professor_sections"] += num
        resources["student_souls"] -= Math.round(num*costs["professor_sections"])
	
        costs["professor_sections"] *= growthRate["professor_sections"]
	
        updateText()
    }
};

// Funcion called when 'increase Pickax' button is pressed
// Checks if there is enough student_souls, then updates pickax #, student_souls, and pickax costs
function increaseClassSpots(num)
{
    if (resources["student_souls"] >= costs["class_spots"]*num)
    {
        resources["class_spots"] += num
        resources["student_souls"] -= Math.round(num*costs["class_spots"])
	
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
            resources["professor"] = 0
        }

        // Add a professor pickax so that the first professor can mine student_souls
        if (!resources["professor_sections"])
        {
            resources["professor_sections"] = 1
        }

        /// All times the button is clicked:
        resources["professor"] += num
        resources["student_souls"] -= Math.parseInt(num*costs["professor"])
	
        costs["professor"] *= growthRate["professor"]
	
        updateText()
    }
};


// I don't think this needs to be touched? It seems to update whether text boxes are to be shown based on how much student_souls has been earned
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
            element.innerHTML = resources[key].toFixed(2)
        }
    }

    for (var key in costs)
    {
        for (var element of document.getElementsByClassName(key+"_cost"))
        {
            element.innerHTML = costs[key].toFixed(2)
        }
    }
};


window.setInterval(function(){
    timer += tickRate

    
    for (var increment of increments)
    {
        total = 1
        for (var input of increment["input"])
        {
            total *= resources[input]
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
