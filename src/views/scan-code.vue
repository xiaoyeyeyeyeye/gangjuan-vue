<template>
  <div class="app-container">
    <!-- 标题与说明 -->
    <div class="filter-container">
      <div style="margin:0 0 5px 20px; font-size: 24px;">
        扫码出入库
      </div>
      <aside>
        可以扫码完成入库和出库操作。
      </aside>
    </div>
    <div class="content">
      <!-- 左侧：扫码示意 -->
      <div class="scan-container">
        <video ref="videoRef" class="scan-video" autoplay playsinline />
        <div class="scan-frame" />
      </div>

      <!-- 右侧：固定信息展示区 -->
      <div class="info-panel">
        <el-card class="coil-card">
          <h3>钢卷信息</h3>
          <p v-if="scanResult">
            <strong>ID:</strong> {{ scanResult.id }}
          </p>
          <p v-else>
            <strong>请扫码</strong>
          </p>
          <div v-if="scanResult">
            <p><strong>规格:</strong> {{ scanResult.spec }}</p>
            <p><strong>位置:</strong> {{ scanResult.location }}</p>
          </div>
          <!-- 操作按钮 -->
          <div class="btn-group">
            <el-button
              type="success"
              icon="el-icon-plus"
              @click="handleInbound"
            >入库</el-button>
            <el-button
              type="warning"
              icon="el-icon-minus"
              @click="handleOutbound"
            >出库</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
// import { fetchOverviewList, fetchPv, createArticle, updateArticle } from '@/api/steel-coil'
import { BrowserMultiFormatReader } from '@zxing/browser'
// import axios from 'axios'

export default {
  name: 'ScanPage',
  data() {
    return {
      codeReader: null,
      scanResult: null
    }
  },
  mounted() {
    this.initScanner()
  },
  beforeDestroy() {
    if (this.codeReader) {
      this.codeReader.reset()
    }
  },
  methods: {
    async initScanner() {
      this.codeReader = new BrowserMultiFormatReader()
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices()
        if (devices.length === 0) {
          this.$message.error('没有检测到摄像头设备')
          return
        }
        const selectedDeviceId = devices[0].deviceId
        await this.codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          this.$refs.videoRef,
          (result, err) => {
            if (result) {
              // 扫码成功
              const id = result.getText()
              this.fetchCoilInfo(id)
              this.$message.success(`扫码成功: ${id}`)
            }
            if (err) {
              console.error('扫码错误: ', err)
            }
          }
        )
      } catch (e) {
        this.$message.error('无法启动扫码，请检查权限')
        console.error(e)
      }
    },

    // 模拟调用后端接口获取钢卷信息
    async fetchCoilInfo(id) {
      try {
        // 替换成后端接口
        // const { data } = await axios.get(`/api/coils/${id}`);
        // this.scanResult = data;

        // mock 数据
        this.scanResult = {
          id,
          spec: 'Q235B / 3.0mm',
          location: '仓位 B1-05'
        }
      } catch (e) {
        this.$message.error('获取钢卷信息失败')
      }
    },

    async handleInbound() {
      if (!this.scanResult) return this.$message.warning('请先扫码')
      try {
        // 调用后端接口（入库）
        // await axios.post("/api/inbound", { coilId: this.scanResult.id });
        this.$message.success(`钢卷 ${this.scanResult.id} 入库成功`)
      } catch (e) {
        this.$message.error('入库失败')
      }
    },

    async handleOutbound() {
      if (!this.scanResult) return this.$message.warning('请先扫码')
      try {
        // 调用后端接口（出库）
        // await axios.post("/api/outbound", { coilId: this.scanResult.id });
        this.$message.success(`钢卷 ${this.scanResult.id} 出库成功`)
      } catch (e) {
        this.$message.error('出库失败')
      }
    }
  }
}
</script>

<style scoped>
.content {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.scan-container {
  position: relative;
  flex: 1;
  max-width: 480px;
  aspect-ratio: 1 / 1;
  border: 2px dashed #409eff;
  border-radius: 12px;
  overflow: hidden;
}

.scan-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scan-frame {
  position: absolute;
  inset: 0;
  border: 3px solid #67c23a;
  border-radius: 12px;
  pointer-events: none;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

.info-panel {
  flex: 1;
}

.coil-card {
  padding: 10px;
}

.btn-group {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}
</style>
