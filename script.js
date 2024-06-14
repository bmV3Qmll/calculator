const output = document.getElementsByClassName("output")[0];
var start = false;
output.value = "0";
const ac = document.getElementById("AC");

regex = /-?\d*\.\d*?(?:0000|9999)\d$/;

var lt = null;
var op = null;
var curr = null;
var rt = null;
var op2 = null;
var onOp = false;
var neg = false;

function cal(a, oper, b) {
	switch (oper) {
	case "+":
		return a + b;
	case "-":
		return a - b;
	case "*":
		return a * b;
	case "/":
		return a / b;
	default:
		output.value = "the hell?";
	}
}

function reset() {
	lt = null;
	op = null;
	rt = null;
	op2 = null;
	start = false;
	neg = false;
}

function hard_reset() {
	reset();
	if (curr) curr.classList.remove("invert");
	curr = null;
	onOp = false;
}

function handle(event) {
	let btn = event.target;
	let v = btn.value;
	switch (v) {
	case "AC":
 		hard_reset();
 		break;
	case "C":
		reset();
		output.value = "0";
		ac.textContent = "AC";
		ac.value = "AC";
		break;
	case "+/-":
		if (output.value[0] == '-') {
			output.value = output.value.slice(1);
			neg = false;
		} else {
			output.value = '-' + output.value;
			if (output.scrollWidth > output.clientWidth) {
				output.style.fontSize = "38px";
			}
			neg = true;
		}
		break;
	case "%":
		if (onOp) break;
		let tmp = Number(output.value);
		tmp /= 100;
		output.value = String(tmp);
		break;
	case "/":
	case "*":
	case "-":
 	case "+":
 		if (op2) {
			rt = cal(rt, op2, Number(output.value));
			output.value = String(rt);
			neg = false;
			op2 = null;
 		} else if (op && "*/".includes(op)) {
 			lt = cal(lt, op, Number(output.value));
 			output.value = String(lt);
 			neg = false;
 			op = null;
 		}
 		if (onOp) {
 			curr.classList.toggle("invert");
 		} else {
 			onOp = true;
 		}
 		curr = btn;
 		curr.classList.toggle("invert");
 		break;
 	case "=":
 		if (onOp) {
 			curr.classList.toggle("invert");
 			onOp = false;
 			if (rt) {
 				if ("+-".includes(curr.value)) {
 					output.value = String(cal(cal(lt, op, rt), curr.value, Number(output.value)));
 				} else {
 					output.value = String(cal(lt, op, cal(rt, curr.value, Number(output.value))));
 				}
 			} else {
 				a = (lt) ? lt : Number(output.value);
 				output.value = String(cal(a, curr.value, Number(output.value)));
 			}
 		} else if (op2) {
 			output.value = String(cal(lt, op, cal(rt, op2, Number(output.value))));
 		} else if (op) {
 			output.value = String(cal(lt, op, Number(output.value)));
 		}
 		hard_reset();
		break;
	case '.':
	default:
		if (onOp) {
			curr.classList.toggle("invert");
			onOp = false;
			if (op) {
				if ("+-".includes(curr.value)) {
					lt = cal(lt, op, Number(output.value));
					if (rt) rt = null;
	 				op = curr.value;
				} else {
					rt = Number(output.value);
					op2 = curr.value;
				}
			} else {
				if (lt === null) lt = Number(output.value);
				op = curr.value;
			}
			start = false;
			neg = false;
		}
		if (!start) {
			if (v == "0" && ac.value == "AC") break;
			if (v == '.') {
				output.value = "0.";
			} else {
				output.value = v;
			}
			start = true;
			ac.textContent = "C";
			ac.value = "C";
		} else {
			output.value = output.value + v;
		}
	}

	let s = output.value;

	let ss = s.split('.')
	if (ss.length == 2 && ss[0].length + ss[1].length > 10) {
		s = s.slice(0, ss[0].length + 1 + 6);
	}
	if (regex.test(s)) {
		s = s.slice(0, -1);
		if (s.endsWith('9')) {
			s = s.replace(/9*$/, '');
			lastChar = s[s.length - 1];
			if (lastChar == '.') {
				s = s.slice(0, -1);
				lastChar = s[s.length - 1];
			}
			lastDigit = Number(lastChar) + 1;
			output.value = s.slice(0, -1) + String(lastDigit);
		} else {
			output.value = s.slice(0, -1).replace(/0*$/, '');
		}
	}
	if (output.style.fontSize == "38px" && !neg) {
		output.style.fontSize = "40px";
	}
	while (output.scrollWidth > output.clientWidth) {
		output.value = output.value.slice(0, -1);
	}
}

const btns = document.getElementsByTagName("button")
for (btn of btns) {
	btn.addEventListener("click", handle);
}