//快捷调用+提高运算速度
var d0 = new Decimal(0)
var d1 = new Decimal(1)
var d2 = new Decimal(2);        var d20 = new Decimal(20)
var d3 = new Decimal(3);        var d30 = new Decimal(30)
var d4 = new Decimal(4);        var d40 = new Decimal(40)
var d5 = new Decimal(5);        var d50 = new Decimal(50)
var d6 = new Decimal(6);        var d60 = new Decimal(60)
var d7 = new Decimal(7);        var d70 = new Decimal(70)
var d8 = new Decimal(8);        var d80 = new Decimal(80)
var d9 = new Decimal(9);        var d90 = new Decimal(90)
var d10 = new Decimal(10);      var d100 = new Decimal(100)
//快捷定义
function n(num){
    return new Decimal(num)
}
//检测节点是否连接
function inBranch(node,layer){
    return layers[layer].branches.includes(node)
}
/*
//检测旁边的升级是否被购买
function checkAroundUpg(UPGlayer,place){
    place = Number(place)
    return hasUpgrade(UPGlayer,place-1)||hasUpgrade(UPGlayer,place+1)||hasUpgrade(UPGlayer,place-10)||hasUpgrade(UPGlayer,place+10)
}
//对数软上限 *尽量少用,不稳定
function logsoftcap(num,start,power){
    if(num.gt(start)){
        num = ten.tetr(num.slog(10).sub(power)).pow(start.logBase(ten.tetr(start.slog(10).sub(power))))
    }
    return num
}
//指数软上限
function powsoftcap(num,start,power){
	if(num.gt(start)){
		num = num.root(power).mul(start.pow(one.sub(one.div(power))))
	}
    return num
}
//倍增型购买项批量购买(极其精准)
function bulkBuy(item,cost,level,costmult){
    var bulk = OmegaNum.affordGeometricSeries(item,cost,costmult,level);
    return {bulk:bulk,cost:OmegaNum.sumGeometricSeries(bulk,cost,costmult,level)}
}
//同样是批量,显示用
function showBulkBuy(item,cost,level,costmult){
    var bulk = OmegaNum.affordGeometricSeries(item,cost,costmult,level).max(1);
    return {bulk:bulk,cost:OmegaNum.sumGeometricSeries(bulk,cost,costmult,level)}
}
//e后数字开根
function expRoot(num,root){
    return ten.pow(num.log10().root(root))
}
//e后数字乘方
function expPow(num,pow){
    return ten.pow(num.log10().pow(pow))
}
//e后数字指数软上限
function expRootSoftcap(num,start,power){
    if(num.lte(start)) return num;
    num = num.log10();start = start.log10()
    return ten.pow(num.root(power).mul(start.pow(one.sub(one.div(power)))))
}
//修改class属性
function setClass(id,toClass = []){
    var classes = ""
    for(i in toClass) classes += " "+toClass[i]
    if(classes != "") classes = classes.substr(1)
    document.getElementById(id).className = classes
}
//快速创建sub元素
function quickSUB(str){
    return `<sub>${str}</sub>`
}
//快速创建sup元素
function quickSUP(str){
    return `<sup>${str}</sup>`
}
//快速给文字上色
function quickColor(str,color){
    return `<text style='color:${color}'>${str}</text>`
}
*/