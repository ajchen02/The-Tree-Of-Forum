let modInfo = {
	name: "The Tree Of Forum",
	id: "TTOF_AjchenPath",
	author: "TMT community",
	pointsName: "points",
	modFiles: ["layers/p.js","layers/m.js","layers/a.js","layers/f.js","layers/s.js","layers/sb.js","layers/ach.js",		"tree.js",'changelog.js'],

	discordName: "Forum Link",
	discordLink: "https://forums.moddingtree.com/t/the-tree-of-forum-vote-area/599",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}


// Set your version in num and name
let VERSION = {
	num: "0.26",
	name: "feeling so attacked rn",
}

let winText = `Congratulations! You have reached the end and beaten this game, but for now...<br>Go forums.moddingtree.com/t/the-tree-of-forum-vote-area/599 to make suggestions!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ['keepingUpgrades','pointRefresh',"blowUpEverything"]


// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
        return false
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	if (oldVersion < 0.04){
		player.f.points = n(0)
		player.f.unlocked=false
	}
	if (oldVersion <= 0.211)
		player.p.points=player.p.points.min(1000)
		player.f.points=player.f.points.min(20)
		layerDataReset('s')
}
