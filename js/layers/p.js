addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    row:1,
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: Decimal.d0,
        last: Decimal.d0,
    }},
    color: "#4BDC13",
    requires: Decimal.d10, // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = Decimal.d1
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return Decimal.d1
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    onPrestige(gain) {
        //console.log(gain)
        if (/*hasUpgrade('cyberpunk',2077)*/ false) {player[this.layer].last = player[this.layer].last.max(gain)}//Thanks, Jakub
        else {player[this.layer].last=gain}
    },
    upgrades:{
        11: {
            name: "Point doubler",
            description: "Double your point gain.",
            cost: Decimal.d1,
        },
        12: {
            name: "Point booster",
            description: "Boost your point gain based on your prestige point.",
            cost: Decimal.d3,
            effect() {
                //return player[this.layer].points.add(Decimal.d1).pow(Decimal.d2).min(Decimal.d5)
                return hasUpgrade(this.layer,this.id)?player[this.layer].points.add(Decimal.d1).pow(Decimal.d2).min(Decimal.d5):player[this.layer].points.add(Decimal.d1).pow(Decimal.d2)
            },
            //tooltip:"(And a +1 output as Fawwaz Arkan suggest)",
            tooltip(){return ((upgradeEffect(this.layer, this.id).gte(Decimal.d5)&&hasUpgrade(this.layer,this.id))?'Sorry I forgot<br>Hardcapped at 5x<br>':'')+"Formula: x^2"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title:'ajchen',
            description:'Boost point gain by point itself.',
            cost: Decimal.d5,
            effect() {
                return player.points.max(Decimal.d1).log10().max(Decimal.d1)
            },
            tooltip:"Formula: Log10(x)",
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title:'Jakub',
            description:'Multiplies point gain based on last prestige reset gain.',
            cost: Decimal.d10,
            effect() {
                return player[this.layer].last.max(1).log10().add(1)
                //Alternative return player[this.layer].last.max(1).root(2)
            },
            tooltip(){return "Last: "+format(player[this.layer].last,0)+"<br>Formula: Log10(x)+1"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            //style: { margin: "-100px" }
        },
    },
    doReset(resettingLayer) {
        if (resettingLayer==this.layer) return;
        upgrades=[]
        if (hasUpgrade('a',11)) upgrades.push(11)
        if (hasUpgrade('a',12)) upgrades.push(12)
        if (hasUpgrade('a',13)) upgrades.push(13)
        if (hasUpgrade('a',14)) upgrades.push(14)
        last=player[this.layer].last
        layerDataReset(this.layer)
        player[this.layer].upgrades=upgrades
        if (hasUpgrade('a',14)) player[this.layer].last=last
    },
    tabFormat: [
    "main-display",
        "prestige-button",
        'resource-display',
        'upgrades',
    ],
    layerShown(){return true},
    passiveGeneration(){if (hasAchievement('m',14)) return 0.05
        return 0},
}) 
