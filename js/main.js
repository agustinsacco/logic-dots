// Globals
function logicDots(){

	this.shuffleArray = function(o){ //v1.0
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
	this.blank = [];
	
	// Game play variables
	this.moves = 0;
}

logicDots.prototype.play = function(){
	
}

logicDots.prototype.setVariables = function(){
	this.root = Math.sqrt(this.grid.length);
	this.numdots = (Math.ceil(this.grid.length/(this.root / 2)));
	this.moves = this.numdots;
	
	this.randGrid = this.shuffleArray(this.grid);
	this.dots = this.randGrid.slice(0,this.numdots);
	this.blank = this.shuffleArray(this.randGrid.slice(this.numdots, this.grid.length));
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
		wrap.css({'width': dimension, 'height': dimension});
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

logicDots.prototype.randomize = function(){
	
	this.applyHinters = function(blank){
		var less = Math.ceil(blank.length / 1.3)
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
	this.applyHinters(this.blank);
	
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
	$('.cell').empty().removeClass('blank');
}

logicDots.prototype.triggerCell = function(cellObject){
	
	this.removeDot = function(cell){
		cell.find('.dot').remove();
	}
	
	this.insertDot = function(cell){
		cell.append('<div class="dot"></div>');
	}
	
	this.exists = function(cell){
		if(cell.find('.dot').length != 0)
			this.removeDot(cell);
		else if(cell.find('.dot').length === 0 && !cell.hasClass('blank'))
			this.insertDot(cell);
	}
	
	this.exists(cellObject);
}

/* ---------------------------------- */
// Lets initialize the logicDots object
/* ---------------------------------- */

var g = new logicDots();

// Menu Events
$(function(){

	$('#new-game').click(function(){
		g.clearGrid();
		g.setVariables();
		g.randomize();
	});
	
	$('#erase-grid').click(function(){
		g.clearGrid();
	});
	
	$('#apply-dots').click(function(){
		g.applyDots();
	});
	
	$('#remove-dots').click(function(){
		g.removeDots();
	});
	
	$('#set-grid').click(function(){
		var value = $('#grid-size').val();
		g.capacity(value);
		g.setVariables();
		g.initialize();
		g.randomize();
	});
	
	$('#grid').on('click', '.cell', function(){
		var self = $(this);
		g.triggerCell(self);
	});
});