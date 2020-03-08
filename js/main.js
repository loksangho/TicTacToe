const Player = (symbol, name) => {

    return {
        symbol,
        name
    }
}

const displayController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let aiTrue;

    const initialiseGame = (aiTrue) => {



        this.aiTrue = aiTrue;
        if (!aiTrue) {
            let player1_val = document.getElementById("player_1_name_text").value;
            let player2_val = document.getElementById("player_2_name_text").value;

            player1 = Player("X", player1_val != "" ? player1_val : "Player 1 ('X')");
            player2 = Player("0", player2_val != "" ? player2_val : "Player 2 ('0')");
            document.getElementById("player_1_name_text").style.display = "none";
            document.getElementById("player_2_name_text").style.display = "none";
            document.getElementById("player1_name_display").textContent = player1_val != "" ? player1_val : "[Did not enter]";
            document.getElementById("player2_name_display").textContent = player2_val != "" ? player2_val : "[Did not enter]";
            document.getElementById("player1_name_display").style.display = "inline-block";
            document.getElementById("player2_name_display").style.display = "inline-block";
            currentPlayer = getRandomPlayer();
            showGameMessage(currentPlayer.name + "'s turn");
            gameBoard.startGame();
        } else {

            let player1_val = document.getElementById("player_1_name_text").value;

            player1 = Player("X", player1_val != "" ? player1_val : "Player 1 ('X')");
            player2 = Player("0", null);
            document.getElementById("player_1_name_text").style.display = "none";
            document.getElementById("player_2_name_text").style.display = "none";
            document.getElementById("player1_name_display").textContent = player1_val != "" ? player1_val : "[Did not enter]";
            document.getElementById("player2_name_display").textContent = "Computer";
            document.getElementById("player1_name_display").style.display = "inline-block";
            document.getElementById("player2_name_display").style.display = "inline-block";
            currentPlayer = getRandomPlayer();

            gameBoard.startGame();
            if (currentPlayer.name == null) {
                console.log("here");
                gameBoard.aiComputeMove(getComputerPlayerIfAIGame().symbol);
            }
        }
    }

    const getRandomPlayer = () => (Math.floor(Math.random() * 2) == 0 ? player1 : player2);

    const getAiTrue = () => aiTrue;

    const getCurrentPlayer = () => currentPlayer;

    const getHumanPlayerIfAIGame = () => player1;

    const getComputerPlayerIfAIGame = () => player2;


    const switchPlayer = () => {
        if (currentPlayer == player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    };

    const showGameMessage = (message) => document.getElementById("game_message").textContent = message;

    return {
        showGameMessage,
        getCurrentPlayer,
        initialiseGame,
        switchPlayer,
        getAiTrue,
        getHumanPlayerIfAIGame,
        getComputerPlayerIfAIGame,
    }

})();

