import React, { useEffect, Fragment, useRef } from 'react'
import * as G2 from '@antv/g2'

const data = [
  { feature: "Battery", value: 0.22, phone: "iPhone" },
  { feature: "Brand", value: 0.28, phone: "iPhone" },
  { feature: "Contract", value: 0.29, phone: "iPhone" },
  { feature: "Design", value: 0.17, phone: "iPhone" },
  { feature: "Internet", value: 0.22, phone: "iPhone" },
  { feature: "Large", value: 0.02, phone: "iPhone" },
  { feature: "Price", value: 0.21, phone: "iPhone" },
  { feature: "Smartphone", value: 0.5, phone: "iPhone" },
  { feature: "Battery", value: 0.27, phone: "Samsung" },
  { feature: "Brand", value: 0.16, phone: "Samsung" },
  { feature: "Contract", value: 0.35, phone: "Samsung" },
  { feature: "Design", value: 0.13, phone: "Samsung" },
  { feature: "Internet", value: 0.2, phone: "Samsung" },
  { feature: "Large", value: 0.13, phone: "Samsung" },
  { feature: "Price", value: 0.35, phone: "Samsung" },
  { feature: "Smartphone", value: 0.38, phone: "Samsung" },
  { feature: "Battery", value: 0.26, phone: "Nokia Smartphone" },
  { feature: "Brand", value: 0.1, phone: "Nokia Smartphone" },
  { feature: "Contract", value: 0.3, phone: "Nokia Smartphone" },
  { feature: "Design", value: 0.14, phone: "Nokia Smartphone" },
  { feature: "Internet", value: 0.22, phone: "Nokia Smartphone" },
  { feature: "Large", value: 0.04, phone: "Nokia Smartphone" },
  { feature: "Price", value: 0.41, phone: "Nokia Smartphone" },
  { feature: "Smartphone", value: 0.3, phone: "Nokia Smartphone" }
];


export default () => {
    const mountNodeRef = useRef()

    useEffect(() => {
        // Step 1: 创建 Chart 对象
        const chart = new G2.Chart({
          container: mountNodeRef.current, // 指定图表容器 ID or Node
          autoFit:true,
          // width: 600, // 指定图表宽度
          // height: 300, // 指定图表高度

        });

        // Step 2: 载入数据源
        chart.data(data);

        // Step 3：创建图形语法，绘制柱状图
        chart
          .area()
          .position("feature*value")
          .color("phone");
        // chart.coordinate("polar")

        // Step 4: 渲染图表
        chart.render();
    }, [])

    return (
        <Fragment>
            <div ref={mountNodeRef} style={{width:600, height:600}}/>
        </Fragment>
    )
}
