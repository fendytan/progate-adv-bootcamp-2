const P1_LABEL = "Show Pokemon on Gameboy";
const P2_LABEL = "Show Pokemon on Gallery View";
const P1_INPUT_STATUS = false;
const P2_INPUT_STATUS = false;
const P1_INPUT_PLACEHOLDER = "Enter a VALID Pokemon's name or ID!";
const P2_INPUT_PLACEHOLDER = "Enter 0 to start from beginning! Or enter 100 to start from Pokemon 101!";
const P1_PROGRAM_NAME = "P1";
const P2_PROGRAM_NAME = "P2";
const POKEMON_API = "https://pokeapi.co/api/v2/pokemon/";

let current_pokemon_id = 0;
let prev_page_url;
let next_page_url;
let current_program = P1_PROGRAM_NAME;


// General P1 and P2 selection modes...

const btn_P1 = document.getElementById("btn-P1");
btn_P1.addEventListener("click", detectUI);

const btn_P2 = document.getElementById("btn-P2");
btn_P2.addEventListener("click", detectUI);

function detectUI(event) {
  const p1_result = document.querySelector("#P1-result");
  const p2_result = document.querySelector("#P2-result");

  if (event.target.id == "btn-P1") {
    // Do not toggleColor and updateUI if current view is already showing correct view
    if (current_program != P1_PROGRAM_NAME) {
      toggleColor();
      switchToUI(P1_PROGRAM_NAME);
      p1_result.classList.remove("hide");
      p2_result.classList.add("hide");
    }
  } else {
    if (current_program != P2_PROGRAM_NAME) {
      toggleColor();
      switchToUI(P2_PROGRAM_NAME);
      p1_result.classList.add("hide");
      p2_result.classList.remove("hide");
    }
  }
}

function toggleColor() {
  const program_color = document.getElementById("program-color");
  program_color.classList.toggle("bg-success");
  program_color.classList.toggle("bg-primary");
}

function switchToUI(program_mode) {

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

  document.getElementById("program-label").textContent = label;
  document.getElementById("program-input").disabled = input_status;
  document.getElementById("program-input").placeholder = placeholder;
  current_program = program_name;
}



const btn_click = document.getElementById("program-click");
btn_click.addEventListener("click", async function () {

  const program_input = document.getElementById("program-input");

  if (current_program == P1_PROGRAM_NAME) {

    await startP1(POKEMON_API + program_input.value);

  } else {

    await startP2(POKEMON_API + "?offset=" + program_input.value + "&limit=30");

  }
});

// Pressing the left button of gameboy...
const btn_left_gameboy = document.querySelector(".left");
btn_left_gameboy.addEventListener("click", async function () {
  // Will make the current showing pokemon smaller
  if (current_pokemon_id > 1) { // But cannot go less than 1
    current_pokemon_id--;
  }

  await startP1(POKEMON_API + current_pokemon_id);

});

// Pressing the left button of gameboy...
const btn_right_gameboy = document.querySelector(".right");
btn_right_gameboy.addEventListener("click", function () {
  // Will make the current showing pokemon smaller
  if (current_pokemon_id < 151) { // But cannot go more than 151
    current_pokemon_id++;
  }

  startP1(POKEMON_API + current_pokemon_id);

});

// Pressing button A will show Pikachu
const btn_A_gameboy = document.querySelector(".a"); // ok
btn_A_gameboy.addEventListener("click", async function () {
  current_pokemon_id = 25; // Set to Pikachu
  await startP1(POKEMON_API + current_pokemon_id);
});

// Pressing button B will show random pokemon (up to 151 pokemon)
const btn_B_gameboy = document.querySelector(".b"); // ok
btn_B_gameboy.addEventListener("click", async function () {
  current_pokemon_id = Math.floor(Math.random() * 151) + 1; // 1 to 151
  await startP1(POKEMON_API + current_pokemon_id);
});



// P1 - Show Pikachu on Screen

async function startP1(url) {
  const pokemon = await getPokemonDetail(url);
  playPikachuVoice();
  hidePokeAPILogo();
  showOnGameboy(pokemon);
}

