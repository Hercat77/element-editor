const defaultConfig = {
  menus: [
    'head', // 标题
    'bold', // 加粗
    'fontSize', // 字号
    'fontName', // 字体
    'italic', // 斜体
    'underline', // 下划线
    'strikeThrough', // 删除线
    'indent', // 缩进
    'lineHeight', // 行高
    'foreColor', // 字体颜色
    'backColor', // 背景色
    'link', // 链接
    'list', // 序列
    // 'todo', // 待办事项
    'justify', // 对齐
    'quote', // 引用
    // 'emoticon', // 表情
    'image', // 图片
    'video', // 视频
    // 'table', // 表格
    // 'code', // 代码
    'splitLine', // 分割线
    'undo', // 撤销
    'redo' // 恢复
  ],
  fontNames: ['黑体', '仿宋', '楷体', '宋体', '微软雅黑', 'Arial'], // 常用字体
  lineHeights: ['1', '1.15', '1.6', '2', '2.5', '3'],
  uploadImgAccept: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'], // 限制图片类型
  uploadVideoAccept: ['mp4'] // 限制视频类型
}
export default {
  defaultConfig
}
