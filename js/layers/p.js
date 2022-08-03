addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    row:1,
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: d0,
        last: d0,
        bestOneTime: d0,
    }},
    color: "#32CD32",
    requires: d10, // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    
    type: "normal",
    requires:d10,
    exponent:n(0.5),
    exponentBase: n(0.5),
    mult: d10,
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
        if (player.s.unlocked) console.log(format(gain))
        if (hasUpgrade('a',44)) {player[this.layer].bestOneTime = player[this.layer].bestOneTime.max(gain)}
        else {player[this.layer].last=gain}
    },
    upgrades:{
        11: {
            name: "Point doubler",
            description(){if (hasUpgrade('a',41)) return 'Not only Double your point gain, but also boost it with another '+format(upgradeEffect('a',41),0)+'x.'
                return "Double your point gain."},
            cost: d1,
            effect(){
                if (hasUpgrade('a',41)) return d2.mul(upgradeEffect('a',41))
                return d2
            }
        },
        12: {
            name: "Point booster",
            description: "Boost your point gain based on your prestige point.",
            cost: d3,
            effect() {
                //return hasUpgrade(this.layer,this.id)?player[this.layer].points.add(d1).sqrt().min(d5):player[this.layer].points.add(d1).sqrt()
                if (!hasUpgrade(this.layer,this.id))return player[this.layer].points.add(d1).pow(2)
                if (hasUpgrade('a',42))return player[this.layer].points.add(d1).pow(2).min(d5.add(upgradeEffect('a',42)))
                return player[this.layer].points.add(d1).pow(2).min(d5)
            },
            //tooltip:"(And a +1 output as Fawwaz Arkan suggest)",
            tooltip(){if (hasUpgrade('a',42)) return `Now i remember<br>Hardcap at ${format(d5.add(upgradeEffect('a',42)))}x<br>Formula: x^2`
                return `${((upgradeEffect(this.layer, this.id).eq(d5)&&hasUpgrade(this.layer,this.id))?'Sorry I forgor<br>Hardcapped at 5x<br>':'')}Formula: x^2`},
            effectDisplay() { return `${format(upgradeEffect(this.layer, this.id))}x` }, // Add formatting to the effect
        },
        13: {
            title:'ajchen',
            description:'Boost point gain by point itself.',
            cost: d5,
            effect() {
                if (hasUpgrade('a',43)) return player.points.max(d1).log(d10.sub(upgradeEffect('a',43))).max(d1)
                return player.points.max(d1).log10().max(d1)
            },
            tooltip(){return !hasUpgrade('a',43)?"Formula: Log10(x)":`Formula: Log${format(d10.sub(upgradeEffect('a',43),2))}(x)`},
            effectDisplay() { return `${format(upgradeEffect(this.layer, this.id))}x` },
        },
        14: {
            title:'Jakub',
            description:'Multiplies point gain based on last prestige reset gain.',
            cost: d10,
            effect() {
                if (hasUpgrade('a',44)) return player[this.layer].bestOneTime.max(1).log10().add(1).mul(2)
                return player[this.layer].last.max(1).log10().add(1)
                //Alternative return player[this.layer].last.max(1).root(2)
            },
            tooltip(){return !hasUpgrade('a',44)?`Last: ${format(player[this.layer].last,0)}<br>Formula: Log10(x)+1`:`Best: ${format(player[this.layer].best,0)}<br>Formula: (Log10(x)+1)*2`},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
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
        best=player[this.layer].bestOneTime
        layerDataReset(this.layer)
        player[this.layer].upgrades=keepUpgrades
        if (hasUpgrade('a',14)) {player[this.layer].last=last;player[this.layer].bestOneTime=best}
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
