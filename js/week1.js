const program_color = document.getElementById("program-color");
const program_input = document.getElementById("program-input");
const program_label = document.getElementById("program-label");
const program_result = document.getElementById("program-result");

const P1_LABEL = "Horoscope - Keberuntungan Anda Hari ini:";
const P2_LABEL = "FizzBuzz - Type a number:";
const P1_INPUT_STATUS = true;
const P2_INPUT_STATUS = false;
const P1_INPUT_PLACEHOLDER = "Input is not needed...";
const P2_INPUT_PLACEHOLDER = "Enter a number above 0 ...";
const P1_PROGRAM_NAME = "P1";
const P2_PROGRAM_NAME = "P2";

let current_program = P1_PROGRAM_NAME;

function toggleColor() {
  program_color.classList.toggle("bg-success");
  program_color.classList.toggle("bg-primary");
}

function clearScreen() {
  program_input.value = "";
  while (program_result.firstChild) {
    program_result.firstChild.remove();
  }
}

function setProgram(label, input_status, placeholder, program_name) {
  clearScreen();
  program_label.textContent = label;
  program_input.disabled = input_status;
  program_input.placeholder = placeholder;
  current_program = program_name;
}

const btn_P1 = document.getElementById("btn-P1");
btn_P1.addEventListener("click", function () {
  if (current_program != P1_PROGRAM_NAME) toggleColor();
  setProgram(P1_LABEL, P1_INPUT_STATUS, P1_INPUT_PLACEHOLDER, P1_PROGRAM_NAME);
});

const btn_P2 = document.getElementById("btn-P2");
btn_P2.addEventListener("click", function () {
  if (current_program != P2_PROGRAM_NAME) toggleColor();
  setProgram(P2_LABEL, P2_INPUT_STATUS, P2_INPUT_PLACEHOLDER, P2_PROGRAM_NAME);
});

function alert(message, type) {
  let wrapper = document.createElement("div");

  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria - label="Close" ></button ></div > ';

  // prepend = add to top of element so the new alerts are showed on the top part
  program_result.prepend(wrapper);
}

function weightedRandom(prob) {
  // From https://redstapler.co/javascript-weighted-random/
  let i, sum = 0, r = Math.random();
  for (i in prob) {
    sum += prob[i];
    if (r <= sum) return i;
  }
}

function calcHoroscope() {
  let result, type;

  // Probability
  // Hebat = 20%
  // Boleh Juga = 60%
  // Mengerikan = 20%
  switch (Math.floor(weightedRandom({ 0: 0.2, 1: 0.6, 2: 0.2 }))) {
    case 0:
      result = 'Hebat!!';
      type = 'primary';
      break;
    case 1:
      result = "Boleh juga!";
      type = 'success';
      break;
    case 2:
      result = "Mengerikan...";
      type = 'danger';
      break;
  }

  return [result, type];
}

function calcFizzBuzz() {
  let result, type;

  const fizz = (program_input.value % 3) == 0;
  const buzz = (program_input.value % 5) == 0;

  if (isNaN(program_input.value) || program_input.value < 1) {
    result = "invalid input";
    type = "danger";
  } else if (fizz && buzz) {
    result = "FizzBuzz!";
    type = "primary";
  } else if (fizz) {
    result = "Fizz!";
    type = "success";
  } else if (buzz) {
    result = "Buzz!";
    type = "info";
  } else {
    result = program_input.value;
    type = "secondary";
  }

  return [result, type];
}

function runProgram() {

  let [result, type] = (current_program == P1_PROGRAM_NAME) ? calcHoroscope() : calcFizzBuzz();

  alert(result, type);
}