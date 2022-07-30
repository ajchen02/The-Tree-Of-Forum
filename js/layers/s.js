/*function getEXPfactor(){return layers.exp.bars.exp.effect()}
function getSkillExp(id){return tmp.s[id]}
//function getEXPeff(id){return layers.exp.bars[id].effect()}
function getSkillLevel(id){return layers.exp.bars[id].level()}
function giveEXP(id,input = n(0)){player.exp[id]=player.exp[id].add(layers.exp.bars[id].gain(false,input))}
*/
addLayer("s", {
    name: "skills", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points:d0,
        p:d0
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
            display(){return 'QwQe308 now i officially hate u.'},
            unlocked(){return true},
            progress() { return 0 },
            exp(){return tmp[this.layer][this.id]},
            //level(){return tmp[this.layer][this.id].level},
            effect(){return n(1)},
        },
    },
    tabFormat: [
        //"main-display",
        ['bar','p'],
        //"clickables",
    ],
    
})
