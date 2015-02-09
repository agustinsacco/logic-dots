
// Main Logic Dots Function
function logicDots(){

	this.shuffleArray = function(o){
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}
	
	// Grid variables
	this.size = 0;
	this.grid = [];
	this.root = 0;
	this.numdots = 0;
	this.randGrid = [];
	this.dots = [];
	this.dotsSorted = [];
	this.blank = [];
	this.hints = 0;
	
	// Game play variables
	this.entered = [];
	this.enteredSorted = [];
}


logicDots.prototype.setVariables = function(){
	
	this.root = Math.sqrt(this.grid.length);
	this.numdots = (Math.floor(this.grid.length/2.5));
	this.moves = this.numdots;
	
	this.randGrid = this.shuffleArray(this.grid);
	this.dots = this.randGrid.slice(0,this.numdots);
	this.dotsSorted = this.dots.sort(function(a, b){return a-b});
	this.blank = this.shuffleArray(this.randGrid.slice(this.numdots, this.grid.length));
	this.hints = Math.ceil(this.root / 2);
	
	this.entered = [];
	this.enteredSorted = [];
}


logicDots.prototype.capacity = function(dimension){
	
	this.setSize = function(dim){
		this.size = dim;
	}
	
	this.setGrid = function(dim){
		var sqr = dim * dim;
		// First clear the grid array
		this.grid = [];
		// Repopulate
		for(var h=1; h <= sqr; h++){
			this.grid.push(h);
		}
	}
	
	this.setSize(dimension);
	this.setGrid(this.size);
}


logicDots.prototype.initialize = function(){

	this.initGridWrap = function(size){
		var wrap = $('#grid-wrap');
		var dimension = (size * 50) + 100;
		wrap.css({'width': dimension, 
				  'height': dimension,
				  'margin-left': -(dimension/2)
				});
	}
	
	this.initRow = function(size){
		var row = $('#grid-row');
		// Empty
		row.empty();
		// Width
		var width = 50 * size;
		row.css({'width': width});
		// Insert
		for(var h=1; h <= size; h++){
			row.append('<div class="rowcol x" id="'+h+'"></div>')
		}
	}
	
	this.initCol = function(size){
		var col = $('#grid-col');
		// Empty
		col.empty();
		// Width
		var width = 50 * size;
		col.css({'height': width});
		// Insert
		for(var h = 1; h <= size; h++){
			col.append('<div class="rowcol y" id="'+h+'"></div>');
		}
	}
	
	this.initGrid = function(size){
		var grid = $('#grid');
		// Empty
		grid.empty();
		// Width/Height
		var dimension = 50 * size;
		grid.css({'width': dimension, 'height': dimension});
		// Insert
		var sqr = size * size;
		for(var h = 1; h <= sqr; h++){
			grid.append('<div class="cell" id="'+h+'"></div>');
		}
	}
	
	this.initGridWrap(this.size);
	this.initRow(this.size);
	this.initCol(this.size);
	this.initGrid(this.size);
}


logicDots.prototype.initHints = function(){
	var hint = $('.give-hint');
	hint.html('hints ('+this.hints+')');
}


logicDots.prototype.randomize = function(){
	
	this.applyBlanks = function(blank){
		var less = Math.ceil(blank.length / 2.5)
		for	(var i=0; i <= less; i++){
			$('#grid #'+blank[i]).addClass('blank');
		}
	}
	
	// Function to populate column
	this.populateColumn = function(root, dots){
		for	(var i=1; i <= root; i++){
			var rowmax = root * i;
			var rowmin = rowmax - root;
			
			// Go through dot array and check if numbers lower than row needs
			var current = 0;
			for	(var h=0; h <= dots.length; h++){
				if(dots[h] > rowmin && dots[h] <= rowmax){
					current++;
				}
			}
			$('#grid-col').find('#'+i).text(current);
			current = 0;
		}
	}
	
	// Function to populate
	this.populateRow = function(root, dots){
		for	(var i=1; i <= root; i++){
			// We need an array of positions for each column
			var rowlist = [];
			var incrementer = i;
			
			for	(var s=1; s <= root; s++){
				rowlist.push(incrementer);
				incrementer += root;
			}
			
			// Go through dot array and check if numbers lower than row needs
			var current = 0;
			for	(var h=0; h <= dots.length; h++){
				if(rowlist.indexOf(dots[h]) != -1){
					current++;
				}
			}
			$('#grid-row').find('#'+i).text(current);
			current = 0;
		}
	}
	
	// Add the row and column values
	this.applyBlanks(this.blank);
	
	// Populate column numbers
	this.populateColumn(this.root, this.dots);
	
	// Populate row numbers
	this.populateRow(this.root, this.dots);
		
}


logicDots.prototype.applyDots = function(){
	for	(var i=0; i <= this.dots.length; i++){
		$('#grid #'+this.dots[i]).prepend('<div class="dot-actual"></div>');
	}
}
	

logicDots.prototype.removeDots = function(){
	for	(var i=0; i <= this.dots.length; i++){
		$('#grid #'+this.dots[i]).find('.dot-actual').remove();
	}
}
	

logicDots.prototype.clearGrid = function(){
	$('.cell').empty().removeClass('blank blankd');
}


