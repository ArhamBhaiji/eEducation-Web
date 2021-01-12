import { ApiBaseInitializerParams } from './../../packages/packages/agora-edu-app/src/services/base';
import { ApiBase } from '@/services/base';

type LoginParams = {
  roomUuid: string
  rtmUid: string
  role: string
}

type LoginResult = Promise<{
  rtmToken: string,
  rtmUid: string
}>

export class HomeApi extends ApiBase {
  constructor(params: ApiBaseInitializerParams) {
    super(params)
  }

  async login(params: LoginParams): LoginResult {
    const res = await this.fetch({
      url: `/v2/login`,
      method: 'POST',
      data: params
    })
    return res
  }
}