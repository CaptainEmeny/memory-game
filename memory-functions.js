const FRUITS = ['apple', 'pear', 'banana', 'strawberry', 'watermelon', 'kiwi', 'grape', 'mango', 'pineapple', 
                'orange', 'blueberry', 'raspberry', 'lemon', 'cherry', 'plum', 'coconut', 'peach', 'avacado',
                'blackberry', 'pomegranate', 'starfruit', 'dragon_fruit', 'lychee'];
let board = document.querySelector('.square-container');

let selected_square;

let remaining_squares;
let incorrect_guesses;

let fruits_left;

let game_fruits;
let game_started = false;

//Fruit Hiding
let shown_fruits_timer;
let fruits_hidden = true;
let wrong_fruit1;
let wrong_fruit2;

//Creates Rows and then makes several of them
function generateBoard(row, column){
    //Creates variables
    TOTAL_SQUARES = row * column;
    let memory_fruits = [];
    game_started = false;

    remaining_pairs = TOTAL_SQUARES/2;
    updatePairsLeft();

    incorrect_guesses = 0;
    updateWrong()

    //Creates board
    new_board = document.createElement("div");
    new_board.classList.add("square-container");

    //Creates array with fruits to be used for the game
    memory_fruits = randomArray(FRUITS , remaining_pairs);
    doubleArray(memory_fruits);
    shuffleArray(memory_fruits);

    current_fruit = 0;

    for(let i = 1; i <= row; i++){
        
        let square_row = document.createElement('div');
        square_row.classList.add('square-row')


        for(let j = 1; j <= column; j++){

            let square = document.createElement('div');
            square.classList.add("square");
            square.classList.add("unanswered");

            //Creates additional square info
            square.id = `S${i}-${j}`;
            square.fruit=memory_fruits[current_fruit];
            current_fruit++;

            showImage(square);

            //Binds the square to this specific function for deletion later
            square.boundPairCheck = pairCheck.bind(null, square);
            square.addEventListener('click', square.boundPairCheck);

            square_row.appendChild(square);
        }
    
        new_board.appendChild(square_row);
    }

    game_fruits = document.getElementsByClassName('square');
    startTimer();

    board.innerHTML = '';
    board.appendChild(new_board);}

//Creates a new array with the fruits that will be used
function randomArray(array, array_count){
    let temp_array = structuredClone(array);
    let small_array = [];

    for(let i = 0; i < array_count; i++){
        let array_index= (Math.floor(Math.random() * temp_array.length));

        small_array.push(temp_array[array_index]);
        temp_array.splice(array_index, 1);
    }

    return small_array;
}

//Doubles the array
function doubleArray(array){
    array = array.push(...array);
    return array;
}

//Shuffles the array
function shuffleArray(array){
    currentIndex = array.length;

    //Iterates through whole array
    while (currentIndex != 0){
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        //Swap the two index's
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

//Checks if the value passed is the same as the first square
function pairCheck(square){


    if (!game_started){
        hideAllImages(game_fruits);
    }

    if (selected_square === undefined){ //If no square is selected
        //Add selected_square to square
        selected_square = square;
        selected_square.classList.remove("unanswered");
        selected_square.classList.add("selected");


    } else if (square === selected_square) { //If the same square is selected again
        //Reset square
        square.classList.add("unanswered");
        selected_square.classList.remove("selected");
        selected_square = undefined;

    }   else { //If a second square is selected

        if (!fruits_hidden){
            clearTimeout(shown_fruits_timer);
            console.log(wrong_fruit1.id, wrong_fruit2.id)

            hideImage(wrong_fruit1);
            hideImage(wrong_fruit2);

        }

        showImage(selected_square);
        showImage(square);

        if (square.fruit === selected_square.fruit){
            //Reset square
            selected_square.classList.add("correct");
            selected_square.removeEventListener('click', selected_square.boundPairCheck);
            
            square.classList.add("correct");
            square.classList.remove("unanswered");
            square.removeEventListener('click', square.boundPairCheck);

            fruits_hidden = true;

            remaining_pairs -= 1;
            updatePairsLeft()
            playSound('munch-sound')
        } else {
            selected_square.classList.add("unanswered");
    

            //WRONG, answers are hidden
            wrong_fruit1 = square;
            wrong_fruit2 = selected_square;
            fruits_hidden = false;
            shown_fruits_timer = setTimeout(fruitTimer,2000);
            
            incorrect_guesses++;
            updateWrong()
        }

        selected_square.classList.remove("selected");
        selected_square = undefined;

    }

    //Checks for win
    if (remaining_pairs === 0){
        console.log("You win!")
        playSound('win-sound');
        alert("You win!");
    }
}

//Sets the logic behind starting the game
function fruitTimer(){
    hideImage(wrong_fruit1);
    hideImage(wrong_fruit2);
    fruits_hidden = true;
}
function startTimer(){
    setTimeout(hideAllImages,3000, game_fruits);
}
function hideAllImages(array){
    for (let i = 0; i < array.length; i++){
        hideImage(array[i]);
    }
    game_started = true;
}


//Shows and hides the background image
function showImage(object){
    object.style.backgroundImage = `url('images/fruits/${object.fruit}.png')`;
}
function hideImage(object){
    object.style.backgroundImage = 'none';
}

//Updates the number of incorrect guesses and pairs left
function updateWrong(){
    document.getElementById('wrong-tracker').innerHTML = `Wrong:<br>${incorrect_guesses}`;
}
function updatePairsLeft(){
    document.getElementById('pair-tracker').innerHTML = `Pairs Left: ${remaining_pairs}`;
}

//Plays the sound of the given object
function playSound(audio_object){
    let sound = document.getElementById(audio_object);
    sound.play();
}