// Why you are seeing this, this is fulled of f*cked up code, bad design, and almost no programming.
// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())return d0
    
    let base = d1
    let pGain = d1
    if (hasUpgrade('p',11)) pGain = pGain.times(d2)
    if (hasUpgrade('p',12)) pGain = pGain.times(tmp.p.upgrades[12].effect)
    if (hasUpgrade('p',13)) pGain = pGain.times(tmp.p.upgrades[13].effect)
    if (hasUpgrade('p',14)) pGain = pGain.times(tmp.p.upgrades[14].effect)
    let mGain = d1
    if (hasAchievement('m',11)) mGain = mGain.times(tmp.m.achievements[11].effect)
    //if (hasAchievement('m',12)) mGain = mGain.times(tmp.m.achievements[12].effect)
    let aGain = d1
    if (hasUpgrade('a',21)) aGain = aGain.mul(tmp.a.upgrades[21].effect)
    if (hasUpgrade('a',22)) aGain = aGain.mul(tmp.a.upgrades[22].effect)
    if (hasUpgrade('a',23)) aGain = aGain.mul(tmp.a.upgrades[23].effect)    
    if (hasUpgrade('a',24)) aGain = aGain.mul(tmp.a.upgrades[24].effect)
    let fGain = d1
    //if (tmp.f.effect.gte(1)) fGain = fGain.times(tmp.f.effect)
	return {total:base.times(pGain).mul(mGain).mul(aGain).times(fGain),p:pGain,m:mGain,a:aGain,f:fGain}
}

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
    tabFormat:{'Base point':{
        content:["blank",
        ["display-text",function(){
            words=''
            if (player.p.unlocked){words+='Prestige layer has boost your point gain by '+format(tmp.moreGen.p)+'x ('+format(tmp.moreGen.p.log(tmp.pointGen).mul(100))+'%)<br>'}
            if (player.m.unlocked){words+='Milestone layer boost has your point gain by '+format(tmp.moreGen.m)+'x ('+format(tmp.moreGen.m.log(tmp.pointGen).mul(100))+'%)<br>'}
            if (player.a.unlocked){words+='Allodoxaphobia layer has boost your point gain by '+format(tmp.moreGen.a)+'x ('+format(tmp.moreGen.a.log(tmp.pointGen).mul(100))+'%)<br>'}
            if (player.f.unlocked){words+='Fruits layer has boost your point gain by '+format(tmp.moreGen.f)+'x ('+format(tmp.moreGen.f.log(tmp.pointGen).mul(100))+'%)<br>'}
            return words
        }],
        /*["display-image", 'https://i.postimg.cc/j2CyG6hQ/Screenshot-2022-07-24-114647.jpg',{ height: '400px', width: '1600px', position: 'relative', right: '-250px', top: '-1000px'}],
        ['display-image', 'https://i.postimg.cc/j2CyG6hQ/Screenshot-2022-07-24-114647.jpg' ],*/
        'blank',
        ["display-image", 'js/images/your guys.png', {maxWidth:'85%',maxHeight:'85%',position: 'relative'}],
    ],},
    "Prestige point":{
        content:["blank",
        ["display-text",function(){
            words=''
            if (player.f.unlocked){words+='Fruits layer: '+format(tmp.f.effect)+'x<br>'}
            return words
        }],],
        unlocked(){return player.f.unlocked},
        },

}})
