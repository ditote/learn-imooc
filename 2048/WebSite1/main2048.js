var board = new Array();  //游戏数据 4*4的格子数组
var score = 0;        //分数,原来的位置为空不加，两个相同数字相加
var hasConflicted = new Array(); //判断一个格子是否发生累加，做二维数组

//交互触控：两个事件（坐标）：开始，结束
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {  //将函数绑定到文档的就绪事件（当文档完成加载时）
    prepareForMobile();    //在js中调用尺寸
    newgame();
});

function prepareForMobile() {
    //网页版，大小不要改变了
    if (documentWidth > 420) {  //注意这里根据电脑屏幕大小而定，420=380+40；380=80*4+20*3；；（每个方格80px，宽20px，两边20px）
        gridContainerWidth = 420;
        cellSpace = 20;
        cellSideLength = 80;
    }

    //移动端对大方块进行取
    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i=0;i<4;i++)   //双重循环队每个小格子赋值
        for(var j=0;j<4;j++){
            //两个函数在support
            var gridCell = $('#grid-cell-' + i + "-" + j);  //变量gridCell代表小格子
            gridCell.css('top', getPosTop(i, j));  //GET - 从指定的资源请求数据..两种在客户端和服务器端进行请求-响应的常用方法是：GET 和 POST. 
            gridCell.css('left', getPosLeft(i, j));  //重新计算小格子的坐标
        }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();    //board原为一维数组，对每个变量遍历并声明为二维数组
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;     //游戏刚开始初始化为0
            hasConflicted[i][j] = 0;//初始情况下每个格子没有发生碰撞
        }       
    }

    updateBoardView();     //通知前端需要对number-cell显示上的设定
    score = 0;
    $('#score').text(score);
}

function updateBoardView() {
    //动态地把值代进去
    $(".number-cell").remove();   //如果当前游戏已经有number-cell值则删除
    for(var i=0;i<4;i++)
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' ); //注意ID的符号
  
            var theNumberCell = $('#number-cell-' + i + '-' + j);  //对每个number-cell样式设置

            if (board[i][j] == 0) {   //为0，显现不出来
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength/2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            }
            else {
                theNumberCell.css('width', cellSideLength );
                theNumberCell.css('height', cellSideLength );
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));//颜色根据数字不同
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]); //显示Number-Cell的值
            }

            hasConflicted[i][j] = false;//对number-cell的值进行设置后，碰撞归0
        }

    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.6*cellSideLength + 'px');
           
}
//判断能否生成数字（4*4是否还有空间）
function generateOneNumber() {

    if (nospace(board))
        return false;   //没有空间，游戏结束

   //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));//random()产生0-1的浮点数，floor取整，parseInt变整数型
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times<50) {  //优化：循环进行50次，如果还找不到空格，就人工寻找
        if (board[randx][randy] == 0)   //该位置为0可用
            break;

        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));

        times++;
    }
    if (times == 50) {
        for(var i=0;i<4;i++)
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);//通知在该位置显示数字

    return true;
}

$(document).keydown(function (event) {   //keydown 在玩家按下的事件，传入匿名参数
    //event.preventDefault();是按键的默认效果，防止滑动条随按键变化，最好按下面
    switch (event.keyCode) {
        case 37://left
            event.preventDefault();
            if (moveLeft()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38://up
            event.preventDefault();
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39://right
            event.preventDefault();
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40://down
            event.preventDefault();
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        default://default
            break;
    }
});

//添加两个事件监听器
document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend', function (event) {

    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    //(y轴向下)判断方向：|endx-startx|》|endy-starty|则在X轴移动，否则Y轴
    var deltax = endx - startx;//<0向左（负），>0正方向（右）
    var deltay = endy - starty;//<0向上（负），>0正方向（下）

    //如果用户的滑动的长度小于一定值，则不反应
    if (Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth)
        return;

    //大于则在x轴上移动
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if (deltax > 0) {
            //move right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
        else {
            //move left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    }
    //y
    else {
        if (deltay > 0) {
            //move down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
        else {
            //move up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    }
});

//判断游戏结束：4*4没有其他空间；；且不能移动（没有叠加）
function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

//
function gameover() {
    alert('gameover!');
}

//左移位置判断：落脚位置是否为空，落脚位置数字和待判定元素数字相同？移动路径是否有障碍物
function moveLeft() {

    if (!canMoveLeft(board))
        return false;

    //moveLeft
    for (var i = 0; i < 4;i++)
        for (var j = 1; j < 4; j++) {  //对后三列进行搜索
            if (board[i][j] != 0) {

                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);//移动的动画
                        board[i][k] = board[i][j];
                        board[i][j] = 0;//移动过去后
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //分数累加
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;//之前没碰撞，这次累加后就有了，下次同个方格不累加
                        continue;
                    }
                }
            }
        }
    
    setTimeout("updateBoardView()", 200);  //等待200ms后，执行函数对整体数据刷新
    return true;     
}

function moveRight() {

    if (!canMoveRight(board))
        return false;

    //moveRight
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >=0; j--) {  //对前三列进行搜索
            if (board[i][j] != 0) {

                for (var k = 3; k >j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);//移动的动画
                        board[i][k] = board[i][j];
                        board[i][j] = 0;//移动过去后
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] *= 2;
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);  //等待200ms后，执行函数对整体数据刷新
    return true;
}

//向上
function moveUp() {

    if (!canMoveUp(board))
        return false;

    //moveUp
    for (var j = 0; j < 4; j++) //列
        for (var i = 1; i < 4; i++) {  //对后三行进行搜索
            if (board[i][j] != 0) {

                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);//移动的动画
                        board[k][j] = board[i][j];
                        board[i][j] = 0;//移动过去后
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);  //等待200ms后，执行函数对整体数据刷新
    return true;
}

//向下
function moveDown() {

    if (!canMoveDown(board))
        return false;

    //moveDown
    for (var j = 0; j < 4; j++) //列
        for (var i = 2; i >=0; i--) {  //对前三行进行搜索
            if (board[i][j] != 0) {

                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);//移动的动画
                        board[k][j] = board[i][j];
                        board[i][j] = 0;//移动过去后
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);  //等待200ms后，执行函数对整体数据刷新
    return true;
}
