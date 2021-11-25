const btn_A = document.querySelector(".a");
const btn_B = document.querySelector(".b");
const btn_left = document.querySelector(".left");
const btn_right = document.querySelector(".right");

const program_color = document.getElementById("program-color");
const program_input = document.getElementById("program-input");
const program_label = document.getElementById("program-label");
const program_result = document.getElementById("program-result");

const poke_name = document.querySelector(".poke-name");
const poke_id = document.querySelector(".poke-id");
const poke_image = document.querySelector(".poke-front-image");
const poke_type = document.querySelector(".poke-type");
const screen__all = document.querySelector(".screen__all");
const screen_display = document.querySelector("#screen-display");

const p1_result = document.querySelector("#P1-result");
const p2_result = document.querySelector("#P2-result");

const P1_LABEL = "Show Pokemon on Gameboy";
const P2_LABEL = "Show Pokemon on Gallery View";
const P1_INPUT_STATUS = false;
const P2_INPUT_STATUS = false;
const P1_INPUT_PLACEHOLDER = "Enter a VALID Pokemon's name or ID!";
const P2_INPUT_PLACEHOLDER = "Enter 0 to start from beginning or you can offset";
const P1_PROGRAM_NAME = "P1";
const P2_PROGRAM_NAME = "P2";

let current_pokemon_id = 1;
let pokemon_collection;

const POKEMON_API = "https://pokeapi.co/api/v2/pokemon/";

let current_program = P1_PROGRAM_NAME;

const POKEMON_TYPE_COLOR = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  bug: "#A8B820",
  normal: "#A8A878",
  poison: "#A040A0",
  electric: "#F8D030",
  ground: "#E0C068",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  ghost: "#705898",
  ice: "#98D8D8",
  dragon: "#7038F8",
}

const btn_P1 = document.getElementById("btn-P1");
const btn_P2 = document.getElementById("btn-P2");

btn_P1.addEventListener("click", detectUI);
btn_P2.addEventListener("click", detectUI);

function detectUI(event) {
  if (event.target.id == "btn-P1") {
    // Do not toggleColor and updateUI if current view is already showing correct view
    if (current_program != P1_PROGRAM_NAME) {
      toggleColor();
      updateUI(P1_PROGRAM_NAME);
      p1_result.classList.remove("hide");
      p2_result.classList.add("hide");
    }
  } else {
    if (current_program != P2_PROGRAM_NAME) {
      toggleColor();
      updateUI(P2_PROGRAM_NAME);
      p2_result.classList.remove("hide");
      p1_result.classList.add("hide");
    }
  }
}

function toggleColor() {
  program_color.classList.toggle("bg-success");
  program_color.classList.toggle("bg-primary");
}

function updateUI(program_mode) {

  let label, input_status, placeholder, program_name;

  if (program_mode == P1_PROGRAM_NAME) {
    label = P1_LABEL;
    input_status = P1_INPUT_STATUS;
    placeholder = P1_INPUT_PLACEHOLDER;
    program_name = P1_PROGRAM_NAME;
  } else {
    label = P2_LABEL;
    input_status = P2_INPUT_STATUS;
    placeholder = P2_INPUT_PLACEHOLDER;
    program_name = P2_PROGRAM_NAME;
  }

  program_label.textContent = label;
  program_input.disabled = input_status;
  program_input.placeholder = placeholder;
  current_program = program_name;
}

const btn_click = document.getElementById("program-click");
btn_click.addEventListener("click", async function () {

  if (current_program == P1_PROGRAM_NAME) {
    current_pokemon_id = program_input.value;
    const pokemon = await catchCurrentPokemon();
    current_pokemon_id = pokemon["id"];
  } else {
    catchThemAll();
    document.getElementById('P2-container').innerText = "";
  }
});

function playPikachuVoice() {
  if (current_pokemon_id == 25) {
    let audio = new Audio("audio/Pikachu.mp3");
    audio.loop = false;
    audio.play();
  }
}

function hideScreenTitle() {
  screen_display.style.backgroundImage = 'none';
}

btn_A.addEventListener("click", function () {
  current_pokemon_id = 25; // Set to Pikachu
  catchCurrentPokemon();
});

btn_B.addEventListener("click", function () {
  // fetchAllData();
});

btn_left.addEventListener("click", function () {
  current_pokemon_id--;
  catchCurrentPokemon();
});

