import { AgoraFetchParams } from "../../interfaces";
import { get } from "lodash";
import { BoardInfoResponse } from "./interface";
import { HttpClient } from "../utils/http-client";
import { GenericErrorWrapper } from "../utils/generic-error";

export class AgoraBoardApi {

  private board_prefix: string

  private userToken: string
  private roomUuid: string
  private restToken: string

  constructor(
    params: {
      prefix: string
      restToken: string
      userToken: string
      roomUuid: string
    }
  ) {
    this.board_prefix = params.prefix
    this.restToken = params.restToken
    this.userToken = params.userToken
    this.roomUuid = params.roomUuid
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

    if (this.userToken) {
      opts.headers['token'] = this.userToken;
    }
    
    if (data) {
      opts.body = JSON.stringify(data);
    }

    const resp = await HttpClient(`${this.board_prefix}${url}`, opts);
  
    // WARN: 需要约定状态码
    if (resp.code !== 0) {
      throw {msg: resp.msg}
    }

    return resp
  }

  async getBoardInfo(roomUuid: string): Promise<BoardInfoResponse> {
    let boardRoom = await this.getBoardRoomInfo(roomUuid)
    return {
      info: {
        boardId: get(boardRoom, 'info.boardId'),
        boardToken: get(boardRoom, 'info.boardToken'),
      },
      state: {
        follow: get(boardRoom, 'state.follow'),
        grantUsers: get(boardRoom, 'state.grantUsers', [])
      }
    }
  }

  async getCurrentBoardInfo() {
    let info = await this.getBoardInfo(this.roomUuid);
    return info;
  }
  
  async getBoardRoomInfo(roomUuid: string): Promise<any> {
    try {
      let res = await this.fetch({
        type: 'board',
        url: `/v1/rooms/${roomUuid}`,
        method: 'GET',
      })
      return res.data
    } catch (err) {
      throw new GenericErrorWrapper(err)
    }
  }

  async updateBoardUserState(roomUuid: string, userUuid: string, grantPermission: number) {
    let res = await this.fetch({
      type: 'board',
      url: `/v1/rooms/${roomUuid}/users/${userUuid}`,
      method: 'PUT',
      data: {
        grantPermission
      }
    })
    return res
  }

  async updateBoardRoomState(roomUuid: string, follow: number) {
    let res = await this.fetch({
      type: 'board',
      url: `/v1/rooms/${roomUuid}/state`,
      method: 'PUT',
      data: {
        follow
      }
    })
    return res
  }

  async updateCurrentBoardUserState(userUuid: string, grantPermission: number) {
    return await this.updateBoardUserState(this.roomUuid, userUuid, grantPermission)
  }

  async updateCurrentBoardState(follow: number) {
    return await this.updateBoardRoomState(this.roomUuid, follow)
  }
}
