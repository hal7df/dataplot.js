/**
 * equation.js -- scripts for evaluating symbolic equations
 * 
 * Copyright 2017 Paul Bonnen
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Equation (eqn) {
	if (typeof eqn !== "string")
		throw new TypeError ("Equation must be a string");
	
	eqn = eqn.replace(/([^$_]|^)(cos|sin|tan|ln|log|sqrt)/g,
	                  function (match, p1, p2) {
	   switch (p2) {
	   case "sin":
	   case "cos":
	   case "tan":
	   case "sqrt":
	       return "Math." + p2;
	   case "ln":
	       return "Math.log";
	   case "log":
	       return "Math.log10";
	   }
	   
	   return p2;
	});
	
	while (eqn.indexOf("^") >= 0) {
	    eqn = eqn.replace(/([\d\w.]+|\(.+\))+\^([\d\w.]+|\(.+\))/g,
	                      "Math.pow($1, $2)");
	}
}