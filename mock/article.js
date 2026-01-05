// const Mock = require('mockjs')

// const List = []
// const count = 100

// const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
// const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

// for (let i = 0; i < count; i++) {
//   List.push(Mock.mock({
//     id: '@increment', //表格序号，这个按照表格生成
//     entry_at: '@datetime("yyyy-MM-dd HH:mm:ss")', //入库时间
//     out_at: '@pick(["2025-05-19 13:54", "2024.08.23", "2025.04.07", "", "", "", "", "", "", "", ""])', //出库时间
//     coil_no: '@pick(["H150451000700", "50521202500", "X24824205800", "X25405801200"])', // 钢卷编号（二维码内容）/成品号/钢卷号
//     coil_name: '@pick(["普碳钢热轧板带", "热轧分卷", "热轧直发卷", ""])', // 钢卷名称

//     coil_grade: '@pick(["Q235B", "RX"])', // 钢卷牌号
//     product_standard: '@pick(["GB/T 3274-2017", "QJ/GF1.029-2011", "GB/T 700-2006"])', // 产品标准
//     heat_no: '@pick(["25B603914", "P25203581", "X24106436", "X25202401"])', // 熔炼号
//     coil_class: '@pick(["合格", ""])', // 产品等级
//     weight_t: '@pick(["24.31t（实）", ""])', // 钢卷重量（吨）
//     weight_kg: '@pick(["17400", "28260Kg", "28440Kg", ""])', // 钢卷重量（千克）
//     sheet: '@pick([""])', // 张数
//     length: '@pick(["960000", "254241", ""])', // 长度
//     contract_no: '@pick(["M5SB457702", "M4SB685302", "M5SB337307", ""])', // 合同号
//     destination: '@pick(["王家营西", ""])', // 到站
//     date_production: '@pick(["2025-05-19 13:54", "2024.08.23", "2025.04.07", ""])', // 生产日期
//     // coil_no_manufacturers: '@pick(["", ""])', // 钢卷生产厂家编号
//     consumer: '@pick(["建发（广州）有限公司", "厦门建发金属有限公司",  ""])', // 最终用户
//     updated_at: '@datetime("yyyy-MM-dd HH:mm:ss")', // 更新时间
//     remark: '@pick(["测试用", "测试用", "测试用", "测试用", ""])', // 备注信息

//     manufacture_id: '@pick(["柳钢", "攀钢", "首钢", "马钢", "沙钢"])', // 厂家id，后期换成按照id查询名称
//     coil_size: '@pick(["3.85 X 1500", "4.5 X 1000", "2.5*1500*C", "9.5*1500*C"])', // 钢卷规格
//     location_id: '@pick(["第1列第1层横向第5个", "第4列第2层横向第10个", "第3列第2层横向第6个"])', // 当前所在仓库位置ID，后期换成按照id查询名称
//     location_xyz: '@pick(["（23，53，56）", "（64，57，13）", "（5，66，38）"])', // 当前所在仓库位置ID，后期换成按照id查询名称
//     status: '@pick(["在库", "已出库", "废弃"])', // 当前状态

//     operator: '@pick(["员工1", "员工2", "设备自动更新", "设备自动更新", "设备自动更新", "设备自动更新"])',

//     //操作基本信息的，暂时放在这里
//     operator_id: '@pick(["员工1", "员工2", "员工3", "员工4", "员工5", "员工6"])', //操作人
//     action_type: '@pick(["入库", "出库", "修改信息", "处理冲突"])', //操作类型
//     action_time: '@datetime("yyyy-MM-dd HH:mm:ss")', // 操作时间
//     details: '@pick(["手动H150451000700出库", "手动50521202500入库", "处理冲突50521202500状态，修改为已出库", "修改信息X24824205800，厂家柳钢变为攀钢"])', // 详细描述
    
//     //告警基本信息的，暂时放在这里
//     alarm_id: '@pick(["20250607281983", "2025062443581980", "202512454281982", "2025024534988", "2025124341981", "2025032231986"])', //告警id
//     message: '@pick(["检测显示已经出库，但钢卷状态未出库", "检测显示未出库，但钢卷状态已出库", "检测显示无钢卷，但钢卷状态已入库", "检测显示有钢卷，但系统无多余钢卷入库",])', //告警描述
//     alarm_type: '@pick(["钢卷状态冲突"])', // 告警类型
//     created_at: '@datetime("yyyy-MM-dd HH:mm:ss")', // 出发时间
//     manual_result: '@pick(["未处理", "忽略", "已解决"])', // 处理情况
  
//   }))
// }

// module.exports = [
//   {
//     url: '/vue-element-admin/article/list',
//     type: 'get',
//     response: config => {
//       const { importance, type, title, page = 1, limit = 20, sort } = config.query

//       let mockList = List.filter(item => {
//         if (importance && item.importance !== +importance) return false
//         if (type && item.type !== type) return false
//         if (title && item.title.indexOf(title) < 0) return false
//         return true
//       })

//       if (sort === '-id') {
//         mockList = mockList.reverse()
//       }

//       const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

//       return {
//         code: 20000,
//         data: {
//           total: mockList.length,
//           items: pageList
//         }
//       }
//     }
//   },

//   {
//     url: '/vue-element-admin/article/detail',
//     type: 'get',
//     response: config => {
//       const { id } = config.query
//       for (const article of List) {
//         if (article.id === +id) {
//           return {
//             code: 20000,
//             data: article
//           }
//         }
//       }
//     }
//   },

//   {
//     url: '/vue-element-admin/article/pv',
//     type: 'get',
//     response: _ => {
//       return {
//         code: 20000,
//         data: {
//           pvData: [
//             { key: 'PC', pv: 1024 },
//             { key: 'mobile', pv: 1024 },
//             { key: 'ios', pv: 1024 },
//             { key: 'android', pv: 1024 }
//           ]
//         }
//       }
//     }
//   },

//   {
//     url: '/vue-element-admin/article/create',
//     type: 'post',
//     response: _ => {
//       return {
//         code: 20000,
//         data: 'success'
//       }
//     }
//   },

//   {
//     url: '/vue-element-admin/article/update',
//     type: 'post',
//     response: _ => {
//       return {
//         code: 20000,
//         data: 'success'
//       }
//     }
//   }
// ]

