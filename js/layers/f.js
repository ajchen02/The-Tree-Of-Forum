addLayer("f", {
    startData() { return {                  
        unlocked: false,                    
        points: d0,             
    }},

    color: "#ADFF2F",
    resource: "fruits",            
    row: 3,   
    position:1,                              
    branches:['m','a','p'],
    baseResource: "prestige point",         
    baseAmount() { return player.p.points },
    layerShown() {return player[this.layer].unlocked||player.m.points.gte(9)||player.a.total.gte(11)||player.p.points.gte(1e4)},

    requires: n(1e4),              
    

    type: "custom",
    exponentBase: n(1.5),
    mult: n(1e4),
    getResetGain(){
        if (tmp[this.layer].baseAmount.lt(1e4)) return d0
        //log[exBase](baseAmount/mult)
        current = tmp[this.layer].baseAmount.add(d1).div(this.mult).log(this.exponentBase).floor().add(d1)
        return current.max(0)
    },
    getNextAt(canMax=false){
        let current=tmp[this.layer].getResetGain
        return this.exponentBase.pow(current).times(this.mult)
    },
    canReset(){return tmp[this.layer].getResetGain.gte(d1)?true:false},
    prestigeButtonText(){return `Reset for ${format(tmp[this.layer].getResetGain,0)} fruits<br>Next at ${format(tmp[this.layer].getNextAt)} prestige points`},
    canBuyMax(){return true},
    effect(){
        return player.f.points.root(d2).add(1)
    },
    effectDescription(){
        return `<br>They are boosting your prestige point gain by ${format(this.effect())}x`
    },

    upgrades: {

    },
    buyables: {
        11: {
            title:'upvoid',
            purchaseLimit(){
                return /*d4*/d2
            },
            cost(x) { return d1.mul(x.add(1)) },
            display() { 
                return `Unlock upgrades in prestige layer.<br><br>
                    Currently: unlocked ${format(getBuyableAmount(this.layer, this.id),0)} upgrades.<br><br>
                    Cost:${(getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)?"MAXED":(`${format(this.cost(),0)} fruits<br>`))}`
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
                return d3
            },
            cost(x) { return d3.pow(x.add(1)) },
            display() { 
                return `Unlock achievements in milestone layer.<br><br>
                    Currently: unlocked ${format(getBuyableAmount(this.layer, this.id),0)} achievements.<br><br>
                    Cost:${(getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)?"MAXED":(`${format(this.cost(),0)} fruits<br>`))}`
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
                return d2
            },
            cost(x) { return d3.pow(x.add(1)) },
            display() { 
                return `Unlock rows of upgrades in allodoxaphobia layer.<br><br>
                    Currently: unlocked ${format(getBuyableAmount(this.layer, this.id),0)} rows of upgrades.
                    ${getBuyableAmount(this.layer, this.id).gte(2)?`it also keeping your first ${format(getBuyableAmount(this.layer, this.id).sub(1),0)} row of upgrades.`:''}<br><br>
                    Cost:${(getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)?"MAXED":(`${format(this.cost(),0)} fruits<br>`))}`
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