const gameBoard = (() => {
    board_array = ["", "", "", "", "", "", "", "", ""];

    let gameEnd = true;

    const render = () => {
        let container = document.querySelector("#game_container");
        let child = container.lastElementChild;
        while (child) {
            container.removeChild(child);
            child = container.lastElementChild;
        }
        for (let i = 0; i < board_array.length; i++) {
            let new_div = document.createElement("div");
            new_div.textContent = board_array[i];
            new_div.setAttribute("data-cell-num", i);
            new_div.classList.add("game_board_cell");
            container.appendChild(new_div);
        }
    };

    const startGame = () => {
        board_array = ["", "", "", "", "", "", "", "", ""];
        gameEnd = false;
        render();
    }

    const checkWinLoseOrDraw = () => {
        if (checkWin("X", board_array)) {
            return "X";
        }
        if (checkWin("0", board_array)) {
            return "0";
        }
        if (!board_array.some(function (symbol) {
                return symbol == "";
            })) {
            return "D";
        }
        return null;
    }

    const checkWin = (symbol, board_array) => {
        for (let i = 0; i < board_array.length; i++) {
            //check first row
            if (board_array[0] == symbol) {
                if (board_array[1] == symbol && board_array[2] == symbol) {
                    return true;
                }
            }
            //check second row
            if (board_array[3] == symbol) {
                if (board_array[4] == symbol && board_array[5] == symbol) {
                    return true;
                }
            }
            //check third row
            if (board_array[6] == symbol) {
                if (board_array[7] == symbol && board_array[8] == symbol) {
                    return true;
                }
            }
            //check first column
            if (board_array[0] == symbol) {
                if (board_array[3] == symbol && board_array[6] == symbol) {
                    return true;
                }
            }
            //check second column
            if (board_array[1] == symbol) {
                if (board_array[4] == symbol && board_array[7] == symbol) {
                    return true;
                }
            }
            //check third column
            if (board_array[2] == symbol) {
                if (board_array[5] == symbol && board_array[8] == symbol) {
                    return true;
                }
            }
            //check \ diagonal
            if (board_array[0] == symbol) {
                if (board_array[4] == symbol && board_array[8] == symbol) {
                    return true;
                }
            }
            //check / diagonal
            if (board_array[2] == symbol) {
                if (board_array[4] == symbol && board_array[6] == symbol) {
                    return true;
                }
            }
            return false;
        }

    };

    const isMovesLeft = (board_array) => {
        return board_array.some(cell => cell == "");
    }

    const evaluate = (board_array) => {
        // Checking for Rows for X or 0 victory
        if (checkWin("X", board_array)) {
            if (displayController.getHumanPlayerIfAIGame().symbol == "X") {
                return -10;
            } else {
                return 10;
            }
        }
        if (checkWin("0", board_array)) {
            if (displayController.getHumanPlayerIfAIGame().symbol == "0") {
                return -10;
            } else {
                return 10;
            }
        }
        return 0;
    }

    const minimax = (board_array, depth, isMax) => {
        let score = evaluate(board_array);

        if (score == 10)
            return score;

        if (score == -10)
            return score;

        if (isMovesLeft(board_array) == false)
            return 0;

        if (isMax) {
            let best = -1000;

            for (let i = 0; i < board_array.length; i++) {
                if (board_array[i] == "") {
                    board_array[i] = displayController.getComputerPlayerIfAIGame().symbol;

                    best = Math.max(best, minimax(board_array, depth + 1, !isMax));
                    board_array[i] = "";
                }
            }



            return best;
        } else {
            let best = 1000;
            for (let i = 0; i < board_array.length; i++) {
                if (board_array[i] == "") {
                    board_array[i] = displayController.getHumanPlayerIfAIGame().symbol;

                    best = Math.min(best, minimax(board_array, depth + 1, !isMax));
                    board_array[i] = "";

                }
            }
            return best;


        }
    }

    const findBestMove = (board_array) => {
        let bestVal = -1000;
        let bestMove = -1;

        for (let i = 0; i < board_array.length; i++) {
            if (board_array[i] == "") {
                board_array[i] = displayController.getComputerPlayerIfAIGame().symbol;

                let moveVal = minimax(board_array, 0, false);
                board_array[i] = "";
                if (moveVal > bestVal) {
                    bestMove = i;
                    bestVal = moveVal;
                }
            }
        }
        return bestMove;

    }

    const aiComputeMove = (symbol) => {
        //    let testIndex;
        //    do {
        //        testIndex = Math.floor(Math.random() * 9)
        //    } while (board_array[testIndex] != "");

        //    board_array[testIndex] = symbol;

        let board_array_copy = [...board_array];

        board_array[findBestMove(board_array_copy)] = symbol;


        displayCorrectMessage();
        if (!gameEnd) {
            displayController.switchPlayer();
            let playerName = displayController.getCurrentPlayer().name;
            displayController.showGameMessage((playerName == null ? "Computer" : playerName) + "'s turn");
            render();
        }
    };

    const displayCorrectMessage = () => {
        let result = checkWinLoseOrDraw(board_array);
        let playerName = displayController.getCurrentPlayer().name;
        if (result == "X" || result == "0") {
            displayController.showGameMessage((playerName == null ? "Computer" : playerName) + " wins!");
            gameEnd = true;
        } else if (result == "D") {
            displayController.showGameMessage("It's a Draw!");
            gameEnd = true;
        } else {

        }
        render();
    }

    const setupListener = () => {
        document.addEventListener("click", function (e) {
            if (!gameEnd && e.target.classList[0] == "game_board_cell") {
                let array_index = e.target.getAttribute("data-cell-num")
                if (board_array[array_index] == "") {
                    board_array[array_index] = displayController.getCurrentPlayer().symbol;

                    displayCorrectMessage();
                    if (!gameEnd) {
                        displayController.switchPlayer();
                        if (aiTrue && displayController.getCurrentPlayer().name == null) {
                            // computer's turn
                            aiComputeMove(displayController.getCurrentPlayer().symbol);
                        } else {
                            let playerName = displayController.getCurrentPlayer().name;
                            displayController.showGameMessage((playerName == null ? "Computer" : playerName) + "'s turn");
                            render();
                        }
                    }

                }
            }
            if (e.target.id == "start_game") {
                displayController.initialiseGame(false);

            }
            if (e.target.id == "play_ai") {
                displayController.initialiseGame(true);

            }

        })
    };

    return {
        render,
        startGame,
        setupListener,
        checkWinLoseOrDraw,
        aiComputeMove,
    };

})();


gameBoard.setupListener();
gameBoard.render();
