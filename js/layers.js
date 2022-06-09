
// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())return Decimal.d0
    
    let base = Decimal.d1
    let pGain = Decimal.d1
    if (hasUpgrade('p',11)) pGain = pGain.times(Decimal.d2)
    if (hasUpgrade('p',12)) pGain = pGain.times(upgradeEffect('p',12))
    if (hasUpgrade('p',13)) pGain = pGain.times(upgradeEffect('p',13))
    if (hasUpgrade('p',14)) pGain = pGain.times(upgradeEffect('p',14))
    let fGain = Decimal.d1
    if (tmp.f.effect.gte(1)) fGain = fGain.times(tmp.f.effect)
	return base.times(pGain).times(fGain)
}

addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
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
            //canAfford(){
            //    return (player.points.gte(100)?true:false)
            //},
            //pay(){
            //    player.points.sub(100)
            //},
            effect() {
                return player.points.add(Decimal.d1).log10().add(Decimal.d1)
            },
            tooltip:"Formula: Log10(x)+1",
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title:'Jakub',
            description:'Multiplies point gain based on last prestige reset gain.',
            cost: Decimal.d10,
            effect() {
                return player[this.layer].last.max(Decimal.d1).log10().add(Decimal.d1)
                //Alternative return player[this.layer].last.max(1).root(2)
            },
            tooltip(){return "Last: "+format(player[this.layer].last,0)+"<br>Formula: Log10(x)+1"},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
    tabFormat: [
    "main-display",
        "prestige-button",
        //'blank',
        'resource-display',
        'upgrades',
    ],
    layerShown(){return true}
})
addLayer("f", {
    startData() { return {                  
        unlocked: false,                    
        points: Decimal.d0,             
    }},

    color: "#ADFF2F",                       
    resource: "fruits",            
    row: 1,                                 
    branches:['p'],
    baseResource: "prestige point",         
    baseAmount() { return player.p.points },

    requires: Decimal.d20,              
    
    
    type: "custom",
    exponentBase: Decimal.d2,
    mult: Decimal.d20,
    getResetGain(){
        //console.log(player.f.points.add(Decimal.d1).div(this.mult).log(this.exponentBase))
        if (tmp[this.layer].baseAmount.lt(20)) return Decimal.d0
        current = tmp[this.layer].baseAmount.add(Decimal.d1).div(this.mult).log(this.exponentBase).floor().add(Decimal.d1)
        //log[exBase]((x+1)/20).floor+1
        return current.sub(player[this.layer].points).max(Decimal.d0)
    },
    getNextAt(canMax=false){
        let current=tmp[this.layer].getResetGain.add(player[this.layer].points)
        return this.exponentBase.pow(current).times(this.mult)
    },
    canReset(){return tmp[this.layer].getResetGain.gte(Decimal.d1)?true:false},
    prestigeButtonText(){return 'Reset for '+format(tmp[this.layer].getResetGain,0)+' fruits<br>Next at '+format(tmp[this.layer].getNextAt,0)+' prestige points'},
    exponent: Decimal.d2,                          
    canBuyMax(){return true},
    gainMult() {                            
        return Decimal.d1               
    },
    gainExp() {                             
        return Decimal.d1
    },

    layerShown() { return true },          

    effect(){
        return player.f.points.add(Decimal.d1).root(Decimal.d2)
    },
    effectDescription(){
        return 'They are boosting your point gain by '+format(this.effect())+'x'
    },

    upgrades: {

    },
    buyables: {
        11: {
            title:'upvoid',
            purchaseLimit(){
                return Decimal.d0
            },
            cost(x) { return new Decimal(1).mul(x) },
            display() { 
                return "an buyable that \"spawn\" upgrades in prestige layer.<br><br>"
                    +'Currently: \"spawn\"ed '+format(getBuyableAmount(this.layer, this.id),0)+' upgrades.<br><br>'
                    +'Cost:'+(getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)?"MAXED":(format(this.cost(),0)+' fruits<br>'))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
    tabFormat: [
            "main-display",
            ["display-text",function() { return 'This layer currently does something...' },],
            "prestige-button",
            //'blank',
            'resource-display',
            'upgrades',
            'buyables',
        ],
})