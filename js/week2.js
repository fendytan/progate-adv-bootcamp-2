const btn_A = document.querySelector(".a");
const btn_B = document.querySelector(".b");
const btn_left = document.querySelector(".left");
const btn_right = document.querySelector(".right");
const btn_P1 = document.getElementById("btn-P1");
const btn_P2 = document.getElementById("btn-P2");
const btn_P2_prev = document.querySelector("#btn-P2-prev");
const btn_P2_next = document.querySelector("#btn-P2-next");

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
const P2_INPUT_PLACEHOLDER = "Enter 0 to start from beginning! Or enter 100 to start from Pokemon 101!";
const P1_PROGRAM_NAME = "P1";
const P2_PROGRAM_NAME = "P2";

let current_pokemon_id = 1;
// let pokemon_collection;
let prev_page_url;
let next_page_url;
let current_program = P1_PROGRAM_NAME;

const POKEMON_API = "https://pokeapi.co/api/v2/pokemon/";

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

btn_P1.addEventListener("click", detectUI);
btn_P2.addEventListener("click", detectUI);

btn_P2_prev.addEventListener("click", async function () {
  console.log(prev_page_url);
  document.getElementById('P2-container').innerText = "";
  await catchThemAll(prev_page_url);
});

btn_P2_next.addEventListener("click", async function () {
  console.log(next_page_url);
  document.getElementById('P2-container').innerText = "";
  await catchThemAll(next_page_url);
});

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
    catchThemAll(POKEMON_API + "?offset=" + program_input.value + "&limit=30");
    playCatchThemAllVoice();
    document.getElementById('P2-container').innerText = "";
    btn_P2_prev.disabled = false;
    btn_P2_next.disabled = false;
  }
});

function playCatchThemAllVoice() {
  let audio = new Audio("audio/gottacatchemall.mp3");
  audio.loop = false;
  audio.play();
}

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

async function catchThemAll(url) {

  const many_pokemon = await fetch(url)
    .then(response => response.json());

  console.log(many_pokemon);

  next_page_url = many_pokemon.next;
  prev_page_url = many_pokemon.previous;

  const results = many_pokemon["results"];

  for (let i = 0; i < results.length; i++) {

    const pokemon = await catchPokemonByURL(results[i].url);

    let parent_node = document.createElement("div");
    parent_node.setAttribute('class', 'col');

    let new_node = document.createElement("div");
    new_node.setAttribute('class', `card h-100 ${pokemon["types"][0]["type"]["name"]}`);
    // new_node.setAttribute('data-tilt', '');
    parent_node.append(new_node);

    new_node = document.createElement("img");
    new_node.setAttribute('src', pokemon["sprites"]["front_default"]);
    new_node.setAttribute('class', 'card-img-top poke-image');
    parent_node.firstChild.append(new_node);

    new_node = document.createElement("div");
    new_node.setAttribute('class', 'card-body');
    parent_node.firstChild.append(new_node);

    new_node = document.createElement("h5");
    new_node.setAttribute('class', 'card-title poke-name');
    new_node.innerText = pokemon["id"] + ' - ' + pokemon["name"];
    parent_node.firstChild.lastChild.append(new_node);

    new_node = document.createElement("p");
    new_node.setAttribute('class', 'card-text');
    new_node.innerText = "Type: " + pokemon["types"][0]["type"]["name"];

    parent_node.firstChild.lastChild.append(new_node);

    document.querySelector("#P2-container").append(parent_node);
  }

  VanillaTilt.init(document.querySelectorAll(".card"), {
    max: 25,
    speed: 400,
  });
}