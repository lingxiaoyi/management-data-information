let HOST = '//middle.zhihuizhangyu.com';
if (process.env.NODE_ENV === 'development') {
  //HOST = '//testmiddle.zhihuizhangyu.com';
}
const URL = {
  login2: `${HOST}/api/privilege/login2`, //登陆 get
  login: `${HOST}/api/privilege/login`, //登陆 get
  logout: `${HOST}/api/privilege/logout`, //登陆 get
  report: `${HOST}/api/report`, //报表
  reportEveryday: `${HOST}/api/report/everyday`, //时间段+每天明细报表接口
  agentdetails: `${HOST}/api/report/agent-details`, //
  report_params: `${HOST}/api/common/params`, //选项
  account: `${HOST}/api/common/account`, //根据代理商查询账号信息
  field: `${HOST}/api/field`, //获取自定义列字段
  campaign: {
    dy: `${HOST}/api/dy/campaign`, //抖音广告组接口
    dyAd: `${HOST}/api/dy/ad`, //抖音广告计划接口
    dyCreative: `${HOST}/api/dy/creative`, //抖音广告创意接口
    ks: `${HOST}/api/ks/ad`, //快手广告计划接口
    ksAd: `${HOST}/api/ks/campaign`, //快手广告组接口
    ksCreative: `${HOST}/api/ks/creative`, //快手广告创意接口
    gdt: `${HOST}/api/gdt/ad`, //广点通广告计划接口
    gdtAd: `${HOST}/api/gdt/campaign`, //广点通广告组接口
    gdtCreative: `${HOST}/api/gdt/creative` //广点通广告创意接口
  },
  oauthAccount: {
    query: `${HOST}/api/oauth-account/query`, //查询账户授权管理列表
    params: `${HOST}/api/common/params`, //查询账户授权管理列表
    updateAccount: `${HOST}/api/oauth-account/update-account`, //修改授权账号信息
    addAgent: `${HOST}/api/oauth-account/add-agent`, //添加代理商
    addAccount: `${HOST}/api/oauth-account/add-account` //添加授权账号
  },
  material: {
    video: `${HOST}/api/material/video`, //素材库--视频列表
    videoPreview: `${HOST}/api/material/video-preview`, //素材库--获取视频预览地址
    videoCreative: `${HOST}/api/material/video-creative`, //素材库--视频关联创意
    image: `${HOST}/api/material/image`, //素材库--视频关联创意
    imageCreative: `${HOST}/api/material/image-creative`, //素材库--视频关联创意
    channel: `${HOST}/api/qd/report`, //渠道数据--渠道报表接口
    planReport: `${HOST}/api/qd/plan-report`, //渠道数据--渠道下关联的广告计划报表
    creativeDetailSelect: `${HOST}/api/material/params`, // 素材库--关联创意--选项列表
    qdParams: `${HOST}/api/qd/qd-params`, // 渠道数据--渠道下拉选项接口
    pixelParams: `${HOST}/api/material/material-params`, // 素材库--素材像素选项下拉列表
    inner: `${HOST}/api/inner-material/list`, // 内部素材列表
    innerAdd: `${HOST}/api/inner-material/add`, // 添加单条素材
    innerDownload: `${HOST}/api/inner-material/template-download`, // 下载添加模板
    innerUpload: `${HOST}/api/inner-material/template-upload`, // 批量上传素材
    innerUsername: `${HOST}/api/inner-material/username` // 获取制作人列表
  },
  export: {
    adversDetails: `${HOST}/export/report/advers-details` //广告主汇总数据详细报表导出
  },
  upload: {
    uploadReportChannel: `${HOST}/api/upload-report/channel`, //所有渠道列表
    uploadFile: `${HOST}/api/upload-report/upload`, //批量上传报表
    uploadReportAgent: `${HOST}/api/upload-report/agent`, //所有代理商列表
    uploadReport: `${HOST}/api/upload-report`, //报表数据列表
    uploadReportSave: `${HOST}/api/upload-report/save`, //上传数据
    uploadReportEdit: `${HOST}/api/upload-report/edit` //修改数据
  },
  realTime: {
    realTimeData: `${HOST}/api/report/real-time`, // 实时数据
    chartData: `${HOST}/api/report/chart` // 图表数据
  },
  agentManage: {
    agentData: `${HOST}/api/agent`, // 代理商列表
    createAgent: `${HOST}/api/agent/add`, // 新增代理商信息
    updateAgent: `${HOST}/api/agent/edit`, // 修改代理商信息
    logs: `${HOST}/api/agent/logs` // 操作日志列表
  },
  rebateSetting: {
    tableData: `${HOST}/api/test`
  },
  manage: {
    //权限管理
    productList: `${HOST}/api/privilege/product-list`, //产品
    editProduct: `${HOST}/api/privilege/edit-product`,
    addProduct: `${HOST}/api/privilege/add-product`,
    userList: `${HOST}/api/privilege/user-list`, //用户
    addUser: `${HOST}/api/privilege/add-user`,
    editUser: `${HOST}/api/privilege/edit-user`,
    delUser: `${HOST}/api/privilege/del-user`,
    roleList: `${HOST}/api/privilege/role-list`, //角色
    addRole: `${HOST}/api/privilege/add-role`,
    editRole: `${HOST}/api/privilege/edit-role`,
    delRole: `${HOST}/api/privilege/del-role`,
    grantRole: `${HOST}/api/privilege/grant` //角色授权
  }
};
export default URL;
