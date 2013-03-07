angular.module("game", []).
	factory("lab1", function () {
		
		var lab1 = {};

		lab1.A = [4,10,6,4,12];
		lab1.B = [1,4,10,5,3];
		lab1.C = [1,2,3,4,5];

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
		 * @param  {Array} 	A
		 * @param  {Array} 	B
		 * @return {Array}  Array of K.
		 */ 
		lab1.K = function (A, B) {

			var AiSum = 0, 
				BiSum = 0;
			var i, sequenceLen = A.length; 
			var K = [];

			K[0] = A[0];

			for (i = 1; i < sequenceLen; i++) {
				K[i] = K[i-1] + A[i] - B[i-1];
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

		lab1.optimize = function (seqA, seqB) {
		 	
		 	// clone input sequences
		 	var A = seqA.slice(0);
		 	var B = seqB.slice(0);

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
		lab1.drawSequence = function (ctx, color, name, point, seq, depSeq, scale) {

			scale = scale || 20;
			var size = {w: 0, h: 30};

			seq.forEach(function (el, i) {

				size.w = el * scale;


				if(depSeq !== undefined) {

					if(i > 0) {
						point.left += Math.max(seq[i-1], depSeq[i]) * scale + 2;
					}
					else {
						point.left += depSeq[i] * scale + 2;
					}
				}

				drawRect(ctx, name + i, color, point, size);

				if (depSeq == undefined) {
					point.left += size.w + 2;
				}

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
	var lab1Optimized = lab1.optimize(lab1.A, lab1.B);
	$scope.lab1Optimized = lab1Optimized;
	
	var point = {top: 20, left: 20};
	var ctx = document.getElementById("inputGraph").getContext("2d");

	lab1.drawSequence(ctx,"#e00","A",point, lab1.A);
	
	point = {top: 80, left: 20};
	lab1.drawSequence(ctx,"#00e","B",point, lab1.B, lab1.A);
	
	point = {top: 20, left: 20};
	ctx = document.getElementById("optimizedGraph").getContext("2d");
	lab1.drawSequence(ctx,"#e00","A",point, lab1Optimized.A);
	
	point = {top: 80, left: 20};
	lab1.drawSequence(ctx,"#00e","B",point, lab1Optimized.B, lab1Optimized.A);
}

