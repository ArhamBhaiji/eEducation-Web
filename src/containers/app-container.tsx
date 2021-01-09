import React from 'react';
import { ConfirmDialog } from '@/components/dialog';
import { Toast } from '@/components/toast';
import { routesMap, AppRouteComponent } from '@/pages';
import { AppStore, AppStoreConfigParams } from '@/stores/app';
import { Provider } from 'mobx-react';
import { Route, HashRouter, Switch } from 'react-router-dom';
import ThemeContainer from '../containers/theme-container';
import { DelegateType } from '@/modular';
import { RoomParameters } from '@/modular/declare';
export interface RouteContainerProps {
  routes: string[]
}

export interface AppContainerProps extends RouteContainerProps {
  basename?: string
  store: AppStore
}

type AppContainerComponentProps = Omit<AppContainerProps, 'defaultStore'>

export const RouteContainer = (props: RouteContainerProps) => {

  const routes = props.routes
    .filter((path: string) => routesMap[path])
    .reduce((acc: AppRouteComponent[], item: string) => {
    acc.push(routesMap[item])
    return acc
  }, [])

  return (
    <Switch>
    {
      routes.map((item, index) => (
        <Route key={index} path={item.path} component={item.component} />
      ))
    }
    </Switch>
  )
}

export const AppContainer = (props: AppContainerProps) => {
  return (
    <Provider store={props.store}>
      <ThemeContainer>
        <HashRouter basename={props.basename}>
          <Toast />
          <ConfirmDialog />
          <RouteContainer routes={props.routes} />
        </HashRouter>
      </ThemeContainer>
    </Provider>
  )
}

type GenAppContainerProps = {
  globalId: string
  appConfig: AppStoreConfigParams
  roomConfig?: RoomParameters
  forwardWire?: DelegateType
}

type GenAppComponentProps = Pick<AppContainerComponentProps, "routes" | "basename">

export const GenAppContainer = ({globalId, forwardWire, ...config}: GenAppContainerProps) => {
  const appStore = new AppStore({
    config: config.appConfig,
    roomInfoParams: config.roomConfig
  })
  if (forwardWire) {
    forwardWire.delegate = appStore
  }
  //@ts-ignore
  window[globalId] = appStore
  return (props: GenAppComponentProps) => (
    <AppContainer
      {...props}
      store={appStore} 
    />
  )
}