import React from 'react';
import { observer } from 'mobx-react';
import { useExtensionStore, useBoardStore } from '@/hooks';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import './extension-card.scss'
import { t } from '@/i18n';

export const ExtensionCard: React.FC<any> = observer(() => {

  const extensionStore = useExtensionStore()
  const boardStore = useBoardStore()

  const bindMiddleGroup = function() {
    extensionStore.showGrouping()
    boardStore.hideExtension()
  }

  const bindMiddleHand = function() {
    extensionStore.toggleCard()
    boardStore.hideExtension()
  }

  return (
    <div className="extension-card">
      <Paper className="paperCard">
        <MenuList>
          <MenuItem onClick={bindMiddleGroup}>
          <div className="group-item"></div>
          {t('extension.grouping')}
          </MenuItem>
          <MenuItem onClick={bindMiddleHand}>
          <div className="hand-item"></div>
          {t('extension.hands_up')}
          </MenuItem>
        </MenuList>
      </Paper>
    </div>
  )
})