import { AgoraEduEvent } from "@/modular";
import { AppStoreConfigParams } from "../app";
import { PlayerStore } from "./player";
import { ReplayUIStore } from "./ui";

export type ReplayConfigParam = {
  videoUrl: string
  logoUrl: string
  whiteboardUrl: string
  whiteboardId: string
  whiteboardToken: string
  startTime: number
  endTime: number
}

export type ReplayAppStoreInitParams = {
  config: AppStoreConfigParams
  replayConfig: ReplayConfigParam
  listener: (evt: AgoraEduEvent) => void
}

export class ReplayAppStore {

  playerStore!: PlayerStore;
  uiStore!: ReplayUIStore;

  params!: ReplayAppStoreInitParams

  constructor(params: ReplayAppStoreInitParams) {
    const {config, replayConfig} = params
    this.params = params

    this.uiStore = new ReplayUIStore()
    this.playerStore = new PlayerStore(this)
  }

  release() {
    this.uiStore.reset()
  }

  async destroyInternal() {
    await this.playerStore.destroy()
  }

  async destroy() {
    try {
      await this.destroyInternal()
      this.release()
    } catch (err) {
      this.release()
    }
  }
}