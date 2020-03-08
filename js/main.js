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

    const initialiseGame = () => {
        let player1_val = document.getElementById("player_1_name_text").value;
        let player2_val = document.getElementById("player_2_name_text").value;
        
        player1 = Player("X", player1_val != "" ? player1_val : "Player 1 ('X')" );
        player2 = Player("0", player2_val != "" ? player2_val : "Player 2 ('0')");
        document.getElementById("player_1_name_text").style.display = "none";
        document.getElementById("player_2_name_text").style.display = "none";
        document.getElementById("player1_name_display").textContent = player1_val != "" ? player1_val : "[Did not enter]";
        document.getElementById("player2_name_display").textContent = player2_val != "" ? player2_val : "[Did not enter]";
        document.getElementById("player1_name_display").style.display = "inline-block";
        document.getElementById("player2_name_display").style.display = "inline-block";
        currentPlayer = player1;
        showGameMessage(currentPlayer.name + "'s turn")
        gameBoard.startGame();
    }

    const getCurrentPlayer = () => currentPlayer;

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
        if (checkWin("X")) {
            return "X";
        }
        if (checkWin("0")) {
            return "0";
        }
        if (!board_array.some(function (symbol) {
                return symbol == "";
            })) {
            return "D";
        }
        return null;
    }

    const checkWin = (symbol) => {
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

    const setupListener = () => {
        document.addEventListener("click", function (e) {
            if (!gameEnd && e.target.classList[0] == "game_board_cell") {
                let array_index = e.target.getAttribute("data-cell-num")
                if (board_array[array_index] == "") {
                    board_array[array_index] = displayController.getCurrentPlayer().symbol;
                    let result = checkWinLoseOrDraw();
                    if (result == "X" || result == "0") {
                        displayController.showGameMessage(displayController.getCurrentPlayer().name + " wins!");
                        gameEnd = true;
                    } else if (result == "D") {
                        displayController.showGameMessage("It's a Draw!");

                        gameEnd = true;
                    } else {
                        displayController.switchPlayer();
                        displayController.showGameMessage(displayController.getCurrentPlayer().name + "'s turn");
                    }
                    render();

                }
            }
            if (e.target.id == "start_game") {
                displayController.initialiseGame();

            }

        })
    };

    return {
        render,
        startGame,
        setupListener,
        checkWinLoseOrDraw,
    };

})();


gameBoard.setupListener();
gameBoard.render();
