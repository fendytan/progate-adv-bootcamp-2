const program_color = document.getElementById("program-color");
const program_input = document.getElementById("program-input");
const program_label = document.getElementById("program-label");
const program_start_button = document.getElementById("program-start-button");
const program_result = document.getElementById("program-result");

const P1_LABEL = "Horoscope - Keberuntungan Anda Hari ini:";
const P2_LABEL = "FizzBuzz - Type a number:";
const P1_INPUT_PLACEHOLDER = "Input is not needed...";
const P2_INPUT_PLACEHOLDER = "Enter a number above 0 ...";

let current_program = "Horoscope";

function switchHoroscopeOrFizzBuzz(program_name) {
  if (current_program != program_name) {
    program_color.classList.toggle("bg-success");
    program_color.classList.toggle("bg-primary");

    program_input.value = "";

    program_label.textContent = (program_name == "Horoscope") ? P1_LABEL : P2_LABEL;
    program_input.disabled = (program_name == "Horoscope") ? true : false;
    program_input.placeholder = (program_name == "Horoscope") ? P1_INPUT_PLACEHOLDER : P2_INPUT_PLACEHOLDER;

    const temp = (program_name == "Horoscope") ? "startHoroscope()" : "startFizzBuzz()";
    program_start_button.setAttribute('onclick', temp);

    current_program = program_name;
  }
}

function clearScreen() {
  program_input.value = "";
  while (program_result.firstChild) {
    program_result.firstChild.remove();
  }
}

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

function startHoroscope() {

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

  alert(result, type);
}

function startFizzBuzz() {
  // const user_input_value = program_input.value;
  // console.log(user_input_value);
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

  alert(result, type);
}