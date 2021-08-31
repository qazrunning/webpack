<template>
<div>
    <!-- 双怠速 -->
  <div v-if="this.baseInfo.IUTYPE&&this.baseInfo.IUTYPE.indexOf('A')>-1">
    <table border="1" style="border-collapse: collapse;margin: 60px auto 60px;" width="80%">
      <tr>
        <td colspan="14" style=" border-top-style: none; text-align: center; font-weight: bold;">双怠速</td>
      </tr>
      <tr>
        <!-- <td colspan="2" style="text-align: center">检测时间</td> -->
        <td rowspan="2" style="text-align: center;width: 150px;">检测时间</td>
        <td rowspan="2" ></td>
        <td rowspan="2" style="text-align: center;">过量空气系数（λ）</td>
        <td colspan="6" style="text-align: center">低怠速</td>
        <td colspan="6" style="text-align: center">高怠速</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align: center">CO(%)</td>
        <td colspan="3" style="text-align: center">HC/<span>10<sup>-6</sup></span></td>
        <td colspan="3" style="text-align: center">CO(%)</td>
        <td colspan="3" style="text-align: center">HC/<span>10<sup>-6</sup></span></td>
      </tr>
     <!-- 实测值1 -->
      <tr >
        <td style="text-align: center">{{this.wayData[0]&& this.wayData[0].DetectEndTime?this.wayData[0].DetectEndTime:"-"}}</td>
        <td style="width: 185px;text-align: center;">实测值</td>
        <td style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0] && this.wayData[0].EACR?saveNumber(this.wayData[0].EACR, 2):"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0] && this.wayData[0].LICOR?saveNumber(this.wayData[0].LICOR, 2):"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0] && this.wayData[0].LIHCR?saveNumber(this.wayData[0].LIHCR, 2):"-"}}
          </span>
        </td>

        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
           {{this.wayData[0] && this.wayData[0].HICOR?saveNumber(this.wayData[0].HICOR, 2):"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0] && this.wayData[0].HIHCR?saveNumber(this.wayData[0].HIHCR, 2):"-"}}
          </span>
        </td>
      </tr>
      <!-- 实测值2 -->
      <tr style="background-color: #DCDCDC;">
        <td style="text-align: center">{{this.wayData[1]&& this.wayData[1].DetectEndTime?this.wayData[1].DetectEndTime:"-"}}</td>
        <td style="width: 185px;text-align: center;">实测值</td>
        <td  style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].EACR?saveNumber(this.wayData[1].EACR, 2):"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].LICOR?saveNumber(this.wayData[1].LICOR, 2):"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].LIHCR?saveNumber(this.wayData[1].LIHCR, 2):"-"}}
          </span>
        </td>

        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
           {{this.wayData[1]&&this.wayData[1].HICOR?saveNumber(this.wayData[1].HICOR, 2):"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].HIHCR?saveNumber(this.wayData[1].HIHCR, 2):"-"}}
          </span>
        </td>
      </tr>

<!-- 限值 -->
      <tr>
        <td  style="width: 60px;line-height: 120%;text-align: center;"></td>
        <td  style="width: 60px;line-height: 120%;text-align: center;">限值</td>
        <td  style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0] && this.wayData[0].EACL?saveNumber(this.wayData[0].EACL, 2):"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0] && this.wayData[0].LICOL?saveNumber(this.wayData[0].LICOL, 2):"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0] && this.wayData[0].LIHCL?saveNumber(this.wayData[0].LIHCL, 2):"-"}}
          </span>
        </td>

        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
           {{this.wayData[0] && this.wayData[0].HICOL?saveNumber(this.wayData[0].HICOL, 2):"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0] && this.wayData[0].HIHCL?saveNumber(this.wayData[0].HIHCL, 2):"-"}}
          </span>
        </td>
      </tr>
    </table>
  </div>

<!-- 稳态工况 -->
  <div v-if="this.baseInfo.IUTYPE&&this.baseInfo.IUTYPE.indexOf('B')>-1">
    <table border="1" style="border-collapse: collapse;margin: 60px auto 60px;" width="80%">
      <tr>
        <td colspan="16" style=" border-top-style: none; text-align: center; font-weight: bold;">稳态工况法</td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: center">检测时间</td>
        <td colspan="2" style="width: 60px"></td>
        <td colspan="6" style="text-align: center">ASM5025</td>
        <td colspan="6" style="text-align: center">ASM2540</td>
      </tr>
      <tr>
        <td colspan="2" style="width: 60px"></td>
        <td colspan="2" style="width: 60px"></td>
        <td colspan="2" style="text-align: center">HC/<span>10<sup>-6</sup></span></td>
        <td colspan="2" style="text-align: center">CO/%</td>
        <td colspan="2" style="text-align: center">NO/<span>10<sup>-6</sup></span></td>
        <td colspan="2" style="text-align: center">HC/<span>10<sup>-6</sup></span></td>
        <td colspan="2" style="text-align: center">CO/%</td>
        <td colspan="2" style="text-align: center">NO/<span>10<sup>-6</sup></span>
        </td>
      </tr>
     <!-- 实测值1 -->
      <tr>
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;">{{this.wayData[0]&& this.wayData[0].DetectEndTime?this.wayData[0].DetectEndTime:"-"}}</td>
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;">实测值</td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].HCER5025?saveNumber(this.wayData[0].HCER5025, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].COER5025?saveNumber(this.wayData[0].COER5025, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].NOER5025?saveNumber(this.wayData[0].NOER5025, 2):"-"}}
          </span>
        </td>

        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
           {{this.wayData[0]&&this.wayData[0].HCER2540?saveNumber(this.wayData[0].HCER2540, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].COER2540?saveNumber(this.wayData[0].COER2540, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].NOER2540?saveNumber(this.wayData[0].NOER2540, 2):"-"}}
          </span>
        </td>
      </tr>
      <!-- 实测值2 -->
     <tr style="background-color: #DCDCDC;">
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;">{{this.wayData[1]&&this.wayData[1].DetectEndTime?this.wayData[1].DetectEndTime:"-"}}</td>
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;">实测值</td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].HCER5025?saveNumber(this.wayData[1].HCER5025, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].COER5025?saveNumber(this.wayData[1].COER5025, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].NOER5025?saveNumber(this.wayData[1].NOER5025, 2):"-"}}
          </span>
        </td>

        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
           {{this.wayData[1]&&this.wayData[1].HCER2540?saveNumber(this.wayData[1].HCER2540, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].COER2540?saveNumber(this.wayData[1].COER2540, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].NOER2540?saveNumber(this.wayData[1].NOER2540, 2):"-"}}
          </span>
        </td>
      </tr>

<!-- 限值 -->
      <tr>
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;"></td>
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;">限值</td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].HCEL5025?saveNumber(this.wayData[0].HCEL5025, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].COEL5025?saveNumber(this.wayData[0].COEL5025, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].NOEL5025?saveNumber(this.wayData[0].NOEL5025, 2):"-"}}
          </span>
        </td>

        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
           {{this.wayData[0]&&this.wayData[0].HCEL2540?saveNumber(this.wayData[0].HCEL2540, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].COEL2540?saveNumber(this.wayData[0].COEL2540, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].NOEL2540?saveNumber(this.wayData[0].NOEL2540, 2):"-"}}
          </span>
        </td>
      </tr>
    </table>
  </div>

  <!-- 简易瞬态工况 -->
    <div v-if="this.baseInfo.IUTYPE&&this.baseInfo.IUTYPE.indexOf('C')>-1">
    <table border="1" style="border-collapse: collapse;margin: 60px auto 60px;" width="80%">
      <tr>
        <td colspan="16" style=" border-top-style: none; text-align: center; font-weight: bold;">简易瞬态工况法</td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: center">检测时间</td>
        <td colspan="2" style="width: 60px"></td>
        <td colspan="4" style="text-align: center">HC/（g/km）</td>
        <td colspan="4" style="text-align: center">CO/（g/km）</td>
        <td colspan="4" style="text-align: center">NOx/（g/km）</td>
      </tr>
     <!-- 实测值1 -->
      <tr>
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;">{{this.wayData[0]&&this.wayData[0].DetectEndTime?this.wayData[0].DetectEndTime:"-"}}</td>
        <td colspan="2" style="width: 185px;text-align: center;">实测值</td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].HCER?saveNumber(this.wayData[0].HCER, 2):"-"}}
          </span>
        </td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].COER?saveNumber(this.wayData[0].COER, 2):"-"}}
          </span>
        </td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].NOXER?saveNumber(this.wayData[0].NOXER, 2):"-"}}
          </span>
        </td>
      </tr>
      <!-- 实测值2 -->
      <tr style="background-color: #DCDCDC;">
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;">{{this.wayData[1]&&this.wayData[1].DetectEndTime?this.wayData[1].DetectEndTime:"-"}}</td>
        <td colspan="2" style="width: 185px;text-align: center;">实测值</td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].HCER?saveNumber(this.wayData[1].HCER, 2):"-"}}
          </span>
        </td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].COER?saveNumber(this.wayData[1].COER, 2):"-"}}
          </span>
        </td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].NOXER?saveNumber(this.wayData[1].NOXER, 2):"-"}}
          </span>
        </td>
      </tr>