async function getPokemonDetail(url) {
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

function hidePokeAPILogo() {
  document.querySelector("#screen-display").style.backgroundImage = 'none';
}

// Only play pikachu voice if showing pikachu detail
function playPikachuVoice() {
  if (current_pokemon_id == 25) {
    let audio = new Audio("audio/Pikachu.mp3");
    audio.loop = false;
    audio.play();
  }
}

function showOnGameboy(pokemon) {

  // only has colors for 151 original pokemon
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

  document.querySelector(".screen__all").classList.remove("hide");
  document.querySelector(".poke-id").textContent = pokemon["id"];

  document.querySelector(".poke-name").textContent = pokemon["name"].toUpperCase();
  document.querySelector(".poke-front-image").src = pokemon["sprites"]["front_default"];

  const pokemon_type = pokemon["types"][0]["type"]["name"];
  document.querySelector(".poke-type").textContent = pokemon_type;
  document.querySelector("#screen-display").style.backgroundColor = POKEMON_TYPE_COLOR[pokemon_type];

  current_pokemon_id = pokemon["id"];
}



// P2 - Show 30 pokemon on Screen

const btn_P2_prev = document.querySelector("#btn-P2-prev");
btn_P2_prev.addEventListener("click", async function () {
  await startP2(prev_page_url);
});

const btn_P2_next = document.querySelector("#btn-P2-next");
btn_P2_next.addEventListener("click", async function () {
  await startP2(next_page_url);
});

async function startP2(url) {
  let pokemons = await getManyPokemon(url);
  console.log(pokemons);
  updatePrevNextURL(pokemons);
  pokemons = pokemons.results;
  document.getElementById('P2-container').innerText = "";
  renderPokemons(pokemons);

  document.querySelector(".btn-group").classList.remove("hide");
}

async function getManyPokemon(url) {
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

// Destructuring Function https://www.youtube.com/watch?v=IcBNuBux9ag
function updatePrevNextURL({ next, previous }) {
  prev_page_url = previous;
  next_page_url = next;
  btn_P2_prev.disabled = false;
  btn_P2_next.disabled = false;
}

async function renderPokemons(pokemons) {

  for (const pokemon of pokemons) {
    const p = await getPokemonDetail(pokemon.url);
    showPokemonOnCards(p);
  }

  // Apply 3D effect to the cards...
  VanillaTilt.init(document.querySelectorAll(".card"), {
    max: 25,
    speed: 400,
  });

  // Enable user to click on each card...
  const temp = document.querySelectorAll(".card");
  for (const e of temp) {
    e.addEventListener("click", showDetail);
  }

}

// getPokemonDetail(url) is above (from P1)
// async function getPokemonDetail(url) {
//   try {
//     let res = await fetch(url);
//     return await res.json();
//   } catch (error) {
//     console.log(error);
//   }
// }

// Show the 30 pokemon on the page
function showPokemonOnCards(p) {
  let wrapper = document.createElement("div");
  wrapper.setAttribute('class', 'col');

  // Can also use building node with below codes...
  wrapper.innerHTML = `
    <div class="card h-100 ${p["types"][0]["type"]["name"]}" data-pokemonid="${p["id"]}">
      <img src="${p["sprites"]["front_default"]}" class="card-img-top poke-image">
      <div class="card-body">
        <h5 class="card-title">${p["id"]} - ${p["name"].toUpperCase()}</h5>
      </div>
    </div>
    `;

  document.querySelector("#P2-container").append(wrapper);
}


//     const pokemon = await catchPokemonByURL(results[i].url);

//     let parent_node = document.createElement("div");
//     parent_node.setAttribute('class', 'col');

//     let new_node = document.createElement("div");
//     new_node.setAttribute('class', `card h-100 ${pokemon["types"][0]["type"]["name"]}`);
//     parent_node.append(new_node);

//     new_node = document.createElement("img");
//     new_node.setAttribute('src', pokemon["sprites"]["front_default"]);
//     new_node.setAttribute('class', 'card-img-top poke-image');
//     parent_node.firstChild.append(new_node);

//     new_node = document.createElement("div");
//     new_node.setAttribute('class', 'card-body');
//     parent_node.firstChild.append(new_node);

//     new_node = document.createElement("h5");
//     new_node.setAttribute('class', 'card-title poke-name');
//     new_node.innerText = pokemon["id"] + ' - ' + pokemon["name"];
//     parent_node.firstChild.lastChild.append(new_node);

//     new_node = document.createElement("p");
//     new_node.setAttribute('class', 'card-text');
//     new_node.innerText = "Type: " + pokemon["types"][0]["type"]["name"];

//     parent_node.firstChild.lastChild.append(new_node);

//     document.querySelector("#P2-container").append(parent_node);


// Show the pokemon information on the modal after the user click the card
async function showDetail() {
  let myModal = new bootstrap.Modal(document.getElementById("pokemonDetailModal"));
  myModal.show();

  const p = await getPokemonDetail(POKEMON_API + this.getAttribute("data-pokemonid"));

  showPokemonOnModal(p);
}

function showPokemonOnModal(p) {
  // let wrapper = document.createElement("div");
  // wrapper.setAttribute('class', 'container-fluid');
  // <img src="${p["sprites"]["front_default"]}" alt="" class="img-fluid">
  let wrapper = `
    <div class="container-fluid">
      <div class="col-md-6 mx-auto d-block my-5">
        <img src="${p["sprites"]["other"]["official-artwork"]["front_default"]}" alt="" class="img-fluid">
      </div>
      <div class="col-md">
        <ul class="list-group text-center">
          <li class="list-group-item">
            <h4>${p["id"]} - ${p["name"].toUpperCase()}</h4>
          </li>
          <li class="list-group-item">Type: ${p["types"][0]["type"]["name"]}</li>
          <li class="list-group-item">${p["stats"][0]["base_stat"]} HP | ${p["base_experience"]} Exp</li>
          <li class="list-group-item">Attack: ${p["stats"][1]["base_stat"]} | Defense: ${p["stats"][2]["base_stat"]} | Speed: ${p["stats"][5]["base_stat"]}</li>
        </ul>
      </div>
    </div>
    `;

  // Show the pokemon information on the modal
  document.querySelector("#pokemon-detail").innerHTML = wrapper;

  // Change the modal color background according to pokemon type
  document.querySelector("#pokemon-modal").setAttribute('class', 'col ' + p["types"][0]["type"]["name"]);
}