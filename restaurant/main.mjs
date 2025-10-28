/*
Skapa en låtsas restaurang:
- Skapa en restaurang klass, person klass och food klass (skapa gärna fler klasser om du tycker att det behövs)
- Man skall kunna gå in i en restaurang (med en låtsas person), beställa mat, äta den och sedan betala
- Skapa kommandon för att göra ovanstående (exempelvis "create-person ironman", "select ironman", "enter-restaurant mcdonalds", "order burger")
*/

import readline from "readline-sync";

function prompt(text) {
    return readline.question(text);
} 


// En klass för maträtt. Varje Food-objekt har ett namn och ett pris.
class Food {
    constructor(name, price) {
        this.name = name; // Namnet på maten, t.ex. "burger"
        this.price = price; // Priset på maten i kronor
    }
}

// En klass för restaurang. Varje restaurang har ett namn och en meny.
class Restaurant {
    constructor(name) {
        this.name = name; // Namnet på restaurangen
        this.menu = [ // Skapar en enkel meny med några Food-objekt
            new Food("cheeseburger", 40),
            new Food("big mac", 70),
            new Food("french fries", 10),
            new Food("salad", 65)
        ];
    }

    showMenu() { // Skapar en metod som tillhör restaurangen, för att visa menyn
        console.log ("Menu at " + this.name + ":"); // Skriv ut restaurangens namn

        this.menu.forEach(food => console.log(food.name + " - " + food.price + " kr")); // Skriv ut alla rätter med pris, med en arrow function (=>) direkt i forEach

        /* Kan även skrivas:
        for (let i = 0; i < this.menu.length; i++) {
        let foodItem = this.menu[i]; // Ta varje maträtt
        console.log(foodItem.name + " - " + foodItem.price + " kr");
        } */
    }

    order(foodName) { // En metod för att kunna beställa mat från menyn
        const orderedFood = this.menu.find(f => f.name === foodName); // Hitta maten med matchande namn
        // this.menu -> listan med maträtter på menyn (array av Food-objekt)
        // .find(...) -> söker igenom listan och tar första objektet som matchar villkoret
        // f => f.name === foodName -> villkoret är: "ta den maträtt (f) vars namn (f.name) är samma som det personen vill beställa (foodName)"

        if (!orderedFood) { // Om maträtten inte finns på menyn
            console.log(foodName + " is not on the menu!");
            return null; // Eftersom maten inte hittades vill vi inte fortsätta med beställningen
        }
        console.log("Restaurant confirms your order: " + orderedFood.name); // Bekräfta beställningen
        return orderedFood; // return för att den som anropar metoden ska kunna använda objektet senare
    }
}

// Klass för person
class Person {
    constructor(name) {
        this.name = name;                 // Personens namn
        this.money = 100;                 // Startpengar
        this.currentFood = null;          // Håller reda på beställd mat
        this.currentRestaurant = null;    // Håller reda på restaurangen man är i 
    }

    // Metoden enter låter en person gå in i en restaurang och få se menyn
    enter(restaurant) {
        this.currentRestaurant = restaurant; // Spara restaurangen hos personen så vi vet var personen är
        console.log(this.name + " entered " + restaurant.name);
        restaurant.showMenu(); // Anropar metoden showMenu(), visar menyn när personen kommer in
    }

    // Metoden order låter personen beställa mat och sparar beställningen
    order(foodName) { // Metoden tar argumentet foodName (den beställda maträtten)
        
        // Kontrollerar om personen inte har gått in i någon restaurang ännu
        // Om inte, metoden avslutas med return
        if (!this.currentRestaurant) return console.log("You need to enter a restaurant first!");

        // Anropar restaurangens order(foodName)-metod, som letar upp maträtten på menyn och returnerar ett Food-objekt
        // Sparar det returnerade objektet i this.currentFood hos personen
        this.currentFood = this.currentRestaurant.order(foodName);
    }