<!-- 限值 -->
      <tr>
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;"></td>
        <td colspan="2" style="width: 60px;line-height: 120%;text-align: center;">限值</td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].HCEL?saveNumber(this.wayData[0].HCEL, 2):"-"}}
          </span>
        </td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].COEL?saveNumber(this.wayData[0].COEL, 2):"-"}}
          </span>
        </td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].NOXEL?saveNumber(this.wayData[0].NOXEL, 2):"-"}}
          </span>
        </td>
      </tr>
    </table>
  </div>

    <!-- 自由加速 -->
    <div v-if="this.baseInfo.IUTYPE&&this.baseInfo.IUTYPE.indexOf('F')>-1">
    <table border="1" style="border-collapse: collapse;margin: 60px auto 60px;" width="80%">
      <tr>
        <td colspan="14" style=" border-top-style: none; text-align: center; font-weight: bold;">自由加速</td>
      </tr>
      <tr>
        <td rowspan="2" style="text-align: center">检测时间</td>
        <td rowspan="2" style="text-align: center">额定转速/<br />(r/min)</td>
        <td rowspan="2" style="text-align: center">实测转速/<br />(r/min)</td>
        <td colspan="6" style="text-align: center">最后三次测量值，<span>m<sup>-1</sup></span></td>
        <td colspan="2" style="text-align: center;border-bottom-style: none;">平均值(<span>m<sup>-1</sup></span>)</td>
        <td colspan="2" style="text-align: center;border-bottom-style: none;">限值(<span>m<sup>-1</sup></span>)</td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: center">1</td>
        <td colspan="2" style="text-align: center">2</td>
        <td colspan="2" style="text-align: center">3</td>
        <td colspan="2" style="text-align: center;border-bottom-style: none;border-top-style: none;"></td>
        <td colspan="2" style="text-align: center;border-bottom-style: none;border-top-style: none;"></td>
      </tr>
      <!-- 实测值1 -->
      <tr>
        <td style="text-align: center">{{this.wayData[0]&& this.wayData[0].DetectEndTime?this.wayData[0].DetectEndTime:"-"}}</td>
        <td style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].EngineRatedSpeed?EngineRatedSpeed:"-"}}
          </span>
        </td>
         <td  style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].ActualRotateSpeed?ActualRotateSpeed:"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].ER1?saveNumber(this.wayData[0].ER1, 2):"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].ER2?saveNumber(this.wayData[0].ER2, 2):"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].ER3?saveNumber(this.wayData[0].ER3, 2):"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].ERA?saveNumber(this.wayData[0].ERA, 2):"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].EL?saveNumber(this.wayData[0].EL, 2):"-"}}
          </span>
        </td>
      </tr>
       <!-- 实测值2 -->
      <tr>
        <td style="text-align: center">{{this.wayData[1]&& this.wayData[1].DetectEndTime?this.wayData[1].DetectEndTime:"-"}}</td>
        <td style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].EngineRatedSpeed?EngineRatedSpeed:"-"}}
          </span>
        </td>
         <td  style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].ActualRotateSpeed?ActualRotateSpeed:"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].ER1?saveNumber(this.wayData[1].ER1, 2):"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].ER2?saveNumber(this.wayData[1].ER2, 2):"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].ER3?saveNumber(this.wayData[1].ER3, 2):"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].ERA?saveNumber(this.wayData[1].ERA, 2):"-"}}
          </span>
        </td>
            <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].EL?saveNumber(this.wayData[1].EL, 2):"-"}}
          </span>
        </td>
      </tr>
    </table>
  </div>


      <!-- 加载减速法 -->
    <div v-if="this.baseInfo.IUTYPE&&this.baseInfo.IUTYPE.indexOf('G')>-1">
    <table border="1" style="border-collapse: collapse;margin: 60px auto 60px;" width="80%">
      <tr>
        <td colspan="14" style=" border-top-style: none; text-align: center; font-weight: bold;">加载减速法</td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: center">检测时间</td>
        <td colspan="6" style="text-align: center">转速</td>
        <td colspan="6" style="text-align: center">最大轮边功率</td>
      </tr>
       <tr>
        <td colspan="2" style="text-align: center"></td>
        <td colspan="3" style="text-align: center">额定转速</td>
        <td colspan="3" style="text-align: center">实测（修正）VelMaxHP</td>
        <td colspan="3" style="text-align: center">实测kW</td>
        <td colspan="3" style="text-align: center">限值kW</td>
      </tr>
      <!-- 实测值1 -->
      <tr>
         <td colspan="2" style="text-align: center">{{this.wayData[0]&& this.wayData[0].DetectEndTime?this.wayData[0].DetectEndTime:"-"}}</td>
         <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].EngineRatedSpeed?EngineRatedSpeed:"-"}}
          </span>
        </td>
            <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].VelMaxHP?VelMaxHP:"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].MWP?saveNumber(this.wayData[0].MWP, 2):"-"}}
          </span>
        </td>
         <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].MWPEL?saveNumber(this.wayData[0].MWPEL, 2):"-"}}
          </span>
          </td>
      </tr>
       <!-- 实测值2 -->
      <tr style="background-color: #DCDCDC;">
         <td colspan="2" style="text-align: center">{{this.wayData[1]&& this.wayData[1].DetectEndTime?this.wayData[1].DetectEndTime:"-"}}</td>
         <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].EngineRatedSpeed?EngineRatedSpeed:"-"}}
          </span>
        </td>
         <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].VelMaxHP?VelMaxHP:"-"}}
          </span>
        </td>
        <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].MWP?saveNumber(this.wayData[1].MWP, 2):"-"}}
          </span>
        </td>
         <td colspan="3" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].MWPEL?saveNumber(this.wayData[1].MWPEL, 2):"-"}}
          </span>
          </td>
      </tr>
      <tr>
          <td colspan="2" style="text-align: center"></td>
        <td colspan="6" style="text-align: center">烟度</td>
        <td colspan="6" style="text-align: center">氮氧化物NOx</td>
      </tr>
      <tr>
        <td colspan="2" ></td>
        <td colspan="2" style="text-align: center"></td>
        <td colspan="2" style="text-align: center">100%点</td>
        <td colspan="2" style="text-align: center;border-bottom: none;">80%点</td>
        <td colspan="2" style="text-align: center;border-bottom: none;"></td>
        <td colspan="5" style="text-align: center;border-bottom: none;">80%点</td>
      </tr>
      <tr></tr>
      <tr>
          <td colspan="2" style="text-align: center">{{this.wayData[0]&& this.wayData[0].DetectEndTime?this.wayData[0].DetectEndTime:"-"}}</td>
        <td colspan="2" style="text-align: center">实测值</td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].ER100?saveNumber(this.wayData[0].ER100, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].ER80?saveNumber(this.wayData[0].ER80, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">实测值</td>
        <td colspan="5" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].NOX80?saveNumber(this.wayData[0].NOX80, 2):"-"}}
          </span>
        </td>
      </tr>
      <tr style="background-color: #DCDCDC;">
          <td colspan="2" style="text-align: center">{{this.wayData[1]&& this.wayData[1].DetectEndTime?this.wayData[1].DetectEndTime:"-"}}</td>
        <td colspan="2" style="text-align: center">实测值</td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].ER100?saveNumber(this.wayData[1].ER100, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].ER80?saveNumber(this.wayData[1].ER80, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">实测值</td>
        <td colspan="5" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].NOX80?saveNumber(this.wayData[1].NOX80, 2):"-"}}
          </span>
        </td>
      </tr>
       <tr>
           <td colspan="2" style="text-align: center"></td>
        <td colspan="2" style="text-align: center">限值</td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].EL?saveNumber(this.wayData[0].EL, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].EL?saveNumber(this.wayData[0].EL, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">限值</td>
        <td colspan="5" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].NOXEL?saveNumber(this.wayData[0].NOXEL, 2):"-"}}
          </span>
        </td>
      </tr>
    </table>
  </div>

    <!-- 林格曼黑度法 -->
    <div v-if="this.baseInfo.IUTYPE&&this.baseInfo.IUTYPE.indexOf('J')>-1">
    <table border="1" style="border-collapse: collapse;margin: 60px auto 60px;" width="80%">
      <tr>
        <td colspan="12" style=" border-top-style: none; text-align: center; font-weight: bold;">林格曼黑度法</td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: center">明显可见烟度</td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].VisibleSmoke?saveNumber(this.wayData[0].VisibleSmoke, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">林格曼黑度（级）</td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[0]&&this.wayData[0].LingmanRank?saveNumber(this.wayData[0].LingmanRank, 2):"-"}}
          </span>
        </td>
      </tr>
      <tr style="background-color: #DCDCDC;">
        <td colspan="2" style="text-align: center">明显可见烟度</td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].VisibleSmoke?saveNumber(this.wayData[1].VisibleSmoke, 2):"-"}}
          </span>
        </td>
        <td colspan="2" style="text-align: center">林格曼黑度（级）</td>
        <td colspan="4" style="text-align: center">
          <span style="text-align: center">
            {{this.wayData[1]&&this.wayData[1].LingmanRank?saveNumber(this.wayData[1].LingmanRank, 2):"-"}}
          </span>
        </td>
      </tr>
    </table>
  </div>
