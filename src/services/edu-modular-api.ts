import { AgoraFetchParams } from "@/sdk/education/interfaces/index.d";
import { EduRoomType } from "@/sdk/education/core/services/interface.d";
import { HttpClient } from "@/sdk/education/core/utils/http-client";
import { BizLogger } from "@/utils/biz-logger";

export class EduModularApi {

  private sdkDomain!: string
  private appId!: string
  private restToken!: string
  private token!: string

  constructor() {
    // this.token = params.token
    // this.restToken = params.restToken
    // this.appId = params.appId
    // this.sdkDomain = params.sdkDomain
  }

  updateConfig(params: {
    restToken: string
    sdkDomain: string
    appId: string
    token: string
  }) {
    this.token = params.token
    this.restToken = params.restToken
    this.appId = params.appId
    this.sdkDomain = params.sdkDomain
  }

  get prefix(): string {
    return `${this.sdkDomain}/edu/apps/%app_id`.replace("%app_id", this.appId)
  }

  async fetch (params: AgoraFetchParams) {
    const {
      method,
      token,
      data,
      full_url,
      url,
      type
    } = params
    const opts: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.restToken!.replace(/basic\s+|basic/i, '')}`
      }
    }
    
    if (data) {
      opts.body = JSON.stringify(data);
    }

    if (token) {
      opts.headers['token'] = token
    }
  
    let resp: any;
    if (full_url) {
      resp = await HttpClient(`${full_url}`, opts);
    } else {
      resp = await HttpClient(`${this.prefix}${url}`, opts);
      // switch (type) {
      //   default: {
      //     fetchResponse = await fetch(`${this.prefix}${url}`, opts);
      //     break;
      //   }
      // }
    }
      
    // WARN: 需要约定状态码
    if (resp.code !== 0) {
      throw {msg: resp.msg}
    }

    return resp.data
  }

  async getConfig() {
    const res = await this.fetch({
      url: `/v2/configs`,
      method: 'GET',
    })
    return res
  }

  async checkIn(roomUuid: string) {
    const res = await this.fetch({
      url: `/v2/rooms/${roomUuid}`,
      method: 'PUT'
    })

    return res
  }

  async updateClassState(params: {
    roomUuid: string,
    state: number
  }) {
    const res = await this.fetch({
      url: `/v2/rooms/${params.roomUuid}/states/${params.state}`,
      method: 'PUT'
    })
    return res
  }

  async updateRecordingState(params: {
    roomUuid: string,
    state: number
  }) {
    const res = await this.fetch({
      url: `/v2/rooms/${params.roomUuid}/records/states/${params.state}`,
      method: 'PUT'
    })
    return res
  }

  async sendChat(params: {
    roomUuid: string,
    data: {
      message: string,
      type: number
    }
  }) {
    const res = await this.fetch({
      url: `/v2/rooms/${params.roomUuid}/chat`,
      method: 'POST',
      data: params.data
    })
    return res
  }

  async muteChat(params: {
    roomUuid: string,
    muteChat: number
  }) {
    const res = await this.fetch({
      url: `/v2/rooms/${params.roomUuid}/mute`,
      method: 'POST',
      data: params.muteChat
    })
    return res
  }

  async handsUp(params: {
    roomUuid: string,
    toUserUuid: string,
    payload: any
  }) {
    const res = await this.fetch({
      url: `/v2/rooms/${params.roomUuid}/handup${params.toUserUuid}`,
      method: 'POST',
      data: {
        payload: params.payload
      }
    })
    return res
  }
}

export const eduModularApi = new EduModularApi()