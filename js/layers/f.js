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