</div>



</template>

<script>
export default {
props: {
    baseInfo: {
      type: Object,
      default: () => { }
    },
    stationList: {
      type: Array,
      default: () => []
    },
    InspectionMethodList: {
      type: Array,
      default: () => []
    },
    //  lastInspectionNum: {
    //    type: String
    // },
  },

    data(){
        return{
        lastInspectionNum:'',
        wayData: [], // 方法数据
         inspectionMethod: "", // 方法
        }
    },
    methods: {
    getinspectionresultdata(val){
        this.lastInspectionNum = val
        this.getData()
    },
    saveNumber(value, num) {
            return Number(value).toFixed(num);
        },
    async getData() {
    // console.log('父组件传过来数据',this.baseInfo);
      let InspectionNum = [];
      let inspectionMethod = "";
      this.inspectionMethod = this.baseInfo.IUTYPE;
      inspectionMethod = this.baseInfo.IUTYPE;
    //   console.log('孙子组件1',this.lastInspectionNum);
      InspectionNum.push(this.lastInspectionNum)
      InspectionNum.push(this.baseInfo.inspectionNum)
    //   console.log('InspectionNum', InspectionNum);

      this.$curl
        .get("api/hj/getInspectionMethodData", {
          params: { InspectionNum, inspectionMethod },
        })
        .then((res) => {
          if (res.state) {
            // console.log(res.result)
            this.wayData = res.result;
            // console.log('初检复检数据', this.wayData);

          }
        });
     },
    },
    watch: {
    }
}
</script>

<style>
  td {
        height: 60px;
  }
</style>