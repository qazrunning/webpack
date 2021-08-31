/**
 * @param _this 当前this
 */
import axios from 'axios';
// var part0 = [
//     {
//         key: 'top01',
//         componentName: 'topStatistics',
//         fatherDomNode:'topPart',
//         path:'PartTop'
//     }
// ]
// var part1 = [{
//         key: 'left01',
//         componentName: 'checkTypeTotal',
//         fatherDomNode:'leftPart',
//         path:'Part1'
//     },
//     {
//         key: 'left02',
//         componentName: 'emptyCirclePie',
//         fatherDomNode:'leftPart',
//         path:'Part1'
//     },
//     {
//         key: 'left03',
//         componentName: 'part1test1',
//         fatherDomNode:'leftPart',
//         path:'Part1'
//     }
// ]
// var part2 = [{
//         key: 'middle01',
//         componentName: 'auditTypeTotal',
//         fatherDomNode:'middlePart',
//         path:'Part2'
//     },
//     {
//         key: 'middle02',
//         componentName: 'dottedBar',
//         fatherDomNode:'middlePart',
//         path:'Part2'
//     },
//     {
//         key: 'middle03',
//         componentName: 'part2test1',
//         fatherDomNode:'middlePart',
//         path:'Part2'
//     }
// ]
// var part3 = [
//     {
//         key: 'right01',
//         componentName: 'alarmTopFive',
//         fatherDomNode:'rightPart',
//         path:'Part3'
//     },
//     {
//         key: 'right02',
//         componentName: 'fuelTypeTopFive',
//         fatherDomNode:'rightPart',
//         path:'Part3'
//     },
//     {
//         key: 'right03',
//         componentName: 'part3test1',
//         fatherDomNode:'rightPart',
//         path:'Part3'
//     }
// ]
// const allRoleArr=[...part0,...part1,...part2,...part3]


export async function getPermissionsList(_this) {
    let partTop=[],partList1=[],partList2=[],partList3=[]
    await _this.$curl.get("api/hj/getHomeConfig").then(async resInfo=>{
        const {part0,part1,part2,part3}=resInfo.homeConfigs
        const allRoleArr=[...part0,...part1,...part2,...part3]
        let res= await _this.$curl.post("api/hj/hasAuthoritys",{types:allRoleArr})
        res.hasAuthoritys.forEach(item=>{
            if(item.path=='PartTop'){
                partTop.push(item)
            }else if(item.path=='Part1'){
                partList1.push(item)
            }else if(item.path=='Part2'){
                partList2.push(item)
            }else if(item.path=='Part3'){
                partList3.push(item)
            }
        })
    })
    return {partTop,partList1,partList2,partList3}
}