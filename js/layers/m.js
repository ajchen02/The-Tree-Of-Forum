
addLayer("m", {
    startData() { return {                  
        unlocked: false,                    
        points: d0,             
    }},

    color: "#793784",                       
    resource: "milestones",            
    row: 2,
    position: 0,                        
    branches:['p'],
    inBranch(layer){return this.branches.includes(layer)},
    baseResource: "prestige point",         
    baseAmount() { return player.p.points },

    requires: d20,              
    layerShown() {return hasUpgrade('p',14)||player[this.layer].unlocked||player.a.unlocked},
    hotkeys: [
        {key: "m", description: "M: Reset for milestones", onPress(){if (canReset(this.layer)) doReset(this.layer)},unlocked() {return player[this.layer].unlocked}},
    ],
    type: "custom",
    exponentBase: d2,
    mult: d20,
    getResetGain(){
        //console.log(player.f.points.add(d1).div(this.mult).log(this.exponentBase))
        if (tmp[this.layer].baseAmount.lt(tmp[this.layer].requires)) return d0
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
        +'% completed?<br>or '+
        format(tmp[this.layer].baseAmount.div(tmp[this.layer].getNextAt).mul(100))+'%, '+format(tmp[this.layer].baseAmount.max(1).log(tmp[this.layer].getNextAt).mul(100))+'%, '+format(Decimal.add(tmp[this.layer].baseAmount.div(tmp[this.layer].getNextAt).mul(100),format(tmp[this.layer].baseAmount.log(tmp[this.layer].getNextAt).mul(100))).div(2))+'%<br>'
        //+'It\'s very hard to predict an "pertenge" of this after all.'
        },
    exponent: d2,                          
    canBuyMax(){return false},
    prestigeNotify(){
        if (tmp[this.layer].getResetGain.gte(1)) return true
    },
    gainMult() {                            
        return d1               
    },
    gainExp() {                             
        return d1
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
            effect() {if (hasAchievement('m',11)) return d2.mul(tmp.m.achievements[12].effect).mul(tmp.m.achievements[13].effect); else return d1},
        },
        12: {
            unlocked(){return hasAchievement('m',11)},
            name: "The Second Achievement.",
            done() { return player[this.layer].points.gte(2) },
            goalTooltip:'Just Get 2 Milestones, cmon that is easy.',
            doneTooltip(){return 'Boost the first achievement by 1.25x PER MILESTONES.<br>'+'Currently: '+format(tmp.m.achievements[12].effect)+'x.'},
            effect() {if (hasAchievement('m',12)) return n(1.25).pow(player[this.layer].points.max(1)); else return d1},
        },
        13: {
            unlocked(){return hasAchievement('m',12)},
            name: "I'M RUNNING OUT OF NAMES!!!",
            done() { return player[this.layer].points.gte(5) },
            goalTooltip:'Get 5 Milestones.<br> This is going to be a long one, I suggest you to play another layer first.',
            doneTooltip(){return 'Boost the first achievement by 1.5x PER ACHIEVEMENTS.<br>'+'Currently: '+format(tmp.m.achievements[13].effect)+'x.'},
            effect() {if (hasAchievement('m',13)) return n(1.5).pow(player[this.layer].achievements.length).max(1); else return d1},
        },
        14: {
            unlocked(){return hasAchievement('m',13)},
            name: "TheEgglet",
            done() { return player[this.layer].points.gte(8) },
            goalTooltip:'Get 8 Milestones.<br>Gain spme of prestige point sould like an great idea.',
            doneTooltip(){return 'Gain 5% of prestige point per second.<br>'},
            effect:'yes',
        },
        15: {
            unlocked(){return hasAchievement('m',14)&&getBuyableAmount('f',12).gte(1)},
            name: "allodox-aphilia",
            done() { return player[this.layer].points.gte(10)&&getBuyableAmount('f',12).gte(1) },
            goalTooltip:'Get 10 Milestones.<br>Now some people will be mad cuz i programmed something to unlock something to unlock something.',
            doneTooltip(){return 'Allows you to buy all row one upgrades in the allodoxaphobia layer.'},
            effect:'yes',
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