btn_right.addEventListener("click", function () {
  current_pokemon_id++;
  catchCurrentPokemon();
});

async function catchCurrentPokemon() {
  // const pokemon = await catchPokemon(POKEMON_API + current_pokemon_id);
  const pokemon = await fetch(POKEMON_API + current_pokemon_id)
    .then(response => response.json());

  playPikachuVoice();
  hideScreenTitle();
  showPokemonOnGameboy(pokemon);

  return pokemon;
}

async function catchPokemonByURL(url) {
  const pokemon = await fetch(url)
    .then(response => response.json());

  return pokemon;
}

function showPokemonOnGameboy(pokemon) {
  screen__all.classList.remove("hide");

  poke_id.textContent = pokemon["id"];
  poke_name.textContent = pokemon["name"];
  poke_image.src = pokemon["sprites"]["front_default"];
  const response_type = pokemon["types"][0]["type"]["name"];
  poke_type.textContent = response_type;
  screen_display.style.backgroundColor = POKEMON_TYPE_COLOR[response_type];
}

async function catchThemAll() {

  const P2_url = POKEMON_API + "?offset=" + program_input.value + "&limit=30";
  console.log(P2_url);
  const many_pokemon = await fetch(P2_url)
    .then(response => response.json());


  console.log(many_pokemon);
  const results = many_pokemon["results"];

  let main_wrapper;

  for (let i = 0; i < results.length; i++) {
    let wrapper1, wrapper2;

    const pokemon = await catchPokemonByURL(results[i].url);

    if (i == 0 || i == 5 || i == 10 || i == 15 || i == 20 || i == 25) {
      wrapper1 = document.createElement("div");
      wrapper1.setAttribute('class', 'row text-center g-5 mb-5');

      wrapper2 = document.createElement("div");
      wrapper2.setAttribute('class', 'col-md');
      wrapper1.append(wrapper2);

      main_wrapper = wrapper1;

      wrapper1 = document.createElement("div");
      wrapper1.setAttribute('class', `card ${pokemon["types"][0]["type"]["name"]} text-dark`);
      wrapper2.append(wrapper1);

      wrapper2 = document.createElement("div");
      wrapper2.setAttribute('class', 'card-body text-center my-4');
      wrapper1.append(wrapper2);

      wrapper1 = document.createElement("h4");
      wrapper1.setAttribute('class', 'card-title mb-3');
      wrapper1.innerText = pokemon["id"] + ' ' + pokemon["name"];
      wrapper2.append(wrapper1);

      wrapper1 = document.createElement("img");
      wrapper1.setAttribute('src', pokemon["sprites"]["front_default"]);
      wrapper2.append(wrapper1);

      wrapper1 = document.createElement("h5");
      wrapper1.setAttribute('class', 'card-text pb-3');
      wrapper1.innerText = "Type: " + pokemon["types"][0]["type"]["name"];
      wrapper2.append(wrapper1);

    } else {
      wrapper2 = document.createElement("div");
      wrapper2.setAttribute('class', 'col-md');

      main_wrapper.append(wrapper2);

      wrapper1 = document.createElement("div");
      wrapper1.setAttribute('class', `card ${pokemon["types"][0]["type"]["name"]} text-dark`);
      wrapper2.append(wrapper1);

      wrapper2 = document.createElement("div");
      wrapper2.setAttribute('class', 'card-body text-center my-4');
      wrapper1.append(wrapper2);

      wrapper1 = document.createElement("h4");
      wrapper1.setAttribute('class', 'card-title mb-3');
      wrapper1.innerText = pokemon["id"] + ' ' + pokemon["name"];
      wrapper2.append(wrapper1);

      wrapper1 = document.createElement("img");
      wrapper1.setAttribute('src', pokemon["sprites"]["front_default"]);
      wrapper2.append(wrapper1);

      wrapper1 = document.createElement("h5");
      wrapper1.setAttribute('class', 'card-text pb-3');
      wrapper1.innerText = "Type: " + pokemon["types"][0]["type"]["name"];
      wrapper2.append(wrapper1);
    }

    if (i == 4 || i == 9 || i == 14 || i == 19 || i == 24 || i == 29) {
      document.getElementById('P2-container').appendChild(main_wrapper);
    }
  }
  // return many_pokemon;
}




