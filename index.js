function playGame() {
	var level = 160; //Game level
	var wRect = 45; //Width 
	var hRect = 30; //Height
	var inScore = 50; //Score
	var snakeColor = "#ffffff"; //Snake color
	var cva; //Canvas attributes
	var tpd = []; //Storing directions
	var xDir = [-1, 0, 1, 0]; //Pos adjust
	var yDir = [0, -1, 0, 1]; //Pos adjust
	var queue = []; 
	var food = 1; //Staring length
	var map = [];
	var xPos = 5 + (Math.random() * (wRect - 10))|0; //Get x position
	var yPos = 5 + (Math.random() * (hRect - 10))|0; //Get y position
	var direction = Math.random() * 3 | 0; 
	var interval = 0;
	var score = 0;
	var sum = 0, easy = 0;
	var i, dir;
	
	//Getting play area 
	var c = document.getElementById('playArea');
	cva = c.getContext('2d');
	
	//Map positions
	for(i = 0; i < wRect; i++) {
		map[i] = [];
	}
	
	//Random placement of snake food
	function randFood() {
		var x, y;
		do {
			x = Math.random() * wRect|0;
			y = Math.random() * hRect|0;
		}
		while(map[x][y]) {
			map[x][y] = 1;
			cva.fillStyle = snakeColor;
			cva.strokeRect(x * 10 + 1, y * 10 + 1, 8, 8);
		}
	}
	
	//Default somewhere placement 
	randFood();
	function setGameSpeed() {
		if(easy) {
			xPos = (xPos + wRect) % wRect;
			yPos = (yPos + hRect) % hRect;
		}
		--inScore;
		if(tpd.length) {
			dir = tpd.pop();
			if((dir % 2) !== (direction % 2)) {
				direction = dir;
			}
		}
		
  	//Score count
		if((easy || (0 <= xPos && 0 <= yPos && xPos < wRect && yPos < hRect)) && 2 !== map[xPos][yPos]) {
			if(1 === map[xPos][yPos]) {
				score += Math.max(5, inScore);
				inScore = 50;
				randFood();
				food += 1; //Change food value;
			}
			//Replace BG point of snake/food
			cva.fillRect(xPos * 10, yPos * 10, 9, 9);
			map[xPos][yPos] = 2;
			queue.unshift([xPos, yPos]);
			xPos += xDir[direction];
			yPos += yDir[direction];
			if(food < queue.length) {
				dir = queue.pop();
				map[dir[0]][dir[1]] = 0;
				cva.clearRect(dir[0] * 10, dir[1] * 10, 10, 10);
			}
		} else if(!tpd.length) {
  			//End game screen
			var msgScore = document.getElementById("msg");
			msgScore.innerHTML = "Your Score : <b>"+
			score+"</b><br /><br /><input type='button' value='Play Again' onclick='window.location.reload();' />";
			document.getElementById("playArea").style.display = 'none';
			window.clearInterval(interval);
		}
	}
	
	//Assign move function to arrow keys
	interval = window.setInterval(setGameSpeed, level);
	document.onkeydown = function(e) {
		var code = e.keyCode - 37;
		if(0 <= code && code < 4 && code !== tpd[0]) {
			tpd.unshift(code);
		} else if (-5 == code) {
			if(interval) {
				window.clearInterval(interval);
				interval = 0;
			} else { 
				interval = window.setInterval(setGameSpeed, 300); //Change game speed
			}
		} else { 
			dir = sum + code;
			if(dir == 44 || dir == 94 || dir == 126 || dir == 171) {
				sum += code;
			} else if (dir === 218) { easy = 1; }
		}
	};
}
