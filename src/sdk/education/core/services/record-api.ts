import { ApiBaseInitializerParams } from './../../../../services/base';
import { ApiBase } from "@/services/base";
import { AgoraFetchParams } from "../../interfaces";
import { HttpClient } from "../utils/http-client";

export class AgoraRecordApi extends ApiBase {
  constructor(
    params: {
      prefix: string
    } & ApiBaseInitializerParams
  ) {
    super(params)
    this.prefix = params.prefix
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