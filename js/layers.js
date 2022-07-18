
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
	return base.times(pGain).mul(mGain).mul(aGain).times(fGain)
}

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
                return player.points.add(Decimal.d1).log10().add(Decimal.d1)
            },
            tooltip:"Formula: Log10(x+1)+1",
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title:'Jakub',
            description:'Multiplies point gain based on last prestige reset gain.',
            cost: Decimal.d10,
            effect() {
                return player[this.layer].last.max(Decimal.d1).log10().max(1)
                //Alternative return player[this.layer].last.max(1).root(2)
            },
            tooltip(){return "Last: "+format(player[this.layer].last,0)+"<br>Formula: Log10(x)"},
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
    //passiveGeneration(){return 0.1},
}) 

addLayer("m", {
    startData() { return {                  
        unlocked: false,                    
        points: Decimal.d0,             
    }},

    color: "#793784",                       
    resource: "milestones",            
    row: 2,
    position: 0,                        
    branches:['p'],
    baseResource: "prestige point",         
    baseAmount() { return player.p.points },

    requires: Decimal.d20,              
    layerShown() {return hasUpgrade('p',14)||player[this.layer].unlocked||player.a.unlocked},
    hotkeys: [
        {key: "m", description: "M: Reset for milestones", onPress(){if (canReset(this.layer)) doReset(this.layer)},unlocked() {return player[this.layer].unlocked}},
    ],
    type: "custom",
    exponentBase: Decimal.d2,
    mult: Decimal.d20,
    getResetGain(){
        //console.log(player.f.points.add(Decimal.d1).div(this.mult).log(this.exponentBase))
        if (tmp[this.layer].baseAmount.lt(tmp[this.layer].requires)) return Decimal.d0
        current = tmp[this.layer].baseAmount.div(this.mult).max(1).log(this.exponentBase).floor().add(1)
        if (tmp[this.layer].canBuyMax) return current.sub(player[this.layer].points).max(0)
        return current.sub(player[this.layer].points).max(0).min(1)
    },
    getNextAt(canMax=false){
        let current=tmp[this.layer].getResetGain.add(player[this.layer].points)
        return this.exponentBase.pow(current).times(this.mult)
    },
    canReset(){return tmp[this.layer].getResetGain.gte(1)?true:false},
    prestigeButtonText(){
        if (/*Can Bulk Gain*/false) {return 'Reset for '+format(tmp[this.layer].getResetGain,0)+' '+tmp[this.layer].resource+'<br>Next at '+format(tmp[this.layer].getNextAt,0)+' prestige points'}
        if (/*Can gain next*/tmp[this.layer].getResetGain.gte(1)) {return 'Reset for next '+tmp[this.layer].resource+'.'}
        /*Can't gain next*/ return 'Next at '+format(tmp[this.layer].getNextAt,tmp[this.layer].getNextAt.gte('1e9')?2:null)+' prestige points.<br>Maybe '+(
        (tmp[this.layer].baseAmount.lte(0))?(format(0)):(format(Decimal.max(tmp[this.layer].baseAmount.div(tmp[this.layer].getNextAt),tmp[this.layer].baseAmount.log(tmp[this.layer].getNextAt.mul(100))).mul(100))))
        +'% completed?' 
        },
    exponent: Decimal.d2,                          
    canBuyMax(){return false},
    prestigeNotify(){
        if (tmp[this.layer].getResetGain.gte(1)) return true
    },
    gainMult() {                            
        return Decimal.d1               
    },
    gainExp() {                             
        return Decimal.d1
    },          

    upgrades: {
    },
    buyables: {
    },
    achievements: {
        11: {
            name: "I Thought I'm Getting Milestones?",
            done() { return player[this.layer].points.gte(1) },
            tooltip(){return 'Milestones take too many spaces...<br>Currently: Boost point gain by '+format(tmp.m.achievements[11].effect)+'x.'},
            effect() {if (hasAchievement('m',11)) return Decimal.d2.mul(tmp.m.achievements[12].effect).mul(tmp.m.achievements[13].effect); else return Decimal.d1},
        },
        12: {
            unlocked(){return hasAchievement('m',11)},
            name: "The Second Achievement.",
            done() { return player[this.layer].points.gte(2) },
            goalTooltip:'Just Get 2 Milestones, cmon that is easy.',
            doneTooltip(){return 'Boost the first achievement by 1.25x PER MILESTONES.<br>'+'Currently: '+format(tmp.m.achievements[12].effect)+'x.'},
            effect() {if (hasAchievement('m',12)) return new Decimal(1.25).pow(player[this.layer].points.max(1)); else return Decimal.d1},
        },
        13: {
            unlocked(){return hasAchievement('m',12)},
            name: "I'M RUNNING OUT OF NAMES!!!",
            done() { return player[this.layer].points.gte(5) },
            goalTooltip:'Get 5 Milestones.<br> This is going to be a long one, I suggest you to play another layer first.',
            doneTooltip(){return 'Boost the first achievement by 1.5x PER ACHIEVEMENTS.<br>'+'Currently: '+format(tmp.m.achievements[13].effect)+'x.'},
            effect() {if (hasAchievement('m',13)) return new Decimal(player[this.layer].achievements.length).max(1).pow(1.5); else return Decimal.d1},
        },
    },
    tabFormat: [
            "main-display",
            ["prestige-button",,{width:'240px',height:'120px'}],
            'resource-display',
            /*function(){if (player[this.layer].unlocked) {switch(player[this.layer].achievements.length){
                case 1: var next=2; break
                case 2: var next=0; break}
            return ["display-text",(next!=0)?'Next achievement unlock at '+next.toString()+' milestones':'All achievements unlocked!']}},*/
            function(){if (!player[this.layer].unlocked) return ["display-text",'That prestige butten is \"\"\"slightly\"\"\" wider just for good looking.']
                        else return 'achievements'},
            
        ],
})

