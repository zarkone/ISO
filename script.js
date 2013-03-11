angular.module("game", []).
	factory("lab1", function () {
		
		var lab1 = {};

		lab1.A = [4,10,6,4,12];
		lab1.B = [1,4,10,5,3];

		/**
		 * Returns max array element. Widely used in this lab.
		 * @param  {Array} array 
		 * @return {Number}       
		 */
		function getMax(array) {
			var max = -Infinity;
			var index = 0;

			array.forEach (function (el, i) {
				if (el > max) {
					max = el;
					index = i;
				}
			});		

			return {'value': max, 'index': index};
		}
		/**
		 * Returns min array element. Widely used in this lab.
		 * @param  {Array} array 
		 * @return {Number}       
		 */

		function getMin(array) {
			var min = Infinity;
			var index = 0;

			array.forEach (function (el, i) {
				if (el < min) {
					min = el;
					index = i;
				}
			});		

			return {'value': min, 'index': index};
		}

		/**
		 * Pre-counts K-coefficients.
		 * 
		 * @param  {Object} sequences Object containing A and B sequences.
		 * @return {Array}  Array of K.
		 */ 
		lab1.K = function (sequences) {
		 	sequences = sequences || this;

			var AiSum = 0, 
				BiSum = 0;
			var i, sequenceLen = sequences.A.length; 
			var K = [];

			K[0] = sequences.A[0];

			for (i = 1; i < sequenceLen; i++) {
				K[i] = K[i-1] + sequences.A[i] - sequences.B[i-1];
			};

			return K;
		};

		/**
		 * Count waiting time, or suspend.
		 * 
		 * @param  {Array} K  K(U) coefficients.
		 * @return {[type]}    waiting time.
		 */
		lab1.X = function (K) {

			return getMax(K).value;

		};

		lab1.optimize = function (sequences) {
		 	sequences = sequences || this;
		 	
		 	// clone input sequences
		 	var A = sequences.A.slice(0);
		 	var B = sequences.B.slice(0);

		 	var newSequences = {};
		 		newSequences.A = [];
		 		newSequences.B = [];

		 	var minA = 0, 
		 		minB = 0, 
		 		min = {},

		 		begin = 0,
		 		end = A.length - 1,
		 		insertTo = 0;
		 	

		 	while(A.length > 0) {
		 		
		 		minA = getMin(A);
		 		minB = getMin(B);

		 		if(minA.value < minB.value) {
		 			insertTo = begin;
		 			begin++;
		 			min = minA;
		 		}
		 		else {
		 			insertTo = end;
		 			end--;
		 			min = minB;
		 		}

	 			newSequences.A[insertTo] = A[min.index];
	 			newSequences.B[insertTo] = B[min.index];

	 			// Unlink line from [A B] table
	 			A = A.slice(0,min.index).concat( A.slice(min.index+1) );
	 			B = B.slice(0,min.index).concat( B.slice(min.index+1) );
		 	}
			
			return newSequences;
		};

		/**
		 * Just draw rectangle. 
		 * @param  {Canvas 2D context} canvas [description]
		 * @param  {String} text   [description]
		 * @param  {String} color  [description]
		 * @param  {Object} point  [description]
		 * @param  {Object} size   [description]
		 */
		function drawRect(ctx, text, color, point, size) {
			

			ctx.lineWidth = 2;
			
			/* Rectangle */
			ctx.fillStyle = color;
			ctx.strokeStyle = "#000";
			ctx.strokeRect (point.left, point.top, size.w, size.h);
			ctx.fillRect (point.left, point.top, size.w, size.h);
			
			/* Text, on the center of rectangle*/
			ctx.fillStyle = "#000";
			ctx.font = "12pt Ubuntu";

			var textPos = {};
				textPos.x = point.left + (size.w/2) - 5;
				textPos.y = point.top + (size.h/2) + 5;

			ctx.fillText(text, textPos.x, textPos.y);
		}
		/**
		 * Static method to draw sequence.
		 * 
		 * @param  {Canvas 2D context} 	ctx 	Canvas context
		 * @param  {String} 			color	Color of blocks  
		 * @param  {String} 			name    A, B, C etc..
		 * @param  {Object} 			point  Where to start 
		 * @param  {Array} 				seq    Sequence to draw
		 * @param  {Array} 				depSeq Depending sequence
		 * @param  {Integer} 			scale  Scale coefficient
		 */
		lab1.drawSequence = function (ctx, colors, names, sequences, scale) {

			scale = scale || 20;
			var size = {w: 0, h: 30};
			var sum = new Array(sequences.length);

				for (var i = sequences.length - 1; i >= 0; i--) {
					sum[i] = 0;
				};

			var point = {left: 20, top: 20};
			var prevSum = 0, prevSeq = 0;

			sequences[0].forEach (function (s, k) {

				point.top = 20;
				sequences.forEach (function (sequence, i) {

					
					if(sequences[i-1] != undefined) {
						prevSeq = sequences[i][k-1] || 0;
						prevSum = sum[i-1];
					} else {
						prevSeq = 0;
						prevSum = 0;
					}

					size.w = sequence[k];
					size.w *= scale;

					point.left = Math.max(prevSum, sum[i]);
					point.left *= scale;
					
					// console.log(i, point.left);
					// console.log(i, size.w);

					drawRect(ctx, names[i] + k, colors[i], point, size);

					point.top += 50;
					sum[i] = Math.max(prevSum, sum[i]) + sequence[k];
		

				});
			});
			
		}
		
		return lab1;
	});


/**
 * 
 * Angular controller part.
 * 
 */
function Lab1Ctrl ($scope, lab1) {

	$scope.lab1 = lab1;
	var lab1Optimized = lab1.optimize();
	$scope.lab1Optimized = lab1Optimized;
	
	var ctx = document.getElementById("inputGraph").getContext("2d");
	var names = ["A", "B"];
	var colors = ["#e00", "#e0e"];

	lab1.drawSequence(ctx,colors,names, [lab1.A, lab1.B]);
	
	
}

