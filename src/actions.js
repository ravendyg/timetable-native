'use strict';

import { AsyncStorage, NetInfo } from 'react-native';
import { ActionCreators } from './action-creators';

import { config } from './config';

import { Store } from './store';

let apiKey;
function getAPIKey()
{
  return AsyncStorage.getItem('@timetable:apikey')
  .then(
    key =>
    {
      if (!key)
      {
        apiKey = Math.random().toFixed(10).slice(2);
        AsyncStorage.setItem('@timetable:apikey', apiKey);
      }
      else
      {
        apiKey = key;
      }
    }
  );
}


// list

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


const lastSync = AsyncStorage.getItem('@timetable:lastSync')
  .then(_tsp =>
  {
    let tsp = +_tsp || 0;
    return tsp;
  });

function loadLocal()
{
  Store.dispatch(
    ActionCreators.changeSyncStatus('in progress')
  );

  lastSync.then(
    tsp =>
    {
      if (!tsp)
      {
        sync(tsp);
      }
      else
      {
        // load list from memory
        let syncing = false;
        AsyncStorage.getItem('@timetable:list')
        .then(
          _list =>
          {
            let list;
            try
            {
              list = JSON.parse(_list);
            }
            catch (err) {}

            if (list)
            {
              Store.dispatch(
                ActionCreators.loadSearchList(list)
              );
              cleanOutdatedHistory({list});
            }
            else if (!syncing)
            { // smth wrong
              sync(tsp);
            }
          }
        )
        // outdated, sync in parallel
        if (Date.now() - tsp > config.SYNC_VALID_FOR)
        {
          sync(tsp);
        }
      }
    }
  );
}


function sync(syncTsp)
{
  if (Store.getState().connection)
  {
    fetch(`${config.BASE_URL}/${config.API_VERSION}/lists?tsp=${syncTsp}&apikey=${apiKey}`, {
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
              id: e,
              type: 'group'
            }))
          )
          .concat(
            (data.places || []).map(e => ({
              text: e,
              id: e,
              type: 'place'
            }))
          )
          .concat(
            (data.teachers || []).map(e => ({
              text: e.name,
              id: e.teacherId,
              type: 'teacher'
            }))
          );

        Store.dispatch(
          ActionCreators.loadSearchList(list)
        );
        cleanOutdatedHistory({list});

        Store.dispatch(
          ActionCreators.changeSyncStatus('loaded')
        );

        AsyncStorage.setItem('@timetable:list', JSON.stringify(list));
        AsyncStorage.setItem('@timetable:lastSync', JSON.stringify(data.tsp));
      }
    )
    .catch(() =>
    {
      sync(0);
    });
  }
  else
  {
    Store.dispatch(
      ActionCreators.changeSyncStatus('error')
    );
  }
}

// history
function getSearchHistory()
{
  AsyncStorage.getItem('@timetable:searchHistory')
  .then(
    history =>
    {
      history = history || [];
      Store.dispatch(
        ActionCreators.loadSearchHistory(history)
      );
      cleanOutdatedHistory({history});
      syncHistoryItems(history);
    }
  );
}

function syncHistoryItems(history)
{
  for (let item of history)
  {
    debugger;
    fetch(`${config.BASE_URL}/${config.API_VERSION}/sync/${item.type}s?tsp=${item.tsp}&id=${item.id}&apikey=${apiKey}`, {
      method: 'GET'
    })
    .then(resp => resp.json())
    .then(
      data =>
      {
        debugger;
        if (data && data.info.length > 0)
        {
          let _item = data.info[0];
          _item.type = item.type;
          Store.dispatch(
            ActionCreators.addItem(_item, item[item.type + 'Id'])
          );
          AsyncStorage.setItem('@timetable:item:' + item[item.type + 'Id'], JSON.stringify(_item));
        }
      }
    )
    .catch(err =>
    {
      debugger;
    });
  }
}


/**
 * will be called only with one of the argument
 * one that has just been received,
 * but will be completed only once
 */
function cleanOutdatedHistory({history, list})
{
  if (history)
  {
    list = Store.getState().searchList;
  }
  else
  {
    history = Store.getState().searchHistory;
  }

  if (list && history)
  {
    let keys = list.reduce(
      (acc, e) => acc.add(e.id),
      new Set()
    );

    history = history.filter(e => keys.has(e.id));
    Store.dispatch(
      ActionCreators.loadSearchHistory(history)
    );
  }
}


// connection

NetInfo.addEventListener('change', checkConnection);
function checkConnection()
{
  return NetInfo.isConnected.fetch().then(
    connected =>
    {
      Store.dispatch(
        ActionCreators.changeConnectionStatus(connected)
      );
      if (connected && Store.getState().syncStatus === 'error')
      {
        Store.dispatch(
          ActionCreators.changeSyncStatus('in progress')
        );
        sync();
      }
    }
  );
}




// init

getAPIKey()
.then(checkConnection)
.then(loadLocal);
getListsFromStorage();
getSearchHistory();