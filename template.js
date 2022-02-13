//Front End Functions:
//Describes the functions that I believe will be used on the front end (it's entirely possible that I end up using more than these)

function login(username, password){
    //Send the password to a hashing function that will return a hash value to query into the datbase with
    
    //Send the username to the database and get it's hash back

    //If nothing returns from the database, then the username is not in the database
    //If the hash returned from the database does not match the hash returned from the hashing function, then the password is incorrect
    //If the hash returned from the database matches the hash returned from the hashing function, then the password is correct

    //If the username and password are correct, then the user is logged in and the user is redirected to the home page

    //Set the user's role depending on whether or not they are an admin or a resident
    //If the user is an admin, then the user is redirected to the admin page
    //If the user is a resident, then the user is redirected to the resident page

}
function hash(password){
    //uses an sha algorithm to hash the password, returns that hash value
}

function search(plateNum){
    //Takes the plate number, and searches the database for the vehicle with that plate number

    //If the vehicle is found, then the vehicle is returned
    //If the vehicle is not found, then a message is printed to the screen and the attendant is able to "print" a ticket"
    //If the vehicle is found and the pass is expired, the attendant is able to "print" a ticket

}

function ticket(expired, plateNum){
    //if it is a ticket for an expired ticket 
        //print a ticket with a warning of pass expiration
        //the price will be $25
    //else
        //print a ticket with a price of $75
}

function handleSidebarClick(event){
    //This function handles the click event on the sidebar
    //depending on the value of the item clicked, the center panel will be switched out to the appropriate page
    //set a value to true or set it to a string value (depends on what works better) and use a v-if statement to dynamically insert the center panel
}

function addPass(passType){
    //navigates to the form view to add a new pass
    //passType is a string value that is either "resident" or "visitor"
}

function createPass(passType){
    //takes the form data and creates a new pass
    //passType is a string value that is either "resident" or "visitor"
    //generate an expiration date for the pass if it is a resident pass (july 31st of the current year or next year depending on when it is in the year)
    //use passBuilder to build the pass object to insert into mongoose
}

function passBuilder(){
    //builds the pass object to insert into mongoose
}

function handlePassRenewal(){
    //handler for pass renewal button
    //navigates to pass creation form
    //auto fills the form with the current pass information
    //allows user to update what they see fit
}

function renewPass(){
    //takes the form data and updates the pass
    //generate a new expiration date for the pass
    //calls passBuilder with the new information
}


//API methods
GET /passes/resident
GET /passes/visitors
GET /passes/resident/:id
GET /passes/visitor/:id

POST /passes/visitor
POST /passes/resident

PUT /passes/resident

DELETE /passes/resident/:id
DELETE /passes/visitor/:id

//DB Schema
let logins = {
    username: String,
    password: String,
    residentID: String,
    role: String
}

let residents = {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    apartment: String,
    building: String,
    residentID: String,  
}

let passes = {
    plateNum: String,
    passType: String,
    expiration: Date,
    vehicleMake: String,
    vehicleModel: String,
    vehicleColor: String,
    vehicleYear: String,
    residentID: String
}