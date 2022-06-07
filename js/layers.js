
// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let base = new Decimal(1)
	let gain = new Decimal(1)
    let pGain = new Decimal(1)
	if (hasUpgrade('p',11)) pGain = pGain.times(2)
	if (hasUpgrade('p',12)) pGain = pGain.times(upgradeEffect('p',12))
    if (hasUpgrade('p',13)) pGain = pGain.times(upgradeEffect('p',13))
    if (hasUpgrade('p',14)) pGain = pGain.times(upgradeEffect('p',14))
	return base.times(pGain)
}

addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        last: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    last: new Decimal(0),
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    onPrestige(gain) {
        //console.log(gain)
        player[this.layer].last=gain
    },
    upgrades:{
        11: {
            name: "Point doubler",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },
        12: {
            name: "Point booster",
            description: "Boost your point gain based on your prestige point.",
            cost: new Decimal(3),
            effect() {
                return player[this.layer].points.add(1).log10().add(1).pow(2).min(5)
            },
            //tooltip:"(And a +1 output as Fawwaz Arkan suggest)",
            tooltip(){return (upgradeEffect(this.layer, this.id).gte(5)?'Hardcapped at 5x<br>':'')+"Formula: (Log10(x+1)+1)^2"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title:'ajchen',
            description:'Boost point gain by point itself.',
            cost: new Decimal(5),
            //canAfford(){
            //    return (player.points.gte(100)?true:false)
            //},
            //pay(){
            //    player.points.sub(100)
            //},
            effect() {
                return player.points.max(1).log10().add(1)
            },
            tooltip:"Formula: Log10(x)+1",
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title:'Jakub',
            description:'Multiplies point gain based on last prestige reset gain.',
            cost: new Decimal(10),
            effect() {
                return player[this.layer].last.max(1).log10().add(1)
            },
            //tooltip: () =>"Last: "+format(player[this.layer].last)+"<br>Formula: Log10(x)+1",
            tooltip(){return "Last: "+format(player[this.layer].last,precision = 0)+"<br>Formula: Log10(x)+1"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
    //tabFormat: [
    //"main-display",
    //    "prestige-button",
    //    "blank",
    //    ["display-text",
    //        function() { return 'I have ' + format(player.points) + ' pointy points!' },
    //        { "color": "red", "font-size": "32px", "font-family": "Comic Sans MS" }],
    //    "blank",
    //    ["toggle", ["c", "beep"]],
    //    "milestones",
    //    "blank",
    //    "blank",
    //    "upgrades"
    //],
    layerShown(){return true}
})
