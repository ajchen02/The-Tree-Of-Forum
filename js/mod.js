let modInfo = {
	name: "The Tree Of Forum",
	id: "TTOF_AjchenPath",
	author: "TMT community",
	pointsName: "points",
	modFiles: ["layers/p.js","layers/m.js","layers/a.js","layers/f.js","layers/stat.js",		"tree.js",'changelog.js'],

	discordName: "Forum Link",
	discordLink: "https://forums.moddingtree.com/t/the-tree-of-forum-vote-area/599",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Why you are seeing this, this is fulled of f*cked up code, bad design, and almost no programming.
// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())return Decimal.d0
    
    let base = Decimal.d1
    let pGain = Decimal.d1
    if (hasUpgrade('p',11)) pGain = pGain.times(Decimal.d2)
    if (hasUpgrade('p',12)) pGain = pGain.times(tmp.p.upgrades[12].effect)
    if (hasUpgrade('p',13)) pGain = pGain.times(tmp.p.upgrades[13].effect)
    if (hasUpgrade('p',14)) pGain = pGain.times(tmp.p.upgrades[14].effect)
    let mGain = Decimal.d1
    if (hasAchievement('m',11)) mGain = mGain.times(tmp.m.achievements[11].effect)
    //if (hasAchievement('m',12)) mGain = mGain.times(tmp.m.achievements[12].effect)
    let aGain = Decimal.d1
    if (hasUpgrade('a',21)) aGain = aGain.mul(tmp.a.upgrades[21].effect)
    if (hasUpgrade('a',22)) aGain = aGain.mul(tmp.a.upgrades[22].effect)
    if (hasUpgrade('a',23)) aGain = aGain.mul(tmp.a.upgrades[23].effect)    
    if (hasUpgrade('a',24)) aGain = aGain.mul(tmp.a.upgrades[24].effect)
    let fGain = Decimal.d1
    if (tmp.f.effect.gte(1)) fGain = fGain.times(tmp.f.effect)
	return {total:base.times(pGain).mul(mGain).mul(aGain).times(fGain),p:pGain,m:mGain,a:aGain,f:fGain}
}



// Set your version in num and name
let VERSION = {
	num: "0.11.2",
	name: "Profectus is so hard",
}

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
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
		player.f.points = new Decimal(0)
		player.f.unlocked=false
	}
}