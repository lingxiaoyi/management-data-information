<template>
  <div
    ref="myChart"
    class="my-chart"
    :style="{ height: height && height + 'px' }"
    :class="{ empty: dataSource[0] && dataSource[0].length === 0 }"
  />
</template>

<script>
export default {
  props: {
    dataSource: {
      type: Array,
      default: function() {
        return []
      }
    },
    height: {
      type: Number,
      default: function() {
        return 360
      }
    },
    unit: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      myChart: null
    }
  },
  watch: {
    dataSource: function() {
      this.myChart === null ? this.initChart() : this.mySetOptions()
    }
  },
  created() {
    this.dataSource && this.dataSource.length > 0 && this.initChart()
  },
  methods: {
    resize() {
      this.myChart.resize()
    },
    initChart() {
      this.$nextTick(() => {
        const myChart = this.$refs.myChart
        this.myChart = this.$echarts.init(myChart)
        this.mySetOptions()
        window.addEventListener('resize', this.resize)
      })
    },
    mySetOptions() {
      // this.myChart.clear(); // 调用该方法每次更新数据都会有动画
      const options = {
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            var _html = params[0] ? `${params[0].axisValue}<br />` : ''
            params.map(item => {
              _html += `<span style="display: inline-block;width: 10px;height: 10px;border-radius: 100%;background-color: ${item.color};"></span> ${item.seriesName}: ${item.data}${this.unit}<br />`
            })
            return _html
          }
        },
        legend: {
          data: ['今日', '昨日', '上周'],
          bottom: 15
        },
        grid: {
          top: 50,
          left: 25,
          right: 50,
          bottom: 50,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dataSource[0],
          axisLabel: {
            color: '#999'
          },
          axisLine: {
            lineStyle: {
              color: '#dedede'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: this.unit,
          axisLine: {
            "show": false,
            lineStyle: {
              color: '#999'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#dedede'
            }
          },
          axisLabel: {
            color: '#999'
          }
        },
        series: [
          {
            name: '今日',
            type: 'line',
            data: this.dataSource[1],
            smooth: true,
            itemStyle: {
              normal: {
                color: '#217EF1'
              }
            }
          },
          {
            name: '昨日',
            type: 'line',
            data: this.dataSource[2],
            smooth: true,
            itemStyle: {
              normal: {
                color: '#f00'
              }
            }
          },
          {
            name: '上周',
            type: 'line',
            data: this.dataSource[3],
            smooth: true,
            itemStyle: {
              normal: {
                color: '#c0c0c0'
              }
            }
          }
        ]
      }
      this.myChart.setOption(options)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .tooltip {
  display: inline-block;
  margin-right: 5px;
  border-radius: 10px;
  width: 10px;
  height: 10px;
  background-color: #409eff;
}
.my-chart {
  border: 1px solid #ebeef5;
}

/* 图表没有数据时的样式 */
.my-chart.empty::before {
  content: '暂无数据';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  background-color: #fff;
}
</style>
