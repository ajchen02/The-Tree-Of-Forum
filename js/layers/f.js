addLayer("f", {
    startData() { return {                  
        unlocked: false,                    
        points: d0,             
    }},

    color: "#ADFF2F",                       
    resource: "fruits",            
    row: 3,                                 
    branches:['m','a','p'],
    baseResource: "prestige point",         
    baseAmount() { return player.p.points },
    layerShown() {return player[this.layer].unlocked||player.m.points.gte(10)||player.a.points.gte(15)||player.p.points.gte(1e5)},

    requires: n(1e5),              
    
    
    type: "custom",
    exponentBase: d2,
    mult: n(1e5),
    getResetGain(){
        //console.log(player.f.points.add(d1).div(this.mult).log(this.exponentBase))
        if (tmp[this.layer].baseAmount.lt(1e5)) return d0
        current = tmp[this.layer].baseAmount.add(d1).div(this.mult).log(this.exponentBase).floor().add(d1)
        //log[exBase]((x+1)/20).floor+1
        return current.max(0) //.sub(player[this.layer].points).max(d0)
    },
    getNextAt(canMax=false){
        let current=tmp[this.layer].getResetGain//.add(player[this.layer].points)
        return this.exponentBase.pow(current).times(this.mult)
    },
    canReset(){return tmp[this.layer].getResetGain.gte(d1)?true:false},
    prestigeButtonText(){return 'Reset for '+format(tmp[this.layer].getResetGain,0)+' fruits<br>Next at '+format(tmp[this.layer].getNextAt,0)+' prestige points'},
    exponent: d2,                          
    canBuyMax(){return true},
    gainMult() {                            
        return d1               
    },
    gainExp() {                             
        return d1
    },
    doReset(resettingLayer) {
        if (resettingLayer==this.layer) {player.m.unlocked=false;player.a.unlocked=false;return;}
        layerDataReset(this.layer)
    },
    effect(){
        return player.f.points.root(d2).add(1)
    },
    effectDescription(){
        return '<br>They are boosting your prestige point gain by '+format(this.effect())+'x'
    },

    upgrades: {

    },
    buyables: {
        11: {
            title:'upvoid',
            purchaseLimit(){
                return /*d4*/d0
            },
            cost(x) { return d1.mul(x.add(1)) },
            display() { 
                return "Unlock upgrades in prestige layer.<br><br>"
                    +'Currently: unlocked '+format(getBuyableAmount(this.layer, this.id),0)+' upgrades.<br><br>'
                    +'Cost:'+(getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)?"MAXED":(format(this.cost(),0)+' fruits<br>'))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        21: {
            title:'upvoid',
            purchaseLimit(){
                return d1
            },
            cost(x) { return d3.pow(x.add(1)) },
            display() { 
                return "Unlock achievements in milestone layer.<br><br>"
                    +'Currently: unlocked '+format(getBuyableAmount(this.layer, this.id),0)+' achievements.<br><br>'
                    +'Cost:'+(getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)?"MAXED":(format(this.cost(),0)+' fruits<br>'))
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },        
        22: {
            //title:'upvoid',
            purchaseLimit(){
                return d0
            },
            cost(x) { return d3.pow(x.add(1)) },
            display() { 
                return "Unlock rows of upgrades in allodoxaphobia layer.<br><br>"
                    +'Currently: unlocked '+format(getBuyableAmount(this.layer, this.id),0)+' new achievement rows.<br><br>'
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
            //["display-text",function() { return 'This layer currently does something...' },],
            ["prestige-button",,{width:'240px',height:'120px'}],
            //'blank',
            'resource-display',
            'upgrades',
            'buyables',
        ],
})