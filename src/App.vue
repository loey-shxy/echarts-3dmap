<template>
    <div id="map-container">
      <div id="map" ref="mapRef"></div>
    </div>
</template>
  
<script setup lang='ts'>
import * as echarts from 'echarts'
import { cloneDeep, uniq } from 'lodash-es'
import { ref, onMounted } from 'vue'
import mapMeta from "./map/meta.json"
import mapMetaReverse from "./map/meta_r.json"
import mapMetaFull from "./map/meta_full.json"
import metaCoord from "./map/meta_coord.json"
import { getMapSeries } from './utils/utils'

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

const registerMaps = async () => {
    echarts.registerMap(`m${rootMapCode}`, await import(`./map/${rootMapCode}.json`))
    // for await (let code of Object.keys(mapMeta)) {
    //     echarts.registerMap(`m${code}`, await import(`./map/${code}.json`))
    // }
}
import bgImg from './assets/bg.png'
const generateMapOption = () => {
  var image = document.createElement("img");
   image.src = bgImg

    return {
        geo: [
          {
            show: true,
            map: `m${currentMapCode.value}`,
            roam: false,
            zoom: 1.2,
            aspectScale: 1.2,
            scaleLimit: {
                min: 0.1,
                max: 12,
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
                  image: image,
                  repeat: 'repeat'
                },
                areaColor: '#E6F0FF',
                borderColor: '#A5B0E5',
                borderWidth: 1,
                shadowColor: 'rgba(9, 41, 121, 0.5)',
                shadowOffsetY: 5,
              },
            },
            z: 10,
            regions: mapRegions.value
          },
          {
            type: "map",
            map: `m${currentMapCode.value}`,
            zlevel: -1,
            roam: false,
            zoom: 1.2,
            aspectScale: 1.2,
            scaleLimit: {
                min: 0.1,
                max: 12,
            },
            itemStyle: {
              areaColor: '#ffffff',
              borderColor: 'rgba(226, 230, 245, 1)',
              borderWidth: 2,
              shadowColor: 'rgba(0, 32, 160, 0.2)',
              shadowOffsetY: 0,
            },
          },
          {
              type: "map",
              map: `m${currentMapCode.value}`,
              zlevel: -2,
              roam: false,
              zoom: 1.2,
              aspectScale: 1.2,
              scaleLimit: {
                  min: 0.1,
                  max: 12,
              },
              itemStyle: {
                shadowColor: 'rgba(9, 41, 121, 0.2)',
                shadowOffsetY: 8,
                shadowBlur: 8
              },
          }
        ],
        series: mapSeries.value,
    }
}

const getMapByCode = (code) => {
    return echarts.getMap(`m${code}`)
}

const convertGeoCoordData = (data) => {
    let res = [];
    for (var i = 0; i < data.length; i++) {
        let dataItem = data[i];
        let from = metaCoord[dataItem[0].code]
        let to = metaCoord[dataItem[1].code]
        if (!from || !to) {
            continue
        }
        res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            numValue: dataItem[1].value,
            coords: [from, to],
        });
    }
    return res;
}

const setSelectedArea = (data) => {
    let regions = [];
    regions.push(cloneDeep(defaultMapRegionOptions.value));

    let codes = []
    data.forEach((item) => {
        codes.push(item[0].code)
        codes.push(item[1].code)
    });
    for (let code of uniq(codes)) {
        let name = mapMetaFull[code]
        if (!name) {
            continue
        }
        regions.push({
            name: name,
            itemStyle: {
                areaColor: '#E6F0FF',
                label: {show: true}
            },
            label: {
                show: true
            }
        })
    }
    mapRegions.value = regions
}


const handleMapSectionClick = (params) => {
    const code = mapMetaReverse[params.name]
    if (!code) return
    currentMapCode.value = code
    mapChart.value.setOption(generateMapOption(), true)
    // fetchMapSeries(code)
}

const handleMapSectionHover = (params) => {
    if(params.name !== lastVisitSection.value) {
        lastVisitSection.value = params.name
        // const code = mapMetaReverse[params.name]
    }
}

const init = () => {
    mapChart.value = echarts.init(mapRef.value, null, {renderer: 'svg'})
    mapChart.value.setOption(generateMapOption())
    // mapChart.value.on("click", () => {})
    mapChart.value.on("mouseover", handleMapSectionHover)
    mapChart.value.on("mouseout", () => {
        lastVisitSection.value = null
    })

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