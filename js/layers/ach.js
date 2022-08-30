// Why you are seeing this, this is fulled of f*cked up code, bad design, and almost no programming.
// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())return d0
    
    let base = d1
    let pGain = d1
    if (hasUpgrade('p',11)) pGain = pGain.times(tmp.p.upgrades[11].effect)
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
    let sbGain = d1
    if (tmp.sb.effect.gte(1)) sbGain = sbGain.times(tmp.sb.effect)
    //if (tmp.f.effect.gte(1)) fGain = fGain.times(tmp.f.effect)
	return {total:base.times(pGain).mul(mGain).mul(aGain).times(fGain).mul(sbGain),p:pGain,m:mGain,a:aGain,f:fGain,sb:sbGain}
}

function getStartPoints(){
    if (player.timePlayed<=10) return n(modInfo.initialStartPoints)
	return d0
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

function giveAchievements(layer,id) {
    if (isPlainObject(layers[layer].achievements[id]) && !(hasAchievement(layer, id))) {
    player[layer].achievements.push(id)
    if (layers[layer].achievements[id].onComplete) layers[layer].achievements[id].onComplete()
    if (tmp[layer].achievementPopups || tmp[layer].achievementPopups === undefined) doPopup("achievement", tmp[layer].achievements[id].name, "Achievement Gotten!", 3, tmp[layer].color);
}}

addLayer("ach", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ach", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFD400",
    tooltip:"Achievements",
    resource: "achievement", // Name of prestige currency
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    achievements:{
        11: {
            name: "10/10<br> no 10sec timewall",
            done() { return player.p.points.gte(1) },
            goalTooltip:"Wait, why did you still not completed this?",
            doneTooltip:"I considered about QoLs.",
            image:'js/images/achievements/11.png',
        },
        12: {
            name: "SCAM",
            done() { return player.p.points.gte(3)&&hasUpgrade('p',12) },
            goalTooltip:"Most of achievement can be completed by just progressing,",
            doneTooltip:":trolled:",
            unlocked(){ return hasAchievement('ach',11)},
            image:'js/images/achievements/12.png',
        },
        13: {
            name: "Wait, that's it?",
            done() { return hasUpgrade('p',14) },
            goalTooltip:"So you needn't check this tab too often :)",
            doneTooltip:"obviously not.",
            unlocked(){ return hasAchievement('ach',11)},
            image:'js/images/achievements/13.png',
            },
        14: {
            name: "Jakub will be sad.",
            done() { return false },//custom function used, done when Jakub upgrade's effect become weaker
            goalTooltip:"Wrongly use 4th upgrade.",
            doneTooltip:";-;",
            unlocked(){ return hasAchievement('ach',13)},
            image:'js/images/achievements/14.png',
        },
        15: {
            name: "Good prestige",
            done() {return getPointGen().p.gte(100)},
            goalTooltip:"Try make prestige boost points.",
            doneTooltip:`Maybe I would nerf prestige boost sometime.`,
            unlocked(){ return hasAchievement('ach',22)},
            image:'js/images/achievements/15.png',
            },
        21: {
            name: "Now play again with more layer!",
            done() { return player.m.unlocked||player.a.unlocked },
            goalTooltip:"I suggest play milestone first.",
            doneTooltip:`I suggest to do bulk gain allodoxaphobia until you can unlock more upgrades.`,
            unlocked(){ return hasAchievement('ach',13)},
            image:'js/images/achievements/21.png',
            },
        22: {
            name: "Now play again with BOTH layer!",
            done() { return player.m.unlocked&&player.a.unlocked },
            goalTooltip:"You can try guess it.",
            doneTooltip:`due to Achievements was added much later, almost no effect are provided.`,
            unlocked(){ return hasAchievement('ach',21)},
            image:'js/images/achievements/22.png',
            },
        23: {
            name: "But WHY",
            done() {return false}, //custom function used, done when no upgrade is reseted when click "respec upgrades"
            goalTooltip:"Reset allo upgrades when there is no nessary.",
            doneTooltip:`And prestige point just fly away.`,
            unlocked(){ return hasAchievement('ach',21)},
            image:'js/images/achievements/23.png',
            },
        24: {
            name: "Keeping upgrades",
            done() {return hasAchievement('m',16)},
            goalTooltip:"Get new milestones.",
            doneTooltip:`Finally some real qol.`,
            unlocked(){ return hasAchievement('ach',21)},
            image:'js/images/achievements/24.png',
            },
            
        },

    tabFormat:{
    'Achievements':{content:[["display-text",`achievements will unlock with progress to avoid spoiler.`],'blank','achievements'],},
    'Miscellaneous':{content:[["display-text",`Stats:`],'blank',['microtabs','Stat',{'border-style':'none','border-bottom-style':'solid'}],'blank',["display-text",`Suggests:`],'blank',['microtabs','Suggest',{'border-style':'none'}],'blank',["display-image", 'js/images/your guys.png', {maxWidth:'90%',maxHeight:'90%',position:'relative'}],]},
    'A page':{content:[["display-text",`Stats:`]],unlocked(){return tmp.gameEnded}},
    },

    microtabs: {
        'Suggest': {
            'Will add': {content:[["display-text",`
                A quark node<br>
                alignment layer<br>
                anti-challenges<br>
                re-do allodoxaphobia<br>
                <del>Second</del> row of prestige upgrades<br>
                Make a Mystery Minaret in the tree <br><del>shinwmyste now i officially hate you too</del><br>
                death and life layer<br>
                Skills allocation<br>
                `]]},
            'Already added': {content:[["display-text",`
                <del>Delete line</del> means original suggest, <i>Italic</i> means actual results.<br>
                i'm too lazy to add things before v0.23<br><br>
                a <del>side layer</del> <i>page</i> that show what suggestion will/already add to the game<br>
                <del>feeling so attacked rn</del><br>
                <del>please don't put this in the game</del><br>
                Achievement layer, <del>uses milestones</del><br>
                `]]},
        },
        'Stat':{'Base point':{
            content:[
            ["display-text",function(){
                words=''
                if (player.p.unlocked){words+=`Prestige layer has boost your point gain by ${format(tmp.moreGen.p)}x (${format(tmp.moreGen.p.log(tmp.pointGen).mul(100))}%)<br>`}
                if (player.m.unlocked){words+=`Milestone layer boost has your point gain by ${format(tmp.moreGen.m)}x (${format(tmp.moreGen.m.log(tmp.pointGen).mul(100))}%)<br>`}
                if (player.a.unlocked){words+=`Allodoxaphobia layer has boost your point gain by ${format(tmp.moreGen.a)}x (${format(tmp.moreGen.a.log(tmp.pointGen).mul(100))}%)<br>`}
                if (player.f.unlocked){words+=`Fruits layer has boost your point gain by ${format(tmp.moreGen.f)}x (${format(tmp.moreGen.f.log(tmp.pointGen).mul(100))}%)<br>`}
                if (player.sb.unlocked){words+=`Super boosters has boost your point gain by ${format(tmp.moreGen.sb)}x (${format(tmp.moreGen.sb.log(tmp.pointGen).mul(100))}%)<br>`}
                return words
            }],
            /*["display-image", 'https://i.postimg.cc/j2CyG6hQ/Screenshot-2022-07-24-114647.jpg',{ height: '400px', width: '1600px', position: 'relative', right: '-250px', top: '-1000px'}],
            ['display-image', 'https://i.postimg.cc/j2CyG6hQ/Screenshot-2022-07-24-114647.jpg' ],*/
            'blank',
        ],},
        "Prestige point":{
            content:[
            ["display-text",function(){
                words=''
                if (player.f.unlocked){words+=`Fruits layer: ${format(tmp.f.effect)}x<br>`}
                if (tmp.s.bars.p.unlocked){words+=`Skill: ${format(getSkillEffect('p'))}x<br>`}
                return words
            }],],
            unlocked(){return tmp.s.bars.p.unlocked},
        },},
    },

})
