<template>
    <div id="map-container">
      <div id="map" ref="mapRef"></div>
    </div>
</template>
  
<script setup lang='ts'>
import * as echarts from 'echarts'
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
        geo: [
          {
            show: true,
            map: `m${currentMapCode.value}`,
            roam: false,
            zoom: 1.2,
            animationDurationUpdate: 0,
            scaleLimit: {
                min: 0.5,
                max: 5,
            },
            layoutSize: '95%',
            layoutCenter: ['50%', '50%'],
            label: {
              show: true
            },
            itemStyle: {
              color: {
                image: image,
                repeat: 'repeat'
              },
              borderColor: 'rgba(226, 230, 245, 1)',
              borderWidth: 2,
            },
            emphasis: {
              itemStyle: {
                color: {
                  image: bgSelectedImg,
                  repeat: 'repeat'
                },
                // areaColor: '#E6F0FF',
                borderColor: '#A5B0E5',
                borderWidth: 1,
                shadowColor: 'rgba(9, 41, 121, 0.5)',
                shadowOffsetY: 5,
              },
            },
            z: 10,
            // regions: mapRegions.value
          },
          {
            type: "map",
            map: `m${currentMapCode.value}`,
            zlevel: -1,
            roam: false,
            animationDurationUpdate: 0,
            zoom: 1.2,
            layoutSize: '95%',
            layoutCenter: ['50%', '50%'],
            // aspectScale: 1.2,
            scaleLimit: {
                min: 0.5,
                max: 5,
            },
            itemStyle: {
              areaColor: '#ffffff',
              borderColor: 'rgba(226, 230, 245, 1)',
              borderWidth: 2,
              shadowColor: 'rgba(0, 32, 160, 0.2)',
              shadowOffsetY: 0,
            },
            emphasis: {
                itemStyle: {
                  // color: {
                  //   image: bgSelectedImg,
                  //   repeat: 'repeat'
                  // },
                  areaColor: '#E6F0FF',
                  borderColor: '#A5B0E5',
                  borderWidth: 1,
                  shadowColor: 'rgba(9, 41, 121, 0.5)',
                  shadowOffsetY: 5,
                },
              },
            // regions: mapRegions.value
          },
          {
            type: "map",
            map: `m${currentMapCode.value}`,
            zlevel: -2,
            roam: false,
            animationDurationUpdate: 0,
            zoom: 1.2,
            layoutSize: '95%',
            layoutCenter: ['50%', '50%'],
            // aspectScale: 1.2,
            scaleLimit: {
                min: 0.5,
                max: 5,
            },
            itemStyle: {
              shadowColor: 'rgba(9, 41, 121, 0.2)',
              shadowOffsetY: 8,
              shadowBlur: 8
            },
            emphasis: {
              itemStyle: {
                areaColor: '#E6F0FF',
                borderColor: '#A5B0E5',
                borderWidth: 1,
                shadowColor: 'rgba(9, 41, 121, 0.5)',
                shadowOffsetY: 5,
              },
            },
          }
        ],
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
              formatter(value) {
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
              borderRadius: 6
            },
            data: projectList.value,
            zlevel: 5,
          }
        ]
    }
}

const getMapByCode = (code) => {
    return echarts.getMap(`m${code}`)
}

// const handleMapSectionClick = (params) => {
//   let code = mapMetaReverse[params.name]
//   let series = []
//   if (!code || code === 710000) {
//     code = '100000'
//   }
//   if (code === 800000) {
//     series = projectList.value
//   }
//   currentMapCode.value = code
//   mapChart.value.setOption(generateMapOption(), true)
// }

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