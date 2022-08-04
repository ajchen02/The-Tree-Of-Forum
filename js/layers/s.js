/*function getEXPfactor(){return layers.exp.bars.exp.effect()}
function getEXPeff(id){return layers.exp.bars[id].effect()}
function getSkillLevel(id){return layers.exp.bars[id].level()}
function giveEXP(id,input = n(0)){player.exp[id]=player.exp[id].add(layers.exp.bars[id].gain(false,input))}
*/
function getSkillExp(id){return [player.s.exps[id],tmp.s.bars[id].getNextAt]}
function getSkillLevel(id){return [tmp.s.bars[id].level.floor(),tmp.s.bars[id].level]}
function getSkillEffect(id){return tmp.s.bars[id].effect}
function setSkillExp(id,input=d0){player.s.exps[id]=n(input)}
function addSkillExp(id,input=d0){player.s.exps[id]=player.s.exps[id].add(input)}
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
/*    update(diff){
        if (player[this.layer].bars.p.unlocked){addSkillExp('p',input=d0)}
    },*/
    bars:{
        p: {
            direction: RIGHT,
            width: 450,
            height: 50,
            display(){return `Prestige: level ${getSkillLevel(this.id)[0]}, boosting prestige points by ${format(getSkillEffect(this.id))}x.<br>
                            exp:${format(getSkillExp(this.id)[0],0)}/${format(getSkillExp(this.id)[1],0)}, gain by prestige`},
            unlocked(){return player[this.layer].unlocked},
            progress() { return getSkillLevel(this.id)[1].sub(getSkillLevel(this.id)[0]) },
            textStyle:{
                 'background': layers.p.color,
                 'border-radius':'5px',
                 'color': 'black',
             },
            fillStyle: {"background-color":layers.p.color},
            //addExp(){if (true) pass},
            level(){return getSkillExp(this.id)[0].max(1).div(10).log(2).max(0)},
            getNextAt(){return d2.pow(getSkillLevel(this.id)[0].add(1)).mul(10)},
            effect(){return n(1.1).pow(getSkillLevel(this.id)[0])},
        },
    },
    tabFormat: [
        //"main-display",
        ["display-text",'this layer normally don\'t reset.',],

        ['bar','p'],
        //"clickables",
    ],
    
})
