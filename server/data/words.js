//  a simple list of words for the game
//  the drawer will pick from these words

const WORDS = [
    // animals
    "cat", "dog", "elephant", "giraffe", "penguin", "dolphin",
    "crocodile", "kangaroo", "octopus", "parrot", "tiger", "zebra",
    "shark", "rabbit", "bear", "wolf", "fox", "owl", "eagle", "snake",

    // objects
    "bicycle", "umbrella", "guitar", "camera", "backpack",
    "clock", "hammer", "scissors", "pencil", "book", "chair", "lamp",
    "balloon", "kite", "trophy", "crown", "anchor", "rocket", "sword",

    // food
    "pizza", "hamburger", "sushi", "taco", "sandwich", "pancake",
    "cupcake", "ice cream", "donut", "waffle", "hot dog", "popcorn",
    "cookie", "cake", "pie", "muffin", "bagel", "nachos",

    // places
    "beach", "mountain", "forest", "desert", "castle", "lighthouse",
    "island", "cave", "waterfall", "library", "stadium", "airport",
    "school", "museum", "farm", "jungle", "bridge", "tower",

    // actions
    "swimming", "dancing", "climbing", "sleeping", "cooking", "reading",
    "singing", "jumping", "flying", "painting", "laughing", "running",
    "fishing", "surfing", "skateboarding", "skiing", "boxing", "hiking",

    // vehicles
    "submarine", "helicopter", "sailboat", "motorcycle", "tractor",
    "spaceship", "hot air balloon", "ambulance", "scooter",
    "train", "airplane", "bus", "taxi", "truck",

    // nature
    "rainbow", "tornado", "snowflake", "lightning",
    "cloud", "moon", "sun", "star", "river", "ocean", "tree", "flower",

    // fantasy
    "dragon", "unicorn", "mermaid", "wizard", "vampire",
    "fairy", "ghost", "witch", "knight", "elf", "giant", "goblin"
];


// pick n random words from the list
// used to give the drawer a choice of words each round
function getRandomWords(count = 3) {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
}

module.exports = { getRandomWords }