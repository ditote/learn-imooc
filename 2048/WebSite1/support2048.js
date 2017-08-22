//获取移动端尺寸
documentWidth = window.screen.availWidth;//当前设备中屏幕可用的宽度
gridContainerWidth = 0.92 * documentWidth;  //整个方块占比
cellSideLength = 0.18 * documentWidth;  //小格子的长度
cellSpace = 0.04 * documentWidth;  //小格子间隙宽度

function getPosTop(i, j) {  //计算格子的位置
    return cellSpace + i * (cellSpace+cellSideLength);
}

function getPosLeft(i, j) {
    return cellSpace + j * (cellSpace + cellSideLength);
}

function getNumberBackgroundColor(number) {
    switch (number) {
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67e5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048: return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192: return "#93c";break;
    }

    return "black";
}

function getNumberColor(number){
    if(number<=4)
        return "#776e85";

    return "white";
}

function nospace(board) {

    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] == 0)    //表明还有空间
                return false;

    return true;
}
//Left
function canMoveLeft(board) {

    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++)
            if (board[i][j] != 0)
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])//能否左移：左边是否没有数字，左边数字是否和自己相同，
                    return true;

    return false;
}
//Right
function canMoveRight(board) {

    for (var i = 0; i <4; i++)
        for (var j = 2; j >=0; j--)
            if (board[i][j] != 0)
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])//能否右移：右边是否没有数字，右边数字是否和自己相同，
                    return true;

    return false;
}
//up
function canMoveUp(board) {

    for (var j = 0; j < 4; j++)  
        for (var i = 1; i < 4; i++)  
            if (board[i][j] != 0)
                if (board[i-1][j] == 0 || board[i-1][j] == board[i][j])//能否左移：左边是否没有数字，左边数字是否和自己相同，
                    return true;

    return false;
}
//down
function canMoveDown(board) {

    for (var j=0; j<4; j++)  
        for (var i=2; i>=0; i--)  
            if (board[i][j] != 0)
                if (board[i+1][j ] == 0 || board[i+1][j] == board[i][j])//能否左移：左边是否没有数字，左边数字是否和自己相同，
                    return true;

    return false;
}

function noBlockHorizontal(row, col1, col2, board) {//判断左右是否有阻挡
    for (var i = col1 + 1; i < col2; i++)
        if (board[row][i] != 0)
            return false;
    return true;
}

function noBlockVertical(col, row1, row2, board) {//判断上下是否有阻挡
    for (var i = row1 + 1; i < row2; i++)
        if (board[i][col] != 0)
            return false;
    return true;
}

function nomove(board) {
    if (canMoveLeft(board) || canMoveRight(board)
        || canMoveUp(board) || canMoveDown(board))
        return false;

    return true;
}