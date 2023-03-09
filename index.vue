<template>
  <div style="position: relative" :style="pareStyle">
    <div ref="editor"></div>
    <div v-if="dataUploading" class="tips-progress">
      <el-progress style="width: 60%" :text-inside="true" :stroke-width="18" :percentage="uploadProgress" :color="customColors" status="success"></el-progress>
    </div>
  </div>
</template>

<script>
import WangEditor from 'wangeditor'
import config from './config'
import wLayoutMenu from './wLayoutMenu'
import emitter from 'element-ui/src/mixins/emitter'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'JrEditor',
  mixins: [emitter],
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 200
    },
    // M
    uploadImgMaxSize: {
      type: Number,
      default: 5
    },
    // M
    uploadVideoMaxSize: {
      type: Number,
      default: 500
    },
    placeholder: {
      type: String,
      default: '请输入内容...'
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      editorE: '', // 编辑器的对象
      dataUploading: false,
      uploadProgress: 0,
      pareStyle: {},
      focused: false,
      customColors: [
        {
          color: '#f56c6c',
          percentage: 20
        },
        {
          color: '#e6a23c',
          percentage: 40
        },
        {
          color: '#5cb87a',
          percentage: 60
        },
        {
          color: '#1989fa',
          percentage: 80
        },
        {
          color: '#6f7ad3',
          percentage: 100
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['productId']),
    needConfig() {
      return { ...config.defaultConfig, ...this.config }
    }
  },
  watch: {
    value(val) {
      // 普通的watch监听
      if (val !== this.editorE.txt.html()) {
        this.editorE.txt.html(val)
      }
    }
  },
  mounted() {
    const that = this
    // 初始化编辑框
    that.init()
    window.addEventListener('resize', () => {
      that.editorE.destroy()
      that.editorE = null
      that.pareStyle = {}
      that.init()
    })
  },
  beforeDestroy() {
    // 销毁编辑器
    this.editorE.destroy()
    this.editorE = null
  },
  methods: {
    init() {
      const that = this
      /* 实例化 */
      that.editorE = new WangEditor(that.$refs.editor)
      // 设置富文本的高度
      that.editorE.config.height = that.height
      // 取消自动 focus
      that.editorE.config.focus = false
      // 注册菜单
      that.editorE.menus.extend('shortcutLayout', wLayoutMenu)
      // 配置菜单
      that.editorE.config.menus = that.needConfig.menus
      // 配置字体
      that.editorE.config.fontNames = that.needConfig.fontNames
      // 默认提示
      that.editorE.config.placeholder = that.placeholder
      // 配置全屏功能 默认全屏
      that.editorE.config.showFullScreen = true
      //  配置行高
      that.editorE.config.lineHeights = that.needConfig.lineHeights
      // 设置菜单栏提示为上标还是下标
      that.editorE.config.menuTooltipPosition = 'down'
      // 配置element ui message提示
      that.editorE.config.customAlert = (s, t) => {
        switch (t) {
          case 'success':
            that.$message.success(s)
            break
          case 'info':
            that.$message.info(s)
            break
          case 'warning':
            that.$message.warning(s)
            break
          case 'error':
            that.$message.error(s)
            break
          default:
            that.$message.info(s)
            break
        }
      }

      // 图片上传
      // 隐藏插入网络图片功能
      that.editorE.config.showLinkImg = false
      // 默认限制图片大小是 5M
      that.editorE.config.uploadImgMaxSize = that.uploadImgMaxSize * 1024 * 1024
      // 限制图片类型
      that.editorE.config.uploadImgAccept = that.needConfig.uploadImgAccept
      // 限制一次最多能传几张图片
      that.editorE.config.uploadImgMaxLength = 1
      that.editorE.config.customUploadImg = function (resultFiles, insertImgFn) {
        that.uploadProgress = 0
        that.dataUploading = true
        const file = resultFiles[0]
        const formData = new FormData()
        formData.append('file', file)
        axios
          .post(process.env.VUE_APP_BASE_API + '/message/api/uEditor/saveFile', formData, {
            headers: {
              InternetToken: getToken(),
              productId: that.productId
            },
            onUploadProgress: (progressEvent) => {
              // 图片上传进度
              const percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0
              that.uploadProgress = percent
            }
          })
          .then((res) => {
            const { data } = res
            // 不管上没上传成功都关闭进度条
            that.dataUploading = false
            if (data.code === 200) {
              insertImgFn(process.env.VUE_APP_BASE_API + data.data)
            } else {
              that.$message.error('图片上传失败')
            }
          })
      }

      // 视频上传
      // 隐藏插入网络视频功能
      that.editorE.config.showLinkVideo = false
      // 限制视频大小
      that.editorE.config.uploadVideoMaxSize = that.uploadVideoMaxSize * 1024 * 1024
      // 限制视频类型
      that.editorE.config.uploadVideoAccept = that.needConfig.uploadVideoAccept
      // 自定义视频上传，由于视频一般较大，需要显示进度，就不用编辑器定义的上传了
      that.editorE.config.customUploadVideo = function (resultFiles, insertVideoFn) {
        that.uploadProgress = 0
        that.dataUploading = true
        const file = resultFiles[0]
        const formData = new FormData()
        formData.append('file', file)
        axios
          .post(process.env.VUE_APP_BASE_API + '/message/api/uEditor/saveFile', formData, {
            headers: {
              InternetToken: getToken(),
              productId: that.productId
            },
            onUploadProgress: (progressEvent) => {
              // 视频上传进度
              const percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0
              that.uploadProgress = percent
            }
          })
          .then((res) => {
            const { data } = res
            // 不管上没上传成功都关闭进度条
            that.dataUploading = false
            if (data.code === 200) {
              insertVideoFn(process.env.VUE_APP_BASE_API + data.data)
            } else {
              that.$message.error('视频上传失败')
            }
          })
      }

      // 粘贴处理
      // 关闭粘贴样式的过滤
      that.editorE.config.pasteFilterStyle = false
      // 自定义处理粘贴的文本内容
      that.editorE.config.pasteTextHandle = function (pasteStr) {
        // 对粘贴的文本进行处理，然后返回处理后的结果
        const htmlDom = document.createElement('div')
        htmlDom.innerHTML = pasteStr
        const imgDomArr = htmlDom.querySelectorAll('img[src]')
        imgDomArr.forEach((img) => {
          img.style.maxWidth = '100%'
        })
        const result = htmlDom.innerHTML
        htmlDom.remove()
        return result
      }
      // 创建编辑器
      that.editorE.create()
      that.$nextTick(() => {
        const offsetHeight = that.$refs.editor.offsetHeight
        const offsetWidth = that.$refs.editor.offsetWidth
        that.pareStyle = {
          height: `${offsetHeight}px`,
          width: `${offsetWidth}px`
        }
        that.editorE.txt.html(this.value)
      })
      // 监控变化，同步更新到文本 向上传递更新
      that.editorE.config.onchange = function (html) {
        that.$emit('input', html)
      }
      // 失去焦点处理
      that.editorE.config.onblur = function (newHtml) {
        // 用于el-form表单验证，具体参考el-input
        if (that.focused) {
          that.focused = false
          that.dispatch('ElFormItem', 'el.form.blur', [newHtml])
        }
      }
      // 聚焦处理
      that.editorE.config.onfocus = function () {
        that.focused = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tips-progress {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  line-height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .w-e-toolbar {
  border-color: #d4d4d4 !important;
}

::v-deep .w-e-text-container {
  border-color: #d4d4d4 !important;
}
</style>
