import readline from "readline-sync";

function prompt(text) {
    return readline.question(text);
}

// Skriv ett Quiz spel.

// Varför jag väljer en array med objekt
// När vi gör ett quiz behöver varje fråga ha två saker:
// 1. Själva frågan som ska visas (question)
// 2. Rätt svar (answer)
// Med objekt blir varje fråga självständig och tydlig.

const quizQuestions = [ // En array med objekt där varje objekt har två fält, question och answer
    { question: "What is the capital of Denmark? ", answer: "copenhagen" },
    { question: "What is the capital of France? ", answer: "paris" },
    { question: "What is the capital of Germany? ", answer: "berlin" },
    { question: "What is the capital of Norway? ", answer: "oslo" },
    { question: "What is the capital of Spain? ", answer: "madrid" }
];

let score = 0; // Här sparar vi antalet rätta svar

console.log("Welcome to the Quiz Game!\n"); // Välkomstmeddelande

for (let i = 0; i < quizQuestions.length; i++) {
    let userAnswer = prompt(quizQuestions[i].question).trim().toLowerCase();
    if (userAnswer === quizQuestions[i].answer) {
        console.log("Correct!");
        score++;
    } else {
        console.log(`Wrong! The correct answer was: ${quizQuestions[i].answer}`);
    }
}

// .trim() tar bort extra mellanslag innan och efter användarens svar
// .toLowerCase gör svaret till små bokstäver