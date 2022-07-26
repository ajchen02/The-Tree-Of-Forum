addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    row:1,
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: d0,
        last: d0,
    }},
    color: "#4BDC13",
    requires: d10, // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    
    type: "custom",
    exponentBase: n(0.5),
    mult: d10,
    getResetGain(){
        //console.log(player.f.points.add(d1).div(this.mult).log(this.exponentBase))
        if (tmp[this.layer].baseAmount.lt(10)) return d0
        let current = tmp[this.layer].baseAmount.add(1).div(this.mult).pow(this.exponentBase).floor()
        //log[exBase]((x+1)/20).floor+1
        return current.max(0) //.sub(player[this.layer].points).max(d0)
    },
    getNextAt(canMax=false){
        let current=tmp[this.layer].getResetGain//.add(player[this.layer].points)
        return current.add(1).root(this.exponentBase).times(this.mult).floor()
    },
    canReset(){return tmp[this.layer].getResetGain.gte(d1)?true:false},
    prestigeButtonText(){ if (!tmp[this.layer].getResetGain.lte(100)) return 'Reset for '+format(tmp[this.layer].getResetGain,0)+' prestige points'
        return 'Reset for '+format(tmp[this.layer].getResetGain,0)+' prestige points<br>Next at '+format(tmp[this.layer].getNextAt,0)+' prestige points'},

    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = d1
        if (tmp.f.effect.gte(1)) mult = mult.times(tmp.f.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d1
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
            cost: d1,
        },
        12: {
            name: "Point booster",
            description: "Boost your point gain based on your prestige point.",
            cost: d3,
            effect() {
                //return hasUpgrade(this.layer,this.id)?player[this.layer].points.add(d1).sqrt().min(d5):player[this.layer].points.add(d1).sqrt()
                if (!hasUpgrade(this.layer,this.id))return player[this.layer].points.add(d1).pow(2)
                if (hasUpgrade('a',32))return player[this.layer].points.add(d1).pow(2).min(d5.add(upgradeEffect('a',32)))
                return player[this.layer].points.add(d1).pow(2).min(d5)
            },
            //tooltip:"(And a +1 output as Fawwaz Arkan suggest)",
            tooltip(){return ((upgradeEffect(this.layer, this.id).eq(d5)&&hasUpgrade(this.layer,this.id))?'Sorry I forgor<br>Hardcapped at 5x<br>':'')+"Formula: x^2"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title:'ajchen',
            description:'Boost point gain by point itself.',
            cost: d5,
            effect() {
                return player.points.max(d1).log10().max(d1)
            },
            tooltip:"Formula: Log10(x)",
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title:'Jakub',
            description:'Multiplies point gain based on last prestige reset gain.',
            cost: d10,
            effect() {
                return player[this.layer].last.max(1).log10().add(1)
                //Alternative return player[this.layer].last.max(1).root(2)
            },
            tooltip(){return "Last: "+format(player[this.layer].last,0)+"<br>Formula: Log10(x)+1"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            //style: { margin: "-100px" }
        },
        21: {
            title:'QwQe308',
            description:'Boost first upgrade.',
            cost: d10,
            effect() {
                return player[this.layer].last.max(1).log10().add(1)
                //Alternative return player[this.layer].last.max(1).root(2)
            },
            tooltip(){return "Last: "+format(player[this.layer].last,0)+"<br>Formula: Log10(x)+1"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return getBuyableAmount('f',11).gte(1)
            }
        },
        22: {
            title:'QwQe308',
            description:'Boost ← upgrade.',
            cost: d10,
            effect() {
                return player[this.layer].last.max(1).log10().add(1)
                //Alternative return player[this.layer].last.max(1).root(2)
            },
            tooltip(){return "Last: "+format(player[this.layer].last,0)+"<br>Formula: Log10(x)+1"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return getBuyableAmount('f',11).gte(2)
            }
        },
        23: {
            title:'QwQe308',
            description:'Boost ← upgrade.',
            cost: d10,
            effect() {
                return player[this.layer].last.max(1).log10().add(1)
                //Alternative return player[this.layer].last.max(1).root(2)
            },
            tooltip(){return "Last: "+format(player[this.layer].last,0)+"<br>Formula: Log10(x)+1"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return getBuyableAmount('f',11).gte(3)
            }
        },
        24: {
            title:'QwQe308',
            description:'Boost ← upgrade.',
            cost: d10,
            effect() {
                return player[this.layer].last.max(1).log10().add(1)
                //Alternative return player[this.layer].last.max(1).root(2)
            },
            tooltip(){return "Last: "+format(player[this.layer].last,0)+"<br>Formula: Log10(x)+1"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){
                return getBuyableAmount('f',11).gte(4)
            }
        },
    },
    doReset(resettingLayer) {
        if (resettingLayer==this.layer||!(inBranch(this.layer,resettingLayer))) return;
        keepUpgrades=[]
        if (hasUpgrade('a',11)) keepUpgrades.push(11)
        if (hasUpgrade('a',12)) keepUpgrades.push(12)
        if (hasUpgrade('a',13)) keepUpgrades.push(13)
        if (hasUpgrade('a',14)) keepUpgrades.push(14)
        last=player[this.layer].last
        layerDataReset(this.layer)
        player[this.layer].upgrades=keepUpgrades
        if (hasUpgrade('a',14)) player[this.layer].last=last
    },
    tabFormat: [
    "main-display",
        "prestige-button",
        'resource-display',
        'upgrades',
    ],
    layerShown(){return true},
    passiveGeneration(){if (hasAchievement('m',15)) return 0.05
        return 0},
}) 
