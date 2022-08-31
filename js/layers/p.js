addLayer("p", {
    startData() { return {
        unlocked: true,
		points: d0,
        last: d0,
        bestOneTime: d0,
    }},

    name: "prestige",
    row:1,
    symbol: "P",
    position: 0,
    color: "#32CD32",
    requires: d10, 
    resource: "prestige points",
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    branches:[],

    type: "normal",
    requires:d10,
    exponent:n(0.5),
    exponentBase: n(0.5),
    mult: d10,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = d1
        if (tmp.f.effect.gte(1)) mult = mult.times(tmp.f.effect)
        if (tmp.s.bars.p.unlocked) mult = mult.times(getSkillEffect('p'))
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
        if (tmp.s.bars.p.unlocked) addSkillExp('p',gain)
        if (hasUpgrade('a',44)) {player[this.layer].bestOneTime = player[this.layer].bestOneTime.max(gain)}
        else {if (gain.lt(player[this.layer].last)&&hasAchievement('ach',13)&&!hasAchievement('ach',14)) {giveAchievements('ach',14)}
            player[this.layer].last=gain}
    },
    upgrades:{
        11: {
            name: "Point doubler",
            description(){if (hasUpgrade('a',41)) return `Not only Double your point gain, but also boost it with another ${format(upgradeEffect('a',41),0)}x.`
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
                if (!hasUpgrade(this.layer,this.id))return player[this.layer].points.pow(2).max(1)
                if (hasUpgrade('a',42))return player[this.layer].points.pow(2).min(d5.add(upgradeEffect('a',42))).max(1)
                return player[this.layer].points.max(1).pow(2).min(d5)
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
            description:'Multiplies point gain by last prestige gain.',
            cost: d10,
            baseEffect(){
                return hasUpgrade('a',44)?player[this.layer].bestOneTime.max(1).log10().mul(upgradeEffect('a', 44)).add(1):player[this.layer].last.max(1).log10().add(1)
            },
            effect() {return hasUpgrade('p',21)?tmp[this.layer].upgrades[this.id].baseEffect.mul(upgradeEffect('p',21)):tmp[this.layer].upgrades[this.id].baseEffect},
            tooltip(){return !hasUpgrade('a',44)?`Last: ${format(player[this.layer].last)}<br>Formula: Log10(x)+1`:`Best: ${format(player[this.layer].bestOneTime)}<br>Formula: (Log10(x)+1)*2`},
            //effectDisplay() { return format(tmp[this.layer].upgrades[this.id].baseEffect)+"x" },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21:{
            unlocked(){return getBuyableAmount('f',11).gte(1)},
            title:'QwQ',
            description:'Boost last upgrade\'s effect by itself.',
            cost: n(1e4),
            baseEffect() {return tmp[this.layer].upgrades[14].baseEffect.root(2).max(1)},
            effect() {return hasUpgrade('p',22)?tmp[this.layer].upgrades[this.id].baseEffect.mul(upgradeEffect('p',22)):tmp[this.layer].upgrades[this.id].baseEffect},
            tooltip:`Formula: 2√x<br>Boost will not display on the previous upgrade.`,
            //effectDisplay() { return format(tmp[this.layer].upgrades[this.id].baseEffect)+"x" },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22:{
            unlocked(){return getBuyableAmount('f',11).gte(2)},
            title:'e',
            description:'Boost last upgrade\'s effect by itself.',
            cost: n(1e6),
            baseEffect() {return tmp[this.layer].upgrades[21].baseEffect.root(2).max(1)},
            effect() {return hasUpgrade('p',23)?tmp[this.layer].upgrades[this.id].baseEffect.mul(upgradeEffect('p',23)):tmp[this.layer].upgrades[this.id].baseEffect},
            tooltip:`Formula: 2√x`,
            //effectDisplay() { return format(tmp[this.layer].upgrades[this.id].baseEffect)+"x" },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        23:{
            unlocked(){return getBuyableAmount('f',11).gte(3)},
            title:'308',
            description:'Boost last upgrade\'s effect by itself.',
            cost: n(1e8),
            effect() {return tmp[this.layer].upgrades[22].baseEffect.root(2).max(1)},
            tooltip:`Formula: 2√x`,
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
    doReset(resettingLayer) {
        if (resettingLayer==this.layer||!(inBranch(this.layer,resettingLayer))) {
            return;
        }
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
