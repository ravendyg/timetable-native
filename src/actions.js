'use strict';

import { AsyncStorage, NetInfo } from 'react-native';
import { ActionCreators } from './action-creators';

import { config } from './config';

import { Store } from './store';

function getListsFromStorage()
{
  AsyncStorage.getItem('@timetable:searchList')
  .then(
    list =>
    {
      if (list)
      {
        Store.dispatch(
          ActionCreators.loadSearchList(list)
        );
      }
    }
  );
}

export function getSearchHistory()
{
  AsyncStorage.getItem('@timetable:searchHistory')
  .then(
    history =>
    {
      Store.dispatch(
        ActionCreators.loadSearchHistory(history || [])
      );
    }
  );
}


const lastSync = AsyncStorage.getItem('@timetable:lastSync')
  .then(_data =>
  {
    let data;
    try
    {
      data = JSON.parse(_data);
    }
    catch (err)
    { // do nothing
    }
    return Object.assign({
      list: 0,
      groups: 0,
      teachers: 0,
      places: 0
    }, data || {});
  });


function sync()
{
  lastSync.then(
    syncTsp =>
    {
      if (Store.getState().connection)
      {
        Store.dispatch(
          ActionCreators.changeSyncStatus('in progress')
        );
        // perform sync
        Promise.all([
          fetch(`${config.BASE_URL}/${config.API_VERSION}/lists?tsp=${syncTsp.list}`, {
            method: 'GET'
          })
          .then(resp => resp.json())
          .then(
            data =>
            {
              let list =
                []
                .concat(
                  (data.groups || []).map(e => ({
                    text: e,
                    id: e
                  }))
                )
                .concat(
                  (data.places || []).map(e => ({
                    text: e,
                    id: e
                  }))
                )
                .concat(
                  (data.teachers || []).map(e => ({
                    text: e.name,
                    id: e.teacherId
                  }))
                );

              Store.dispatch(
                ActionCreators.loadSearchList(list)
              );
            }
          )
        ])
        .then(
          () =>
          {
            // debugger;
            Store.dispatch(
              ActionCreators.changeSyncStatus('loaded')
            );
            AsyncStorage.setItem('@timetable:lastSync', JSON.stringify(syncTsp));
          }
        )
      }
      else
      {
        Store.dispatch(
          ActionCreators.changeSyncStatus('error')
        );
      }
    }
  );
}


NetInfo.addEventListener('change', checkConnection);
function checkConnection()
{
  NetInfo.isConnected.fetch().then(
    connected =>
    {
      Store.dispatch(
        ActionCreators.changeConnectionStatus(connected)
      );
      if (connected && Store.getState().syncStatus === 'error')
      {
        sync();
      }
    }
  );
}

checkConnection();
getListsFromStorage();
getSearchHistory();
sync();