import { AgoraFetchParams } from "../../interfaces";
import { HttpClient } from "../utils/http-client";

export class AgoraRecordApi {

  private userToken: string;
  private restToken: string;
  private record_prefix: string

  constructor(
    params: {
      prefix: string
      restToken: string
      userToken: string
    }
  ) {
    this.record_prefix = params.prefix
    this.restToken = params.restToken
    this.userToken = params.userToken
  }

  async fetch (params: AgoraFetchParams) {
    const {
      method,
      data,
      full_url,
      url,
    } = params
    const opts: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.restToken!.replace(/basic\s+|basic/i, '')}`
      }
    }

    if (this.userToken) {
      opts.headers['token'] = this.userToken;
    }
    
    if (data) {
      opts.body = JSON.stringify(data);
    }
  
    let resp: any;
    if (full_url) {
      resp = await HttpClient(`${full_url}`, opts);
    } else {
      resp = await HttpClient(`${this.record_prefix}${url}`, opts);
    }
  
    // WARN: 需要约定状态码
    if (resp.code !== 0) {
      throw {msg: resp.msg}
    }

    return resp
  }

  async queryRoomRecordBy(roomUuid: string) {
    let nextId = 0
    let buffer: any[] = []
    do {
      const url = nextId > 0 ? `/v1/rooms/${roomUuid}/records?nextId=${nextId}` : `/v1/rooms/${roomUuid}/records`
      let {data} = await this.fetch({
        url,
        method: 'GET',
      })
      nextId = data.nextId
      buffer = (buffer as any).concat(data.list)
    } while (nextId)

    return {
      list: buffer
    }
  }

  async startRecording(roomUuid: string) {
    let res = await this.fetch({
      url: `/v1/rooms/${roomUuid}/records/start`,
      method: 'POST',
      data: {
        "recordingConfig": {
          "maxIdleTime": 900
        },
        // "storageConfig": {
        //     "accessKey": "",
        //     "region": "",
        //     "bucket": "",
        //     "secretKey": "",
        //     "vendor": ""
        // }
      }
    })
    return {
      recordId: res.data.recordId
    }
  }

  async stopRecording(roomUuid: string, recordId: string) {
    let res = await this.fetch({
      url: `/v1/rooms/${roomUuid}/records/${recordId}/stop`,
      method: 'POST',
    })
    return res.data
  }
}