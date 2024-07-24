<template>
    <div id="map-container">
      <div id="map" ref="mapRef"></div>
    </div>
</template>
  
<script setup lang='ts'>
import * as echarts from 'echarts'
import 'echarts-gl'
import { cloneDeep, uniq } from 'lodash-es'
import { ref, onMounted } from 'vue'
import { getMapSeries } from './utils/utils'
import locationImg from './assets/location-active.png'
import bgImg from './assets/bg.png'
import bgSelectedImg from './assets/bg-selected.png'
import mapMeta from "./map/meta.json"
import mapMetaReverse from "./map/meta_r.json"
import mapMetaFull from "./map/meta_full.json"

const rootMapCode = '810000'
const mapRef = ref()
const mapChart = ref()
const currentMapCode = ref(rootMapCode)
const mapSeries = ref([])

const defaultMapRegionOptions = ref({
  name: '香港特别行政区',
  itemStyle: {
    opacity: 0,
    label: { show: false }
  },
  label: {
    show: false
  }
})

const mapRegions = ref([cloneDeep(defaultMapRegionOptions.value)])
const lastVisitSection = ref()

const projectList = ref([
  {
    name: 'BJZ 启德新急症医院',
    value: [114.218878,22.320799],
  },
  {
    name: 'BLA 西铁锦上路站第一期物业发展项目',
    value: [114.067621, 22.431619],
  },
  {
    name: 'BLM 马鞍山86B区恒泰路第二期项目',
    value: [114.228735, 22.410761],
  },
  {
    name: 'BLX 马鞍山86B区恒泰路第二期项目',
    value: [114.227735, 22.410761],
  },
])

const registerMaps = async () => {
    echarts.registerMap(`m${rootMapCode}`, await import(`./map/${rootMapCode}.json`))
    // for await (let code of Object.keys(mapMeta)) {
    //     echarts.registerMap(`m${code}`, await import(`./map/${code}.json`))
    // }
}

const generateMapOption = () => {
  const image = document.createElement("img");
  image.src = bgImg
  const imageSelecte = document.createElement("img");
  imageSelecte.src = bgImg

    return {
      geo3D: {
        map: `m${currentMapCode.value}`,
        viewControl: {
            // autoRotate: true,
            distance: 150,
            center: [-2, -5, 0]
         },
         itemStyle: {
            color: '#539efe',
            borderWidth: 1,
            borderColor: '#4fdcf7'
         },
         label: {
            show: true,
            fontSize: 16,
            color: '#f9fcff',
            fontWeight: 600
         },
         emphasis: {
            label: {
               show: true,
               fontSize: 16,
               color: '#f9fcff',
               fontWeight: 600
            },
            itemStyle: {
               color: '#539efe',
               borderWidth: 1,
               borderColor: '#4fdcf7'
            }
         }
        // show: true,
        // viewControl: {
        //   autoRotate: true,
        //   autoRotateAfterStill: 3,
        //   distance: 120,
        //   minAlpha: 5, // 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
        //   maxBeta: 360, // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]
        //   animation: true, // 是否开启动画。[ default: true ]
        //   animationDurationUpdate: 1000, // 过渡动画的时长。[ default: 1000 ]
        //   animationEasingUpdate: "cubicInOut" // 过渡动画的缓动效果。[ default: cubicInOut ]
        // },
        // itemStyle: {
        //   color: {
        //     image: image,
        //     repeat: 'repeat'
        //   },
        //   borderColor: 'rgba(226, 230, 245, 1)',
        //   borderWidth: 2,
        // },
        // emphasis: {
        //   itemStyle: {
        //     color: {
        //       image: bgSelectedImg,
        //       repeat: 'repeat'
        //     },
        //     areaColor: '#E6F0FF',
        //     borderColor: '#A5B0E5',
        //     borderWidth: 1,
        //     shadowColor: 'rgba(9, 41, 121, 0.5)',
        //     shadowOffsetY: 5,
        //   },
        // },
        // shading: "lambert",
        // light: {
        //   //光照阴影
        //   main: {
        //     // color: "#fff", //光照颜色
        //     intensity: 1, //光照强度
        //     //shadowQuality: 'high', //阴影亮度
        //     shadow: true, //是否显示阴影
        //     shadowQuality: "medium", //阴影质量 ultra //阴影亮度
        //     alpha: 55,
        //     beta: 10
        //   },
        //   ambient: {
        //     intensity: 0.7
        //   }
        // }
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: `image://${locationImg}`,
          symbolSize: 30,
          legendHoverLink: true,
          distance: 1,
          labelLine: {
            show: true,
            length: 30,
            lineStyle: {
              type: 'dashed',
              color: '#1E5EFF',
              dashOffset: 5,
              opacity: 0.6
            }
          },
          label: {
            formatter(value: any) {
              return `{name|${value.data.name}}{ant|}`;
            },
            rich: {
              name: {
                fontSize: 16,
              }
            },
            show: true,
            offset: [0, -60], //偏移设置
            lineHeight: 23,
            borderWidth: 1,
            backgroundColor: '#ffffff',
            shadowColor: 'rgba(18,14,43,0.2)',
            padding: [6, 10],
            shadowBlur: 10,
            color: '#646696',
            borderRadius: 6,
          },
          data: projectList.value,
          zlevel: 5,
        }
      ]
    }
  }

const init = () => {
  mapChart.value = echarts.init(mapRef.value, null, {renderer: 'svg'})
  mapChart.value.setOption(generateMapOption())
}

onMounted(async () => {
    await registerMaps()
    init()
})

</script>
  
<style scoped lang="scss">
  #map-container {
    position: relative;
    background-color: #f1f3f9;
    #map {
      width: 100%;
      height: 100%;
      // background-image: url(./assets/bg.png);
    }
  }
</style>