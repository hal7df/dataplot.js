/**
 * equation.js -- scripts for evaluating symbolic equations
 */

function Equation (eqnStr) {
	if (typeof eqnStr !== "string")
		throw new TypeError ("Equation must be a string");
	
	//Split equation up by instances of addition/subtraction
	var splitEqn = eqnStr.split(/[+-](?![^\(]*\))/);
	
	
}