angular.module("game", []).
	factory("lab1", function () {
		
		var lab1 = {};

		lab1.A = [4,30,6,4,2];
		lab1.B = [1,4,30,5,3];

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
		 * @param  {[type]} K  K(U) coefficients.
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

		return lab1;
	});


/**
 * 
 * Angular controller part.
 * 
 */
function Lab1Ctrl ($scope, lab1) {

	$scope.lab1 = lab1;
	$scope.lab1Optimized = lab1.optimize();
	console.log(lab1.X(lab1.K()));
	console.log(lab1.optimize());
}

