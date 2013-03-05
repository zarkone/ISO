angular.module("game", []).
	factory("lab1", function () {
		
		var lab1 = {};

		lab1.A = [8,13,6,3,10];
		lab1.B = [1,4,10,5,3];
		lab1.C = [1,2,3,4,5];

		/**
		 * Returns max array element. Wnumberely used in this lab.
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
		 * Returns min array element. Wnumberely used in this lab.
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
		 * @return {Integer}    waiting time.
		 */
		lab1.X = function (K) {

			return getMax(K).value;
		};

		/**
		 * Create depended sequence to draw 3rd-level depended sequences.
		 * This helps to create `B` pseudo-sequence and pass it when draw `C`.
		 *  
		 * @param 	{Array} A 	First sequence
		 * @param 	{Array} B 	Second sequence, depends on A
		 * @return 	{Array}  	Third sequence, represents pseudo-B sequnce for drawing.
		 */
		lab1.createPseudo = function(A, B) {
			var ASum = 0, BSum = 0, pBi = 0;
			var pseudoB = [];

			var seqLen = A.length, i;
			ASum = A[0];
			BSum = B[0];
			pseudoB.push(A[0] + B[0]);

			for (i = 1; i < seqLen; i++){
				ASum += A[i];
				pBi = B[i];

				/**
				 * Caution! works, but don't know why, may be wrong calculation!
				 */
				if (ASum >= BSum) {
					pBi += A[i] - B[i-1] ;
					BSum = ASum + B[i];
				}  else {
					BSum += B[i];
				}
				

				pseudoB.push(pBi);
			}

			return pseudoB;

		};

		/**
		 * Johnson optimize alhorythm.
		 * @param  {[Object} sequences
		 * @return  {[Object} 
		 * 
		 */
		lab1.optimize = function (sequences, sequenceCount) {

		 	// clone input sequences
		 	var A = sequences.A.slice(0);
		 	var B = sequences.B.slice(0);

		 	var newSequences = {};
		 		newSequences.A = [];
		 		newSequences.B = [];

		 	if(sequenceCount == 3)	{

		 		var E = [], D = [];
			 	
			 	var C = sequences.C.slice(0);
		 		newSequences.C = [];

		 		sequences.A.forEach(function (el, i) {
		 			D[i] = A[i] + B[i];
		 			E[i] = B[i] + C[i];
		 		});

		 	}

		 	var minA = 0, 
		 		minB = 0, 
		 		min = {},

		 		begin = 0,
		 		end = A.length - 1,
		 		insertTo = 0;


		 	while(A.length > 0) {
		 		
		 		minA = (sequenceCount == 3) ? getMin(D) : getMin(A);
		 		minB = (sequenceCount == 3) ? getMin(E) : getMin(B);

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

	 			if (sequenceCount == 3) {
	 				newSequences.C[insertTo] = C[min.index];
		 			D = D.slice(0,min.index).concat( D.slice(min.index+1) );
		 			E = E.slice(0,min.index).concat( E.slice(min.index+1) );
		 			C = C.slice(0,min.index).concat( C.slice(min.index+1) );

	 			}
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

			seq.forEach (function (el, i) {

				size.w = el * scale;

				if(depSeq !== undefined) {

					if(i > 0) {
						point.left += Math.max(seq[i-1], depSeq[i]) * scale + 2;
					}
					else {
						point.left += depSeq[i] * scale + 2;
					}
				}

				drawRect(ctx, name + (i +1), color, point, size);

				if (depSeq == undefined) {
					point.left += size.w + 2;
				}

			});
		}
		
		return lab1;
	});


/**
 * 
 * Angular controller.
 * 
 */
function Lab1Ctrl ($scope, lab1) {

	/**
	 * Sequence count switcher. Switches between parts of lab.
	 */
	
	$scope.sequenceCount = 2;

	$scope.sequenceCountOptions = [
		{number: 2, label: "2 последовательности"},
		{number: 3, label: "3 последовательности"}
	];
	$scope.columns = new Array('A', 'B', 'C');


	$scope.lab1 = lab1;
	$scope.lab1Optimized = $scope.lab1.optimize($scope.lab1, $scope.sequenceCount);
	$scope.lab1Optimized.K = $scope.lab1.K;
	$scope.lab1Optimized.X = $scope.lab1.X;

	// Fire my ugly optimize function when change lab varianst switcher.
	$scope.$watch('sequenceCount', function (newValue, oldValue) {
		if (newValue == oldValue) return;

		$scope.lab1Optimized = $scope.lab1.optimize($scope.lab1, $scope.sequenceCount);

		$scope.lab1Optimized.K = $scope.lab1.K;
		$scope.lab1Optimized.X = $scope.lab1.X;

		$scope.lab1Optimized.KValue = $scope.lab1Optimized.K($scope.lab1Optimized);
		$scope.lab1Optimized.XValue = $scope.lab1Optimized.X($scope.lab1Optimized.KValue);

		drawGraphs($scope.sequenceCount);

		
	});

	function drawGraphs(sequenceCount) {

		var point = {top: 20, left: 20};
		var ctx = document.getElementById("inputGraph").getContext("2d");
		ctx.clearRect(0,0,2000,2000);
		
		$scope.lab1.drawSequence(ctx,"#e00","A",point, $scope.lab1.A);
		
		point = {top: 80, left: 20};
		$scope.lab1.drawSequence(ctx,"#00e","B",point, $scope.lab1.B, $scope.lab1.A);
		
		if(sequenceCount == 3) {
			var pseudoB = lab1.createPseudo($scope.lab1.A, $scope.lab1.B);
			$scope.lab1.drawSequence(ctx,"#0e0","C",point, $scope.lab1.C, pseudoB) ;
		}

		$scope.lab1.KValue = $scope.lab1.K($scope.lab1);
		$scope.lab1.XValue = $scope.lab1.X($scope.lab1.KValue);

		var BSum = 0;
		$scope.lab1.B.forEach (function (el){ BSum += el; });
		$scope.lab1.BSum = BSum;
		$scope.lab1.TValue = BSum + $scope.lab1.XValue;

		point = {top: 20, left: 20};
		ctx = document.getElementById("optimizedGraph").getContext("2d");
		ctx.clearRect(0,0,2000,2000);

		$scope.lab1.drawSequence(ctx,"#e00","A",point, $scope.lab1Optimized.A);
		
		point = {top: 80, left: 20};
		$scope.lab1.drawSequence(ctx,"#00e","B",point, $scope.lab1Optimized.B, $scope.lab1Optimized.A);

		$scope.lab1Optimized.B.forEach (function (el){ BSum += el; });
		$scope.lab1Optimized.BSum = BSum;
		
		$scope.lab1Optimized.KValue = $scope.lab1Optimized.K($scope.lab1Optimized);
		$scope.lab1Optimized.XValue = $scope.lab1Optimized.X($scope.lab1Optimized.KValue);
		$scope.lab1Optimized.TValue = BSum + $scope.lab1Optimized.XValue;

		if(sequenceCount == 3) {

			pseudoB = $scope.lab1.createPseudo($scope.lab1Optimized.A, $scope.lab1Optimized.B);
			point = {top: 140, left: 20};
			$scope.lab1.drawSequence(ctx,"#0e0","C",point, $scope.lab1Optimized.C, pseudoB) ;

			var CSum = 0;
			$scope.lab1.C.forEach (function (el){ CSum += el; });
			$scope.lab1.CSum = CSum;
			$scope.lab1Optimized.TValue = CSum + $scope.lab1Optimized.XValue;
			
		}
		

		BSum = 0;
	}
	drawGraphs($scope.sequenceCount);
	





}

