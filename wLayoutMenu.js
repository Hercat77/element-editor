import E from 'wangeditor'

const { $, BtnMenu } = E

// 设置默认样式
const initPStyle = 'text-indent: 2em; font-size: 20px !important; line-height: 1.5; font-family: 仿宋'
export default class wLayoutMenu extends BtnMenu {
  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = $('<div class="w-e-menu" style="width: 80px;font-weight: bold;color: #999" data-title="一键排版">一键排版</div>')
    super($elem, editor)
  }

  clickHandler() {
    // 获取富文本编辑区的DOM
    const childDomArr = this.editor.$textElem.elems[0].childNodes
    if (childDomArr.length > 0) {
      childDomArr.forEach((item) => {
        // 富文本编辑的内容默认外层都是由p标签包容，所以直接在p标签上进行设置默认排版的样式
        if (item.nodeName === 'P') {
          item.style.cssText = initPStyle
        }
        if (item.childNodes.length > 0) {
          // 遍历找到子元素中存在img标签的内容进行设置默认样式
          item.childNodes.forEach((child) => {
            if (child.localName === 'img') {
              // 获取原图width、height
              const width = child.width
              const height = child.height
              const ratio = width / height
              const setW = 600
              let setH = 0 // 等比计算
              if (setW / setH !== ratio) {
                setH = setW / ratio
              }
              // 给img标签设置行内样式
              child.setAttribute('width', setW)
              child.setAttribute('height', setH)
              child.style.cssText = 'text-align: center'
            }
          })
        }
      })
    }
  }

  // 菜单是否被激活（如果不需要，这个函数可以空着）
  tryChangeActive() {}
}