addLayer("a", {
    startData() { return {                  
        unlocked: false,                    
        points: Decimal.d0,
        total: Decimal.d0, 
        upgradesLimition:[],           
    }},

    color: "#ADFF2F",                       
    resource: "allodoxaphobia",            
    row: 2,              
    position: 1,                    
    branches:['p'],
    baseResource: "prestige point",         
    baseAmount() { return player.p.points },
    layerShown() {return hasUpgrade('p',14)||player[this.layer].unlocked||player.m.unlocked},
    requires: Decimal.d10,              
    hotkeys: [
        {key: "a", description: "A: Reset for allodoxaphobia", onPress(){if (canReset(this.layer)) doReset(this.layer)},unlocked() {return player[this.layer].unlocked}},
    ],
    
    type: "custom",
    exponentBase:new Decimal(1.75),
    mult: Decimal.d20,
    exponent: Decimal.d2,  
    getResetGain(){
        //console.log(player.f.points.add(Decimal.d1).div(this.mult).log(this.exponentBase))
        if (tmp[this.layer].baseAmount.lt(this.requires)) return Decimal.d0
        current = tmp[this.layer].baseAmount.add(Decimal.d1).div(this.mult).log(this.exponentBase).floor().add(Decimal.d1)
        return current.sub(player[this.layer].total).max(Decimal.d0)
    },
    getNextAt(canMax=false){
        let current=tmp[this.layer].getResetGain.add(player[this.layer].total)
        return this.exponentBase.pow(current).times(this.mult)
    },
    canReset(){return tmp[this.layer].getResetGain.gte(Decimal.d1)?true:false},
    prestigeButtonText(){return 'Reset for '+format(tmp[this.layer].getResetGain,0)+' '+tmp[this.layer].resource+'<br>Next at '+format(tmp[this.layer].getNextAt,0)+' prestige points<br>'+(
        (tmp[this.layer].baseAmount.lte(0))?(format(0)):(format(Decimal.max(tmp[this.layer].baseAmount.div(tmp[this.layer].getNextAt),tmp[this.layer].baseAmount.log(tmp[this.layer].getNextAt.mul(100))).mul(100))))
        +'% completed'},                      
    canBuyMax(){return true},
    gainMult() {                            
        return Decimal.d1               
    },
    gainExp() {                             
        return Decimal.d1
    },
    upgradesLimition() {
        limited = []
        if ((hasUpgrade(this.layer,11)+hasUpgrade(this.layer,12)+hasUpgrade(this.layer,13)+hasUpgrade(this.layer,14))>=2) limited.push(10)
        if ((hasUpgrade(this.layer,21)+hasUpgrade(this.layer,22)+hasUpgrade(this.layer,23)+hasUpgrade(this.layer,24))>=2) limited.push(20)
        return limited
    },
    upgrades: {
        11: {
            description:'Keep Prestige upgrade 11 when you does layer 2 reset.',
            cost: Decimal.d1,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(10)},
            onPurchase(){player.p.upgrades.push(11)},
        },
        12: {
            description:'Keep Prestige upgrade 12 when you does layer 2 reset.',
            cost: Decimal.d1,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(10)},
            onPurchase(){player.p.upgrades.push(12)},
        },
        13: {
            description:'Keep Prestige upgrade 13 when you does layer 2 reset.',
            cost: Decimal.d2,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(10)},
            onPurchase(){player.p.upgrades.push(13)},
        },
        14: {
            description:'Keep Prestige upgrade 14 when you does layer 2 reset.',
            cost: Decimal.d3,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(10)},
            onPurchase(){player.p.upgrades.push(14)},
            tooltip:'Also keeping your Last.',
        },
        21: {
            description:'Boost point gain.',
            cost: Decimal.d3,
            effect(){return new Decimal(5)},
            tooltip:'Formula: 5',
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(20)},
            unlocked(){return player[this.layer].total.gte(5)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            description:'Boost point gain.',
            cost: Decimal.d3,
            effect(){return player.points.max(1).log10().max(1).mul(2).root(2)},
            tooltip:'Formula: 2√(log10(points)x2)',
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(20)},
            unlocked(){return player[this.layer].total.gte(5)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },

        },
        23: {
            description:'Boost point gain.',
            cost: Decimal.d3,
            effect(){return player.p.points.max(1).root(5).min(10)},
            tooltip(){return 'Formula: 5√(prestige points)'+((upgradeEffect(this.layer,this.id).gte(Decimal.d10)&&hasUpgrade(this.layer,this.id))?'<br>Hardcapped at 10x':'')},
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(20)},
            unlocked(){return player[this.layer].total.gte(5)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        24: {
            description:'Boost point gain.',
            cost: Decimal.d3,
            effect(){return player[this.layer].total.root(2).max(1).add(1)},
            tooltip:'Formula: 1+2√(total allodoxaphobia)',
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(20)},
            unlocked(){return player[this.layer].total.gte(5)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

    },
    clickables:{
        11: {
            canClick(){return true},
            display() {return 'Respec upgrades'},
            onClick(){
                layerDataReset('p'),player.points=Decimal.d0
                layerDataReset(this.layer,['unlocked','points','total'])
                player[this.layer].points=player[this.layer].total
            },
            style: {
                width:'120px',
                'min-height':'30px',
            },
        },
    },
    tabFormat: [
        "main-display",
        ["prestige-button",,{width:'240px',height:'120px'}],
        'resource-display',
        function(){if (player[this.layer].unlocked){
            if (player[this.layer].total.lt(5)) return ["display-text","Next row of upgrades unlock at 5 allodoxaphobia."];
            return ["display-text","All upgrades unlocked!"]
        }},
        'blank',
        function(){if (!player[this.layer].unlocked) return ["display-text","Just to make people having choseing dilemas.<br>----says the suggest-er @Shinwmyste#1926"]
        else return ["display-text","You can only have 2 upgrades in a row."]},
        function(){if (player[this.layer].unlocked) return "clickables"},
        function(){if (player[this.layer].unlocked) return "upgrades"},
        //function(){if (player[this.layer].unlocked) return "buyables"},
    ],
})
addLayer("f", {
    startData() { return {                  
        unlocked: false,                    
        points: Decimal.d0,             
    }},

    color: "#ADFF2F",                       
    resource: "fruits",            
    row: 3,                                 
    branches:['p'],
    baseResource: "prestige point",         
    baseAmount() { return player.p.points },
    layerShown() {return player[this.layer].unlocked},

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