import { AgoraFetchParams } from "@/sdk/education/interfaces/index.d";
import { HttpClient } from "@/sdk/education/core/utils/http-client";

export class EduModularApi {

  private sdkDomain!: string
  private appId!: string
  private restToken!: string
  private token!: string

  constructor() {
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
        'token': `${this.token ? this.token : ""}`,
        'Authorization': `Basic ${this.restToken}`
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

  async checkIn(params: {
    roomUuid: string,
    roomName: string,
    roomType: number
  }) {
    const res = await this.fetch({
      url: `/v2/rooms/${params.roomUuid}`,
      method: 'PUT',
      data: {
        roomName: params.roomName,
        roomType: params.roomType
      }
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
    userUuid: string,
    data: {
      message: string,
      type: number
    }
  }) {
    const res = await this.fetch({
      url: `/v2/rooms/${params.roomUuid}/from/${params.userUuid}/chat`,
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
      method: 'PUT',
      data: {
        muteChat: params.muteChat
      }
    })
    return res
  }

  async handsUp(params: {
    roomUuid: string,
    toUserUuid: string,
    payload: any
  }) {
    const res = await this.fetch({
      url: `/v2/rooms/${params.roomUuid}/handup/${params.toUserUuid}`,
      method: 'POST',
      data: {
        payload: JSON.stringify({
          cmd: 1,
          data: params.payload
        })
      }
    })
    return res
  }
}

export const eduModularApi = new EduModularApi()