(function() {

	var _ = self.Life = function(seed) {
		this.seed = seed;
		this.size = seed.length;
		this.board = clone2Darray(seed);
		this.prevBoard = [];
	};

	_.prototype = {
		next: function() {
			this.prevBoard = clone2Darray(this.board);

			for(var y = 0; y<this.size; y++) {
				for(var x = 0; x<this.size; x++) {
					var neighbours = this.aliveNeighbours(this.prevBoard,x,y);
					var alive = !!this.board[y][x];

					if(alive) {
						if(neighbours < 2 || neighbours > 3) {
							this.board[y][x] = 0;
						}
					} else {
						if(neighbours === 3) {
							this.board[y][x] = 1;
						}
					}
				}
			}

		},
		aliveNeighbours: function(array, x, y) {
			var prevRow = array[y-1] || [];
			var nextRow = array[y+1] || [];

			return [
				prevRow[x-1],prevRow[x],prevRow[x+1],
				array[y][x-1],array[y][x+1],
				nextRow[x-1],nextRow[x],nextRow[x+1]
			].reduce(function(previous, current){
				return previous + +!!current;
			},0);

		},
		toString: function() {
			return this.board.map(function(row) { return row.join(' ')}).join('\n ');
		}
	}

	function clone2Darray(array) {
		return array.slice().map(function(row){ return row.slice()});
	}

})();

(function() {
	var _ = self.LifeView = function(table, size) {
		this.grid = table;
		this.size = size;

		this.createGrid();
	};

	_.prototype = {
		createGrid: function() {
			var fragment = document.createDocumentFragment();
			this.grid.innerHTML = '';
			this.checkboxes = [];
			for(var y = 0; y<this.size; y++) {
				var row = document.createElement('tr');
				this.checkboxes[y] = [];
				for(var x = 0; x<this.size; x++) {
					var cell = document.createElement('td');
					var checkbox = document.createElement('input');
					checkbox.type = 'checkbox';
					this.checkboxes[y][x] = checkbox;
					cell.appendChild(checkbox);
					row.appendChild(cell);
				}
				fragment.appendChild(row);
			}
			this.grid.appendChild(fragment);
		},
		get boardArray() {
			return this.checkboxes.map(function(row) {
				return row.map(function(checkbox) {
					return +checkbox.checked;
				});
			});
		},
		play: function() {
			this.game = new Life(this.boardArray);
		},
		next: function() {
			this.game.next();

			var board = this.game.board;

			for(var y = 0; y<this.size; y++) {
				for(var x = 0; x<this.size;x++) {
					this.checkboxes[y][x].checked = !!board[y][x];
				}
			}
		}
	}

})();

var lifeView = new LifeView(document.getElementById('grid'),12);