logicDots.prototype.triggerCell = function(cellObject, clickType){
	
	this.removeDot = function(cell){
		cell.find('.dot').fadeOut(200, function(){ $(this).remove() });
	}
	
	this.insertDot = function(cell){
		cell.append($('<div class="dot"></div>').fadeIn(200));
	}
	
	this.removeBlank = function(cell){
		cell.removeClass('blankd');
	}
	
	this.insertBlank = function(cell){
		cell.addClass('blankd');
	}
	
	this.existsDot = function(cell){
		if(cell.find('.dot').length != 0){
			this.removeDot(cell);
			
			// Lets remove the cell from entered dots if exists
			var cellnum = parseInt(cell.attr('id'));
			var torem = this.entered.indexOf(cellnum);
			if(torem != -1)
				this.entered.splice(torem, 1);
		} 
		else if (cell.find('.dot').length === 0 && !cell.hasClass('blankd') && !cell.hasClass('blank')){
			this.insertDot(cell);
			
			// Lets apply the cell to entered dots if it doesnt exist
			var cellnum = parseInt(cell.attr('id'));
			var toadd = this.entered.indexOf(cellnum);
			if(toadd === -1)
				this.entered.push(cellnum);
		}
	}
	
	this.existsBlank = function(cell){
		if(cell.hasClass('blankd')){
			this.removeBlank(cell);
		}
		else if(cell.find('.dot').length === 0 && !cell.hasClass('blank')){
			this.insertBlank(cell);
		}
	}
	
	if(clickType == 'dot'){
		this.existsDot(cellObject);
	}
	else if(clickType == 'blankd'){
		this.existsBlank(cellObject);
	}
	
}


logicDots.prototype.checkCorrect = function(){
	// Assumes both arrays given are sorted
	this.compareArrays = function(array1, array2){
		// Lets check first if the lengths are even the same
		if(array1.length === array2.length){
			var status = true;
			for(var l=0; l <= array1.length; l++){
				if(array1[l] != array2[l]){
					status = false;
					break;
				}
			}
			return status;
		}
		else{
			return false;
		}
	}
	
	this.gameWon = function(blank, dots){
		// Lets add the rest of the blanks
		for	(var i=0; i <= blank.length; i++){
			var cell = $('#grid #'+blank[i]);
			if(!cell.hasClass('blank') && !cell.hasClass('blankd'))
				$('#grid #'+blank[i]).addClass('blankd');
		}
		
		// Now lets green out the dots
		for	(var i=0; i <= dots.length; i++){
			$('#grid #'+this.dots[i]).find('.dot').addClass('won');
		}
		
		// Finally lets disable the grid
		$('#grid').find('.cell').off();
		// Wait a bit and set the next level
		setTimeout(function(){
			$('#new-game').click();
		}, 1500);
	}
	
	// Lets sort the entered array;
	this.enteredSorted = this.entered.sort(function(a, b){return a-b});	
	
	if(this.compareArrays(this.dotsSorted, this.enteredSorted))
		this.gameWon(this.blank, this.dots);
}


logicDots.prototype.applyHint = function(){
	// Lets check if they have any hints left
	if(this.hints > 0){
		// Decrement hints
		this.hints--;
		
		// Get the difference between dots and entered
		var diff = $(this.dots).not(this.entered).get();
		// Now shuffle the diff and get first element
		var hint = this.shuffleArray(diff);
		// Add the chosen hint to entered dots
		this.entered.push(hint[0]);
		// Add dot
		var cell = $('#grid').find('#'+hint[0]);
		cell.append($('<div class="dot"></div>').fadeIn(200));
		//Update button
		var hint = $('.give-hint');
		
		if(this.hints >= 1)
			hint.html('hints ('+this.hints+')');
		else
			hint.html('none left');
	}
}


function playGame(logicDots){
		
	$(function(){
		
		// Lets start a 4x4 on load
		logicDots.capacity(4);
		logicDots.setVariables();
		logicDots.initialize();
		logicDots.initHints();
		logicDots.randomize();
			
		// Creates a new game (binded button)
		$('#new-game').click(function(){
			logicDots.clearGrid();
			logicDots.setVariables();
			logicDots.initialize();
			logicDots.initHints();
			logicDots.randomize();
		});
		
		// Sets the grid on dropdown change
		$('.set-grid').click(function(){
			var value = parseInt($(this).data('val'));
			if(value != 0){
				logicDots.capacity(value);
				logicDots.setVariables();
				logicDots.initialize();
				logicDots.initHints();
				logicDots.randomize();
			}
		});
		
		$('.give-hint').click(function(){
			logicDots.applyHint();
			// Lets see if we won after applying this hint
			logicDots.checkCorrect();
		});
		
		// Adds empty spot on the grid
		$('#grid').on('mousedown', '.cell', function(e){ 
		document.oncontextmenu = function() {return false;};
			if(e.button === 0){
				var self = $(this);
				var type = 'dot';
				logicDots.triggerCell(self, type);
				// Lets see if we won after applying last dot
				logicDots.checkCorrect();
				console.log(logicDots.dots, logicDots.entered);
			}
			else if(e.button === 2) { 
				var self = $(this);
				var type = 'blankd';
				logicDots.triggerCell(self, type);
			} 
			return true; 
		});
	
	});
}

/* ---------------------------------- */
// Lets initialize the logicDots object
/* ---------------------------------- */

var lg = new logicDots();
playGame(lg);