    // Metoden eat för att äta maten
    eat() {
        if (!this.currentFood) return console.log("You have no food to eat.");
        console.log(this.name + " eats " + this.currentFood.name);
    }

    // Metoden pay för att personen ska betala för maten
    pay() {
        // Kontrollera om personen har beställt något
        if (!this.currentFood) return console.log("You haven't ordered anything.");

        // Kontrollera om personen har tillräckligt med pengar
        if (this.money < this.currentFood.price) return console.log("You don't have enough money!");

        // Dra av priset från personens pengar
        this.money -= this.currentFood.price;

        console.log(this.name + " paid " + this.currentFood.price + " kr. Money left: " + this.money + " kr");
        this.currentFood = null; // Rensa beställningen efter betalning -> maten är betald och currentFood blir null
        process.exit(); // Avslutar programmet
    }
}

// Skapar globala variabler (allPersons, allRestaurants, currentPerson) som håller koll på spelets tillstånd: alla personer, alla restauranger och vem som är aktiv.

// Ett objekt som fungerar som en lista på alla personer som skapats i programmet.
// Gör så att vi kan skapa och komma åt flera personer.
const allPersons = {}; 

// Ett objekt med alla tillgängliga restauranger.
// Värdena är Restaurant-objekt med namnet på restaurangen, meny och beställning.
const allRestaurants = {
    mcdonalds: new Restaurant("McDonalds"),
    max: new Restaurant("Max")
};

// En variabel som håller reda på vilken person som är "aktiv" just nu, personen som används i kommandon.
let currentPerson = null;


// Ett objekt som innehåller alla kommandon som användaren kan skriva
const commands = {
    "create-person": personName => {
        allPersons[personName] = new Person(personName); // Skapa ny person
        console.log("Person created: " + personName);
    },
    "select": personName => {
        if (!allPersons[personName]) return console.log("No person found with name " + personName);
        currentPerson = allPersons[personName]; // Välj personen
        console.log("Selected person: " + personName);
    },
    "enter-restaurant": restaurantName => { // Vald person går in i en restaurang
        if (!currentPerson) return console.log("Select a person first!");
        if (!allRestaurants[restaurantName]) return console.log("No restaurant found with name " + restaurantName);
        currentPerson.enter(allRestaurants[restaurantName]);
    },
    "order": foodName => { // Beställer en maträtt
        if (!currentPerson) return console.log("Select a person first!");
        currentPerson.order(foodName);
    },
    "eat": () => {
        if (!currentPerson) return console.log("Select a person first!");
        currentPerson.eat();
    },
    "pay": () => {
        if (!currentPerson) return console.log("Select a person first!");
        currentPerson.pay();
    }
};

// Funktion som ska tolka och köra användarkommandon, alltså koppla en text som användaren skriver till rätt funktion i programmet.
function runCommand(userInput) {
     // Ta bort mellanslag i början och slutet
    userInput = userInput.trim();

    // Delar upp texten i en lista med ord. Ex. "create-person ironman" -> ["create-person", "ironman"]
    const words = userInput.split(" ");
    
    // Första ordet i listan är själva kommandot, t.ex. "create-person"
    const commandWord = words[0];

    // Resten av orden blir argument till kommandot
    // slice(1) tar alla ord efter det första
    // join(" ") sätter ihop dem till en sträng igen
    const commandArguments = words.slice(1).join(" ");

    if (commands[commandWord]) { // Om kommandot finns i listan
        commands[commandWord](commandArguments); // Kör kommandot med argumenten
    } else {
        console.log("Unknown command.")
    }
}

while (true) {
    const input = prompt("> "); // Väntar på användarinmatning
    runCommand(input); // Kör kommandot
}

// ========================
// EXEMPEL PÅ ANVÄNDNING
// ========================
// create-person ironman
// select ironman
// enter-restaurant mcdonalds
// order cheeseburger
// eat
// pay