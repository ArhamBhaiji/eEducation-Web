import { RenderLiveRoom } from "@/monolithic/live-room"
import { RenderReplayRoom } from "@/monolithic/replay-room"
import { GenericErrorWrapper } from "@/sdk/education/core/utils/generic-error"
import { AppStore } from "@/stores/app"
import { ReplayAppStore } from "@/stores/replay-app"
import { unmountComponentAtNode } from "react-dom"
import { AgoraEduSDKConfigParams, ListenerCallback } from "./declare.d"
import { eduModularApi } from '@/services/edu-modular-api'
import { EduRoleTypeEnum } from "@/sdk/education/interfaces"

export enum AgoraEduEvent {
  ready = 1,
  destroyed = 2
}

export interface AliOSSBucket {
  key: string
  secret: string
  name: string
  folder: string
  cdn: string
}

export interface WhiteboardOSSConfig {
  bucket: AliOSSBucket
}

export interface ApplicationConfigParameters {
  gtmId: string
  agora: {
    appId: string
    whiteboardAppId: string
  }
  appToken: string
  enableLog: boolean
  ossConfig?: WhiteboardOSSConfig
}

const configParams: AgoraEduSDKConfigParams = {
  userName: '',
  userUuid: '',
  roomName: '',
  roomUuid: '',
  roomType: '',
  roleType: '',
  appId: '',
  whiteboardAppId: '',
  token: '',
  restToken: ''
}

export type LaunchOption = {
  token: string
  userUuid: string
  userName: string
  roomUuid: string
  roleType: EduRoleTypeEnum
  roomType: string
  roomName: string
  listener: ListenerCallback
  pretest: boolean
}

export type ReplayOption = {
  videoUrl: string
  logoUrl: string
  whiteboardUrl: string
  whiteboardId: string
  whiteboardToken: string
  startTime: number
  endTime: number
  listener: ListenerCallback
}

export type DelegateType = {
  delegate?: AppStore
}

class ReplayRoom {

  private readonly store!: ReplayAppStore
  private dom!: Element

  constructor(store: ReplayAppStore, dom: Element) {
    this.store = store
    this.dom = dom
  }

  async destroy () {
    await this.store.destroy()
    unmountComponentAtNode(this.dom)
    instances["replay"] = undefined
  }
}

class ClassRoom {

  private readonly store!: AppStore
  private dom!: Element

  constructor(store: AppStore, dom: Element) {
    this.store = store
    this.dom = dom
  }

  async destroy () {
    await this.store.destroy()
    unmountComponentAtNode(this.dom)
    instances["launch"] = undefined
  }
}

const stores: Map<string, AppStore> = new Map()

const locks: Map<string, boolean> = new Map()

const getConfig = async () => {

}

const instances: Record<string, any> = {

}

const roomTypes = [
  {
    path: '/classroom/one-to-one'
  },
  {
    path: '/classroom/small-class'
  },
  {
    path: '/classroom/big-class'
  },
]

const devicePath = '/setting'

export class AgoraEduSDK {

  static get version(): string {
    return '1.0.0'
  }

  static config (params: AgoraEduSDKConfigParams) {
    Object.assign(configParams, params)
    eduModularApi.updateConfig({
      restToken: configParams.restToken,
      sdkDomain: "https://api-solutions-dev.bj2.agoralab.co",
      appId: configParams.appId,
      token: configParams.token
    })
  }

  static _launchTime = 0

  static _replayTime = 0

  static _map: Record<string, DelegateType> = {
    "classroom": {
      delegate: undefined
    },
    "replay": {
      delegate: undefined
    }
  }

  static async launch(dom: Element, option: LaunchOption) {
    if (locks.has("launch") || instances["launch"]) {
      throw new GenericErrorWrapper("already launched")
    }
    try {
      locks.set("launch", true)
      const data = await eduModularApi.getConfig()
      console.log("data >>> ", data)

      let mainPath = roomTypes[option.roomType]?.path || '/classroom/one-to-one'
      let roomPath = mainPath

      if (option.pretest) {
        mainPath = '/setting'
      }

      const store = new AppStore({
        config: {
          agoraAppId: configParams.appId,
          agoraNetlessAppId: data.netless.appId,
          agoraRestFullToken: window.btoa(`${data.customerId}:${data.customerCertificate}`),
          enableLog: true,
          sdkDomain: "https://api-solutions-dev.bj2.agoralab.co",
          oss: {
            region: data.netless.oss.region,
            bucketName: data.netless.oss.bucketName,
            folder: data.netless.oss.folder,
            accessKey: data.netless.oss.accessKey,
            secretKey: data.netless.oss.secretKey,
            endpoint: data.netless.oss.endpoint
          }
        },
        roomInfoParams: {
          roomUuid: option.roomUuid,
          userUuid: option.userUuid,
          roomName: option.roomName,
          userName: option.userName,
          userRole: option.roleType,
          roomType: +option.roomType,
        },
        mainPath: mainPath,
        roomPath: roomPath,
        pretest: option.pretest,
        listener: option.listener,
      })
      //@ts-ignore
      window.globalStore = store
      stores.set("app", store)
      RenderLiveRoom({dom, store}, this._map["classroom"])
      if (store.params.listener) {
        store.params.listener(AgoraEduEvent.ready)
      }
      locks.delete("launch")
      instances["launch"] = new ClassRoom(store, dom)
      return instances["launch"]
    } catch (err) {
      locks.delete("launch")
      throw new GenericErrorWrapper(err)
    }
  }

  static async replay(dom: Element, option: ReplayOption) {
    if (locks.has("replay") || instances["replay"]) {
      throw new GenericErrorWrapper("already replayed")
    }

    const store = new ReplayAppStore({
      config: {
        agoraAppId: configParams.appId,
        agoraNetlessAppId: "646/P8Kb7e_DJZVAQw",
        agoraRestFullToken: "MjdiZjhjMmRkNTNhNGQwZGEwMWQxNmM4MTllOWE5Yzc6YjM2N2NiMjRiOTExNDQyYTg5YjU5YTdmN2Y0YjM1OWM=",
        enableLog: true,
        sdkDomain: "https://api-solutions-dev.bj2.agoralab.co"
      },
      replayConfig: {
        videoUrl: option.videoUrl,
        logoUrl: option.logoUrl,
        whiteboardUrl: option.whiteboardUrl,
        whiteboardId: option.whiteboardId,
        whiteboardToken: option.whiteboardToken,
        startTime: option.startTime,
        endTime: option.endTime
      },
      listener: option.listener,
    })
    RenderReplayRoom({dom, store}, this._map["replay"])
    store.params.listener(AgoraEduEvent.ready)
    instances["replay"] = new ReplayRoom(store, dom)
    return instances["replay"]
  }
}