document.addEventListener('DOMContentLoaded', () => {
    let boardSize = 8;
    const boardElement = document.getElementById('board');
    const boardSizeInput = document.getElementById('boardSize');
    const startButton = document.getElementById('startButton');

    boardSizeInput.addEventListener('input', (event) => { // Changed from 'change' to 'input'
        const newSize = parseInt(event.target.value);
        if (newSize >= 4 && newSize <= 20) {
            boardSize = newSize;
            createBoard(boardSize);
        }
    });

    startButton.addEventListener('click', startVisualization);

    function createBoard(size) {
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateColumns = `repeat(${size}, 50px)`;
        boardElement.style.gridTemplateRows = `repeat(${size}, 50px)`;

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            const row = Math.floor(i / size);
            const col = i % size;

            if ((row + col) % 2 === 0) {
                cell.classList.add('white');
            } else {
                cell.classList.add('black');
            }

            boardElement.appendChild(cell);
        }
    }

    function visualizePlacement(row, col, isPlacing) {
        const cells = document.querySelectorAll('.cell');
        const cellIndex = row * boardSize + col;
        const cell = cells[cellIndex];
        if (cell) {
            cell.textContent = isPlacing ? 'Q' : '';   // Changed from '♛' to 'Q'
            cell.classList.toggle('queen', isPlacing);
        } else {
            console.error(`Cell at row ${row}, col ${col} does not exist.`);
        }
    }

    function clearBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('queen');
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function solveNQueens(board, row) {
        if (row === boardSize) {
            return true;
        }

        for (let col = 0; col < boardSize; col++) {
            if (isValid(board, row, col)) {
                board[row] = col;
                visualizePlacement(row, col, true);
                await sleep(300); // Reduced sleep time for faster visualization

                if (await solveNQueens(board, row + 1)) {
                    return true;
                }

                board[row] = -1;
                visualizePlacement(row, col, false);
                await sleep(300);
            }
        }
        return false;
    }

    function isValid(board, row, col) {
        for (let i = 0; i < row; i++) {
            if (board[i] === col || 
                board[i] - i === col - row || 
                board[i] + i === col + row) {
                return false;
            }
        }
        return true;
    }

    async function startVisualization() {
        clearBoard();
        startButton.disabled = true; // Disable button during visualization
        const board = Array(boardSize).fill(-1);
        const hasSolution = await solveNQueens(board, 0);

        if (hasSolution) {
            alert(`Successfully placed ${boardSize} queens on the board!`);
        } else {
            alert(`No solution found for the ${boardSize} board size.`);
        }
        startButton.disabled = false; // Re-enable button after visualization
    }

    createBoard(boardSize);
});
