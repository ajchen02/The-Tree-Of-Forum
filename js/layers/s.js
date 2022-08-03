/*function getEXPfactor(){return layers.exp.bars.exp.effect()}
function getEXPeff(id){return layers.exp.bars[id].effect()}
function getSkillLevel(id){return layers.exp.bars[id].level()}
function giveEXP(id,input = n(0)){player.exp[id]=player.exp[id].add(layers.exp.bars[id].gain(false,input))}
*/
function getSkillExp(id){return player.s.exps[id]}
function getSkillLevel(id){return tmp.s.bars[id].level}
function setSkillExp(id,input=d0){player.s.exps[id]=n(input)}
addLayer("s", {
    name: "skills", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points:d0,
        exps:{p:d0}
    }},
    color: "white",
    tooltip:"Skills",
    resource: "skill", // Name of prestige currency
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player[this.layer].unlocked},
    bars:{
        p: {
            direction: RIGHT,
            width: 400,
            height: 50,
            display(){return '这个条看起来<br>怎么样？'},
            unlocked(){return true},
            progress() { return tmp.s.bars[this.id].level.sub(tmp.s.bars[this.id].level.floor()) },
            textStyle:{
                 'background': layers.p.color,
                 'border-radius':'5px',
                 'color': 'black',
             },
            fillStyle: {"background-color":layers.p.color},
            //exp(){player.s.exps[this.layer]=player.s.exps[this.layer].add(0.1)},
            level(){return player.s.exps[this.id].div(10).root(2)},
            effect(){return tmp.s.bars[this.id].level.floor().pow(1.1)},
        },
    },
    tabFormat: [
        //"main-display",
        ['bar','p'],
        //"clickables",
    ],
    
})
