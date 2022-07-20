addLayer("stat", {
    name: "stats", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ST", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFD400",
    tooltip:"Stats",
    resource: "stat", // Name of prestige currency
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat:[
    "blank",
        ["display-text",function(){
            words=''
            if (player.p.unlocked){words+='Prestige layer totally boost your point gain by '+format(tmp.moreGen.p)+'x ('+format(tmp.moreGen.p.log(tmp.pointGen).mul(100))+'%)<br>'}
            if (player.m.unlocked){words+='Milestone layer totally boost your point gain by '+format(tmp.moreGen.m)+'x ('+format(tmp.moreGen.m.log(tmp.pointGen).mul(100))+'%)<br>'}
            if (player.a.unlocked){words+='Allodoxaphobia layer totally boost your point gain by '+format(tmp.moreGen.a)+'x ('+format(tmp.moreGen.a.log(tmp.pointGen).mul(100))+'%)<br>'}
            return words
        }],
        
    ],
})
