<template>
  <div class="dashboard-container">
    <adminDashboard />
    <div ref="container" style="width: 100%; height: 70vh;" />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      coilMeshes: [],
      selectedCoil: null
    }
  },
  mounted() {
    this.initThreeScene()
  },
  methods: {
    initThreeScene() {
      const container = this.$refs.container
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf0f0f0)

      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(120, 150, 250) // ✅ 向上抬高并稍微拉远

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.maxPolarAngle = Math.PI / 2.2
      controls.minDistance = 100
      controls.maxDistance = 400
      controls.enablePan = false

      // 光照
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
      directionalLight.position.set(100, 100, 100)
      scene.add(directionalLight)

      // 地板
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshStandardMaterial({ color: 0xdddddd })
      )
      floor.rotation.x = -Math.PI / 2
      scene.add(floor)

      // 添加钢卷
      const coils = this.generateMockCoils()
      this.coilMeshes = this.addSteelCoils(coils, scene)

      // 点击监听器
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(this.coilMeshes)

        if (intersects.length > 0) {
          const selected = intersects[0].object

          // 恢复上一个颜色
          if (this.selectedCoil && this.selectedCoil !== selected) {
            this.selectedCoil.material.color.set(0x607d8b)
          }

          // 选中新颜色
          selected.material.color.set(0xff0000)
          this.selectedCoil = selected

          // 显示信息
          alert(`钢卷 ID: ${selected.userData.id}`)
        } else {
          // 点击空白处，取消选中
          if (this.selectedCoil) {
            this.selectedCoil.material.color.set(0x607d8b)
            this.selectedCoil = null
          }
        }
      })

      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }

      animate()
    },

    generateMockCoils() {
      const data = []
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 10; row++) {
          for (let layer = 0; layer < 3; layer++) {
            data.push({
              id: `${col}-${row}-${layer}`,
              x: col * 30,
              y: layer * 25,
              z: row * 30
            })
          }
        }
      }
      return data
    },

    addSteelCoils(data, scene) {
      const geometry = new THREE.CylinderGeometry(10, 10, 20, 32)
      const meshes = []

      for (const coil of data) {
        const material = new THREE.MeshStandardMaterial({ color: 0x607d8b })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(coil.x, coil.y + 10, coil.z)
        mesh.rotation.x = Math.PI / 2
        mesh.userData.id = coil.id
        scene.add(mesh)
        meshes.push(mesh)
      }

      return meshes
    }
  }
}
</script>
