import { LaunchOption, ReplayOption } from './index';
import { config } from "@/sdk/education/core/media-service/electron/types/utils"

interface RoomParameters {
  roomUuid: string
  userUuid: string
  roomName: string
  userName: string
  userRole: string
  roomType: number
}

type ListenerCallback = (evt: AgoraEduEvent) => void

abstract class EduRoom {
  app: AgoraEduApplication

  delegate: AppStore

  constructor()
}

type RoomConfigProps = {
  store: AppStore
}


interface RoomComponentConfigProps {
  store: AppStore
  dom: Element
}

declare type AgoraEduSDKConfigParams = {
  userName: string
  userUuid: string
  roomName: string
  roomUuid: string
  roomType: string
  roleType: string
  appId: string
  whiteboardAppId: string
  token: string
}

declare interface ReplayRoom {
  async destroy()
}

declare interface ClassRoom{
  async destroy()
}

declare class AgoraEduSDK {

  static version: string

  static config (params: AgoraEduSDKConfigParams): void

  static async launch(dom: Element, option: LaunchOption): Promise<ClassRoom>

  static async replay(dom: Element, option: ReplayOption): Promise<ReplayRoom>
}