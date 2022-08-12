function getSkillExp(id){return [player.s.exps[id],tmp.s.bars[id].getNextAt]}
function getSkillLevel(id){return [tmp.s.bars[id].level.floor(),tmp.s.bars[id].level]}
function getSkillEffect(id){return tmp.s.bars[id].effect}
function setSkillExp(id,input=d0){player.s.exps[id]=n(input)}
function addSkillExp(id,input=d0){player.s.exps[id]=player.s.exps[id].add(input)}
addLayer("s", {
    name: "skills", 
    symbol: "S", 
    position: 0, 
    startData() { return {
        unlocked: false,
		points:d0,
        exps:{p:d0,a:d0}
    }},
    color: "white",
    tooltip:"Skills",
    resource: "skill",
    baseAmount() {return player.points},
    type: "none", 
    row: "side",
    layerShown(){return player[this.layer].unlocked},

    update(diff){
        if (tmp[this.layer].bars.p.unlocked){addSkillExp('p',tmp.p.resetGain.mul(diff).mul(tmp.p.passiveGeneration))}
    },

    bars:{
        p: {
            direction: RIGHT,
            width: 450,
            height: 50,
            display(){return `Prestige: level ${getSkillLevel(this.id)[0]}, boosting prestige points by ${format(getSkillEffect(this.id))}x.<br>
                            exp:${format(getSkillExp(this.id)[0],getSkillExp(this.id)[0].gte(1e9)?2:0)}/${format(getSkillExp(this.id)[1],getSkillExp(this.id)[1].gte(1e9)?2:0)}, gain by prestige`},
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
            getNextAt(){return n(2).pow(getSkillLevel(this.id)[0].add(1)).mul(10)},
            effect(){return n(1.1).pow(getSkillLevel(this.id)[0]).max(1)},
        },
        a: {
            direction: RIGHT,
            width: 450,
            height: 50,
            display(){return `Allodoxaphobia: level ${getSkillLevel(this.id)[0]}, Adding allodoxaphobia by +${format(getSkillEffect(this.id),0)}.<br>
                            exp:${format(getSkillExp(this.id)[0],getSkillExp(this.id)[0].gte(1e9)?2:0)}/${format(getSkillExp(this.id)[1],getSkillExp(this.id)[1].gte(1e9)?2:0)}, but they can only buy upgrades`},
            unlocked(){return false},
            progress() { return getSkillLevel(this.id)[1].sub(getSkillLevel(this.id)[0]) },
            textStyle:{
                 'background': layers.a.color,
                 'border-radius':'5px',
                 'color': 'black',
             },
            fillStyle: {"background-color":layers.a.color},
            level(){return getSkillExp(this.id)[0].max(1).log(1.5).max(0)},
            getNextAt(){return n(1.5).pow(getSkillLevel(this.id)[0].add(1))},
            effect(){return getSkillLevel(this.id)[0]},
        },
    },
    tabFormat: [
        ["display-text",'this layer normally dosen\'t reset.',],

        ['bar','p'],
        ['bar','a'],
    ],
    
})
