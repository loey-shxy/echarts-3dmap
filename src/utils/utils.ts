//获取地图的采集数据分布
export function getMapSeries(code: number) {
  //return instance.get("/api/path", {})

  //[ {code: "起点"}, {code: "终点"} ]
  let data = [
      // [{code: "510700", datacenter: "数据中心1"}, {code: "510100", value: 1, datacenter: "数据中心"}],
      // [{code: "511100", datacenter: "数据中心2"}, {code: "510100", value: 1, datacenter: "数据中心"}],
      [{code: "810012", datacenter: ""}, {code: "810013", value: 1, datacenter: ""}],
  ]
  return Promise.resolve(code * 1 === 810000 ? data : [])
}
