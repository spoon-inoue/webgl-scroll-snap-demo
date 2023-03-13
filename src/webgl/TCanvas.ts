import * as THREE from 'three'
import VirtualScroll from 'virtual-scroll'
import { resolvePath } from '../scripts/utils'
import { gl } from './core/WebGL'
import { Assets, loadAssets } from './utils/assetLoader'
import { stats } from './utils/Stats'

export class TCanvas {
  private assets: Assets = {
    image1: { path: resolvePath('resources/unsplash_1.jpg'), encoding: true },
    image2: { path: resolvePath('resources/unsplash_2.jpg'), encoding: true },
    image3: { path: resolvePath('resources/unsplash_3.jpg'), encoding: true },
    image4: { path: resolvePath('resources/unsplash_4.jpg'), encoding: true },
    image5: { path: resolvePath('resources/unsplash_5.jpg'), encoding: true },
    image6: { path: resolvePath('resources/unsplash_6.jpg'), encoding: true },
    image7: { path: resolvePath('resources/unsplash_7.jpg'), encoding: true },
    image8: { path: resolvePath('resources/unsplash_8.jpg'), encoding: true },
    image9: { path: resolvePath('resources/unsplash_9.jpg'), encoding: true },
    image10: { path: resolvePath('resources/unsplash_10.jpg'), encoding: true },
  }

  private globalGroup = new THREE.Group()

  constructor(private parentNode: ParentNode) {
    loadAssets(this.assets).then(() => {
      this.init()
      this.createObjects()
      this.addEvents()
      gl.requestAnimationFrame(this.anime)
    })
  }

  private init() {
    gl.setup(this.parentNode.querySelector('.three-container')!)
    gl.scene.background = new THREE.Color('#023')
    gl.camera.position.z = 5

    gl.scene.add(new THREE.AxesHelper())

    stats.append(this.parentNode.querySelector('.three-container')!)
  }

  private addEvents() {
    const scroller = new VirtualScroll()
    scroller.on((event) => {
      this.globalGroup.children[0].userData.rotationTarget += event.deltaY * 0.002
    })
  }

  private createObjects() {
    const textures = Object.keys(this.assets).map((key) => this.assets[key].data as THREE.Texture)

    const group = new THREE.Group()
    textures.forEach((texture, i, arr) => {
      const material = new THREE.SpriteMaterial({ map: texture })
      const mesh = new THREE.Sprite(material)

      const x = 2.5 * Math.sin(Math.PI * 2 * (i / arr.length))
      const z = 2.5 * Math.cos(Math.PI * 2 * (i / arr.length))
      mesh.position.set(x, 0, z)

      group.add(mesh)
    })
    group.userData.rotationTarget = 0

    this.globalGroup.add(group)
    this.globalGroup.rotation.z = Math.PI / 10
    gl.scene.add(this.globalGroup)
  }

  // ----------------------------------
  // animation
  private prevRotY = 0

  private anime = () => {
    // controls.update()
    const planes = this.globalGroup.children[0]
    planes.rotation.y = THREE.MathUtils.lerp(planes.rotation.y, planes.userData.rotationTarget, 0.05)

    const speed = Math.abs(planes.rotation.y) - this.prevRotY
    this.prevRotY = Math.abs(planes.rotation.y)

    if (Math.abs(speed) < 0.02) {
      const offset = (Math.PI * 2) / planes.children.length / 2
      let snapPoint = (planes.rotation.y + offset) / (Math.PI * 2)
      snapPoint = Math.floor(snapPoint * 10) / 10
      snapPoint *= Math.PI * 2
      planes.userData.rotationTarget = THREE.MathUtils.lerp(planes.userData.rotationTarget, snapPoint, 0.1)
    }

    stats.update()
    gl.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
  }
}
