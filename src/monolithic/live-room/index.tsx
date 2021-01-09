import { AppContainer, GenAppContainer } from '@/containers/app-container'
import { DelegateType } from '@/modular'
import { RoomComponentConfigProps, RoomConfigProps } from '@/modular/declare'
import { AppStore } from '@/stores/app'
import React from 'react'
import {render} from 'react-dom'

const routes: string[] = [
  "setting",
  "1v1",
  "smallClass",
  "bigClass",
  "home"
]

export const LiveRoom = ({store}: RoomConfigProps) => {
  return (
    <AppContainer
      routes={routes}
      store={store} 
    />
  )
}

export const RenderLiveRoom = ({dom, store}: RoomComponentConfigProps, delegate: DelegateType) => (
  render(
    <LiveRoom store={store} />,
    dom
  )
)