angular.module("game", []).
	factory("lab1", function () {
		
		var lab1 = {};

		
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
					 	
		 	// clone input sequences
		 	var A = sequences[0].slice(0);
		 	var B = sequences[1].slice(0);

		 	var newSequences = [];
		 		newSequences[0] = [];
		 		newSequences[1] = [];

		 	if(sequences.length == 3) {
			 	
			 	var C = sequences[2].slice(0);
			 	newSequences[2] = [];

		 		for (var i = A.length - 1; i >= 0; i--) {
		 			A[i] += B[i];
		 			B[i] += C[i];
		 		};
		 	}

		 	var min0 = 0, 
		 		min1 = 0, 
		 		min = {},

		 		begin = 0,
		 		end = A.length - 1,
		 		insertTo = 0;
		 	
		 	while(A.length > 0) {
		 		
		 		min0 = getMin(A);
		 		min1 = getMin(B);

		 		if(min0.value < min1.value) {
		 			insertTo = begin;
		 			begin++;
		 			min = min0;
		 		}
		 		else {
		 			insertTo = end;
		 			end--;
		 			min = min1;
		 		}
	 			newSequences[0][insertTo] = A[min.index];
	 			newSequences[1][insertTo] = B[min.index];
			 	
			 	if(sequences.length == 3) { 

	 				newSequences[2][insertTo] = C[min.index];

	 				newSequences[0][insertTo] -= B[min.index] - C[min.index];
	 				newSequences[1][insertTo] -= C[min.index];

		 			C = C.slice(0,min.index).concat( C.slice(min.index+1) );
			 	}

	 			// Cross the line from table
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
		lab1.drawRect = function(ctx, text, color, point, size) {
			

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
		 * Static method to draw sequences.
		 * 
		 * @param  {Canvas 2D context} 	ctx 	Canvas context
		 * @param  {String} 			colors	Colors of blocks  
		 * @param  {String} 			names    A, B, C etc..
		 * @param  {Array} 				sequences    Sequences to draw
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

					lab1.drawRect(ctx, names[i] + k, colors[i], point, size);

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

	$scope.sequences = [];
	$scope.sequences[0] = [4,10,6,4,2];
	$scope.sequences[1] = [1,4,10,5,3];
	$scope.sequences[2] = [1,2,3,4,5];

	$scope.columns = ["Ai", "Bi", "Ci"];

	$scope.sequenceCount = 3;
	$scope.sequenceCountOptions = [];
	$scope.sequenceCountOptions[0] = {number: 2, label: "2 последовательности"};
	$scope.sequenceCountOptions[1] = {number: 3, label: "3 последовательности"};

	var names = ["A", "B", "C"];
	var colors = ["#e00", "#e0e", "#eee"];

	$scope.$watch('sequenceCount', function (newValue, oldValue) {
		console.log($scope.sequences.slice(0, $scope.sequenceCount));
		$scope.optimizedSequences = lab1.optimize($scope.sequences.slice(0, $scope.sequenceCount));
		
		var canvas = document.getElementById("inputGraph");
		var ctx = canvas.getContext("2d");

		lab1.drawRect(ctx, "", "#fff", {top: 0, left: 0}, {w: canvas.width, h: canvas.height});
		lab1.drawSequence(ctx,colors,names, $scope.sequences.slice(0, $scope.sequenceCount));
		

		canvas = document.getElementById("optimizedGraph");
		ctx = canvas.getContext("2d");
		
		lab1.drawRect(ctx, "", "#fff", {top: 0, left: 0}, {w: canvas.width, h: canvas.height});
		lab1.drawSequence(ctx,colors,names, $scope.optimizedSequences);


	});

}

