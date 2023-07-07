//do PUBLISH page
//still include link in submittion
//can get images with https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${#}.png for api
//or in https://pokeapi.co/api/v2/pokemon/${pokemon}/
function pokeBlock(res, div) {   
    if (!res)
        return;
    div.innerHTML += "<h2>" + res.name + "</h2>";                                     //kills dumb form feed character \u000c
    for (const textEn of res.flavor_text_entries)
        if (textEn.language.name === "en") {
            div.innerHTML += "<p>" + textEn.flavor_text.replace('\f', ' ') + "</p>";
            break;
        }
    document.getElementById("pokemon-species").appendChild(div);
}

async function userGetPokemonByName(namePk) {
    let ret = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${namePk}/`).catch((err) => console.error(err));
    return ret.json();
}

async function getPokemonAndRelations(namePk) {// :(
    let unravPk = await userGetPokemonByName(namePk);
    let div = document.createElement("div");

    let pmonNum = unravPk.pokedex_numbers[0].entry_number;// looking at national index for the pokemon number for png
    let img = document.createElement("img");
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pmonNum}.png`;
    div.appendChild(img);

    fetch(unravPk.evolution_chain.url)// note all ive found in the api have a total linear evolution number of 3
        .then((response) => response.json())
        .then((ref) => {
            pokeBlock(unravPk, div)
            for (const stage of ref.chain.evolves_to) { // stage.evolves_to[0].species.name
                if (unravPk.name !== stage.species.name ) {
                    if ((stage !== ref.chain.evolves_to[ref.chain.evolves_to.length]
                        && unravPk.name !== ref.chain.species.name) ^ !stage.evolves_to[0])
                        continue;
                    div.innerHTML += "<button class=\"txt\">" + stage.species.name + "</button>";
                } else {// ?? prob put ref.chain.evolves_to.length > 1
                        // ! recursive func
                        //TODO
                    div.innerHTML += "<button class=\"txt\">" + ref.chain.species.name + "</button>";
                    if (stage.evolves_to[0])
                        div.innerHTML += "<button class=\"txt\">" + stage.evolves_to[0].species.name + "</button>";
                }
            }
        })
        .catch((err) => console.error(err));
        document.getElementById("pokemon-species").appendChild(div);
}
/*
// .then((ref) => {
//     pokeBlock(unravPk, div)
//     for (const stage of ref.chain.evolves_to) { // stage.evolves_to[0].species.name
//         if (unravPk.name !== stage.species.name) {
//             div.innerHTML += "<button class=\"txt\">" + stage.species.name + "</button>";
//         } else {
//         div.innerHTML += "<button class=\"txt\">" + ref.chain.species.name + "</button>";
//         if (stage.evolves_to[0])
//             div.innerHTML += "<button class=\"txt\">" + stage.evolves_to[0].species.name + "</button>";
//         }
//     }
// })
*/
document.getElementById("search").addEventListener("click", (event) => {
    let getName = document.getElementById("name");
    if (getName.value) {
        document.getElementById("pokemon-species").innerHTML = "";
        getPokemonAndRelations(getName.value);
        getName.value = "";
    }
});
//last pokemon = 1010 so < 1011 for all of the mess so have fun with that :)
    for(let i = 1; i<151; i++)
        getPokemonAndRelations(i);

document.addEventListener("click", (event) => {
    if (event.target.closest(".txt")) {
        document.getElementById("pokemon-species").innerHTML = "";
        getPokemonAndRelations(event.target.innerText);
    }
})