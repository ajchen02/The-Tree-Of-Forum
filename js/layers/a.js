
addLayer("a", {
    startData() { return {                  
        unlocked: false,                    
        points: d0,
        total: d0, 
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
    requires: d10,              
    hotkeys: [
        {key: "a", description: "A: Reset for allodoxaphobia", onPress(){if (canReset(this.layer)) doReset(this.layer)},unlocked() {return player[this.layer].unlocked}},
    ],
    
    type: "custom",
    exponentBase:n(1.7),
    mult: d20,
    //exponent: d2,  
    getResetGain(){
        if (tmp[this.layer].baseAmount.lt(this.requires)) return d0
        //(log[baseLog](baseRes+1)/mult))^2+1
        current = tmp[this.layer].baseAmount.add(d1).div(this.mult).log(this.exponentBase).floor().add(d1)
        return current.sub(player[this.layer].total).max(d0)
    },
    getNextAt(canMax=false){
        let current=tmp[this.layer].getResetGain.add(player[this.layer].total)
        return this.exponentBase.pow(current).times(this.mult)
    },
    canReset(){return tmp[this.layer].getResetGain.gte(d1)?true:false},
    prestigeButtonText(){return 'Reset for <b>'+format(tmp[this.layer].getResetGain,0)+'</b> '+tmp[this.layer].resource+'<br>Next at '+format(tmp[this.layer].getNextAt,0)+' prestige points<br>'+(
        (tmp[this.layer].baseAmount.lte(0))?(format(0)):(format(Decimal.max(tmp[this.layer].baseAmount.div(tmp[this.layer].getNextAt),tmp[this.layer].baseAmount.log(tmp[this.layer].getNextAt.mul(100))).mul(100))))
        +'% completed'//<br>('+format(tmp[this.layer].baseAmount.div(tmp[this.layer].getNextAt).mul(100))+'%, '+format(tmp[this.layer].baseAmount.max(1).log(tmp[this.layer].getNextAt).mul(100))+'%, '+format(Decimal.add(tmp[this.layer].baseAmount.div(tmp[this.layer].getNextAt).mul(100),format(tmp[this.layer].baseAmount.log(tmp[this.layer].getNextAt).mul(100))).div(2))+'%)'
    },                      
    canBuyMax(){return true},
    gainMult() {                            
        return d1               
    },
    gainExp() {                             
        return d1
    },
    upgradesLimition() {
        limited = []
        if (((hasUpgrade(this.layer,11)+hasUpgrade(this.layer,12)+hasUpgrade(this.layer,13)+hasUpgrade(this.layer,14))>=2)&&!hasAchievement('m',16)) limited.push(10)
        if ((hasUpgrade(this.layer,21)+hasUpgrade(this.layer,22)+hasUpgrade(this.layer,23)+hasUpgrade(this.layer,24))>=2) limited.push(20)
        if ((hasUpgrade(this.layer,31)+hasUpgrade(this.layer,32)+hasUpgrade(this.layer,33)+hasUpgrade(this.layer,34))>=2) limited.push(30)
        if ((hasUpgrade(this.layer,41)+hasUpgrade(this.layer,42)+hasUpgrade(this.layer,43)+hasUpgrade(this.layer,44))>=2) limited.push(40)
        return limited
    },
    autoPrestige(){ return hasUpgrade(this.layer,31)},
    resetsNothing(){return hasUpgrade(this.layer,32)},
    upgrades: {
        11: {
            description:'Keep Prestige upgrade 11 when you does layer 2 reset.',
            cost: d1,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(10)},
            onPurchase(){player.p.upgrades.push(11)},
        },
        12: {
            description:'Keep Prestige upgrade 12 when you does layer 2 reset.',
            cost: d1,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(10)},
            onPurchase(){player.p.upgrades.push(12)},
        },
        13: {
            description:'Keep Prestige upgrade 13 when you does layer 2 reset.',
            cost: d2,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(10)},
            onPurchase(){player.p.upgrades.push(13)},
        },
        14: {
            description:'Keep Prestige upgrade 14 when you does layer 2 reset.',
            cost: d3,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(10)},
            onPurchase(){player.p.upgrades.push(14)},
            tooltip:'Also keeping your Last.',
        },
        21: {
            description:'Boost point gain.',
            cost: d3,
            effect: n(7.5),
            tooltip:'Formula: 7.5',
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(20)},
            unlocked(){return player[this.layer].total.gte(5)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            description:'Boost point gain.',
            cost: d3,
            effect(){return player.points.max(1).log10().max(1).mul(6).root(2)},
            tooltip:'Formula: 2√(log10(points)x6)',
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(20)},
            unlocked(){return player[this.layer].total.gte(5)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },

        },
        23: {
            description:'Boost point gain.',
            cost: d3,
            effect(){return player.p.points.max(1).root(5).min(10)},
            tooltip(){return 'Formula: 5√(prestige points)'+((upgradeEffect(this.layer,this.id).gte(d10)&&hasUpgrade(this.layer,this.id))?'<br>Hardcapped at 10x':'')},
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(20)},
            unlocked(){return player[this.layer].total.gte(5)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        24: {
            description:'Boost point gain.',
            cost: d3,
            effect(){return player[this.layer].total.root(1.5).max(1)},
            tooltip:'Formula: 1.5√(total allodoxaphobia)',
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(20)},
            unlocked(){return player[this.layer].total.gte(5)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        31: {
            description:'Automatically reset allodoxaphobia.',
            tooltip:'WARNING: This will reset whenever it can, so it might cause slower progress.',
            cost: d6,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(30)},
            unlocked(){return player[this.layer].total.gte(15)&&getBuyableAmount('f',22).gte(1)},
        },
        32: {
            description:'allodoxaphobia doesn\'t reset anything.',
            cost: d7,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(30)},
            unlocked(){return player[this.layer].total.gte(15)&&getBuyableAmount('f',22).gte(1)},
        },
        33: {
            description:'You can buy max milestones.',
            cost: d8,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(30)},
            unlocked(){return player[this.layer].total.gte(15)&&getBuyableAmount('f',22).gte(1)},
        },
        34: {
            description:'milestones doesn\'t reset anything.',
            cost: d9,
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(30)},
            unlocked(){return player[this.layer].total.gte(15)&&getBuyableAmount('f',22).gte(1)},
        },
        
        41: {
            description:'Boost Prestige Upgrade 11.',
            cost: d7,
            effect(){return d2.mul(player.p.upgrades.length)},
            tooltip:'Effect: 2*(Amount of Prestige Upgrade you have)',
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(40)},
            unlocked(){return player[this.layer].total.gte(20)&&getBuyableAmount('f',22).gte(2)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        42: {
            description:'Boost Prestige upgrade 12.',
            cost: d7,
            effect(){
                let p=player.p.points.max(1).log10()
                let m=player.m.points.max(1).div(5)
                let a=player.a.total.max(1).div(5)
                //console.log('p: '+p+' m: '+m+' a: '+a)
                return p.add(m).add(a).mul(2)
            },
            tooltip:'Effect: increases prestige upgrade 12\'s hardcap based on p, m and a.',
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(40)},
            unlocked(){return player[this.layer].total.gte(20)&&getBuyableAmount('f',22).gte(2)},
            effectDisplay() { return '+'+format(upgradeEffect(this.layer, this.id)) },
        },
        43: {
            description:'Boost Prestige upgrade 13.',
            cost: d7,
            effect(){return player.p.points.max(1).log10().min(8.8)},
            tooltip(){return 'Effect: prestige upgrade 13\'s log is redused by prestige points.'+((upgradeEffect(this.layer,this.id).gte(8.8)&&hasUpgrade(this.layer,this.id))?'<br>Hardcapped at -8.8':'')},
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(40)},
            unlocked(){return player[this.layer].total.gte(20)&&getBuyableAmount('f',22).gte(2)},
            effectDisplay() { return '-'+format(upgradeEffect(this.layer, this.id)) },
        },
        44: {
            description:'Boost Prestige upgrade 14.',
            cost: d7,
            effect: 'yes',
            tooltip:'Effect: Double it\'s effect, and use best instead of total.',
            canAfford(){return !tmp[this.layer].upgradesLimition.includes(40)},
            unlocked(){return player[this.layer].total.gte(20)&&getBuyableAmount('f',22).gte(2)},
            effectDisplay() { return format(d2)+"x" },
        },
    },
    clickables:{
        11: {
            canClick(){return true},
            display() {return 'Respec upgrades'},
            onClick(){
                layerDataReset('p'),player.points=d0
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
            if (player[this.layer].total.lt(15)&&getBuyableAmount('f',22).gte(1)) return ["display-text","Next row of upgrades unlock at 15 allodoxaphobia."];
            if (player[this.layer].total.lt(20)&&getBuyableAmount('f',22).gte(2)) return ["display-text","Next row of upgrades unlock at 20 allodoxaphobia."];
            return ["display-text","All upgrades unlocked!"]
        }},
        'blank',
        function(){if (!player[this.layer].unlocked) return ["display-image", 'js/images/choseing dilma.jpg',{maxWidth:'60%',maxHeight:'60%'}]},
        function(){if (!player[this.layer].unlocked) return ["display-text","Just to make people having choseing dilemas.<br>----says the suggest-er @Shinwmyste#1926"]
        else return ["display-text","You can only have 2 upgrades in a row."]},
        function(){if (player[this.layer].unlocked) return "clickables"},
        function(){if (player[this.layer].unlocked) return "upgrades"},
        //function(){if (player[this.layer].unlocked) return "buyables"},
    ],
})
