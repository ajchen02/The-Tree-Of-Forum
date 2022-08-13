
addLayer("sb", {
    startData() { return {                  
        unlocked: false,                    
        points: d0,
        boosters: d0,
        boostersPerSec: d0, 
    }},

    color: "#504899",
    resource: "super boosters",
    row: 3,
    position: 2,
    symbol: "SB",
    branches:['a'],
    baseResource: "allodoxaphobia",         
    baseAmount() { return player.a.total },

    layerShown() {return hasAchievement('m',21)||player[this.layer].unlocked},
    hotkeys: [
        {key: "B", description: "Shift+B: Reset for super boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)},unlocked() {return player[this.layer].unlocked}},
    ],

    update(diff){
        player[this.layer].boostersPerSec=player[this.layer].points.pow(2).div(10)
        if (player[this.layer].unlocked) player[this.layer].boosters=player[this.layer].boosters.add(player[this.layer].boostersPerSec.mul(diff))
    },


    type: "custom",
    requires: d10,              
    exponentBase: d2,
    mult: d10,
    getResetGain(){
        //console.log(player.f.points.add(d1).div(this.mult).log(this.exponentBase))
        if (tmp[this.layer].baseAmount.lt(tmp[this.layer].requires)) return d0
        current = tmp[this.layer].baseAmount.div(this.mult).max(1).log(this.exponentBase).floor().add(1)
        if (tmp[this.layer].canBuyMax) return current.sub(player[this.layer].points).max(0)
                else return current.sub(player[this.layer].points).max(0).min(1)
    },
    getNextAt(canMax=false){
        let current=tmp[this.layer].getResetGain.add(player[this.layer].points)
        return this.exponentBase.pow(current).times(this.mult)
    },
    canReset(){return tmp[this.layer].getResetGain.gte(1)?true:false},
    prestigeButtonText(){
        if (tmp[this.layer].canBuyMax) {return `Reset for <b>${format(tmp[this.layer].getResetGain,0)}</b> ${tmp[this.layer].resource}<br>Next at ${format(tmp[this.layer].getNextAt,tmp[this.layer].getNextAt.gte('1e9')?2:null)} prestige points`}
        if (/*Can gain next*/tmp[this.layer].getResetGain.gte(1)) {return `<b>Reset for ${tmp[this.layer].resource}.</b>`}
        /*Can't gain next*/ return `Next at ${format(tmp[this.layer].getNextAt,tmp[this.layer].getNextAt.gte('1e9')?2:null)} ${tmp[this.layer].baseResource}.<br>${(
        (tmp[this.layer].baseAmount.lte(0))?(format(0)):(format(Decimal.max(tmp[this.layer].baseAmount.div(tmp[this.layer].getNextAt),tmp[this.layer].baseAmount.log(tmp[this.layer].getNextAt.mul(100))).mul(100))))
        }% completed<br>`
        },
    prestigeNotify(){
        if (tmp[this.layer].getResetGain.gte(1)) return true
    },
    canBuyMax(){return false},

    effect(){
        return player[this.layer].boosters.add(1).pow(1.25).max(1)
    },

    tabFormat: [
            "main-display",
            ["prestige-button",,{width:'240px',height:'120px'}],
            'resource-display',
            function(){if (!player[this.layer].unlocked) return ["display-text",`By the way, this mod is using thepaperpliot's "reset in branch" mode,<br> so you will still have milestone when resetting this layer.`]},
            function(){if (player[this.layer].unlocked) return ["display-text",`You have <b>${format(player[this.layer].boosters)}</b> boosters, (+${format(player[this.layer].boostersPerSec)}/s)<br>
             They are boosting your point gain by <b>${format(tmp[this.layer].effect)}x.</b>`]},
        ],
    doReset(resettingLayer) {
        if (resettingLayer==this.layer||!(inBranch(this.layer,resettingLayer))) {return;}
        layerDataReset(this.layer)
    },
})
