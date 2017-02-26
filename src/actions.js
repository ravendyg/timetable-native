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
            let list = parseAsync(_list);

            if (list && Store.getState().searchList === null)
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
    _history =>
    {
      let history = parseAsync(_history);
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
    fetchInfoFromServer(Object.assign({}, {tsp: 0}, item))
    .then(
      data =>
      {
        if (data && data.tsp && data.tsp !== item.tsp)
        {
          item.tsp = data.tsp;
          pushItemIntoHistory(item, true);
        }
      }
    )
  }
}

export function pushItemIntoHistory(item, replace)
{
  let history = Store.getState().searchHistory || [];
  for (let i = 0; i < history.length; i++)
  {
    if (history[i].id === item.id)
    {
      if (replace)
      {
        let newHistory = history.slice(0, i).concat([item]).concat(history.slice(i + 1));
        storeNewHistory(newHistory);
      }
      else if (i > 0)
      {
        let newHistory = [item].concat(history.slice(0, i)).concat(history.slice(i + 1));
        storeNewHistory(newHistory);
      }
      return;
    }
  }
  let newHistory =
    [item].concat(
      history.length === config.HISTORY_LENGTH
        ? history.slice(0, history.length - 1)
        : history
    );
  storeNewHistory(newHistory);
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
    storeNewHistory(history);
  }
}

function storeNewHistory(newHistory)
{
  AsyncStorage.setItem('@timetable:searchHistory', JSON.stringify(newHistory));
  Store.dispatch(
    ActionCreators.loadSearchHistory(newHistory)
  );
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

// data
export function fetchInfo(item)
{
  let infoInStore  = Store.getState().data[item.id];
  if (isValidInfo(infoInStore))
  {
    return;
  }

  AsyncStorage.getItem('@timetable:item:' + item.id)
  .then(
    _info =>
    {
      let info = parseAsync(_info);
      if (isValidInfo(info))
      {
        Store.dispatch(
          ActionCreators.addItem(info, item.id)
        );
      }
      else
      {
        fetchInfoFromServer(Object.assign({}, item, {tsp: info.refresh}))
      }
    }
  )
  .catch(
    () =>
    {
      fetchInfoFromServer(Object.assign({}, item, {tsp: 0}));
    }
  );
}

function isValidInfo(info)
{
  return info && info.refresh > Date.now() - config.SYNC_VALID_FOR
}

function fetchInfoFromServer({id, type, tsp})
{
  return fetch(`${config.BASE_URL}/${config.API_VERSION}/sync/${type}s?tsp=${tsp}&id=${id}&apikey=${apiKey}`, {
    method: 'GET'
  })
  .then(resp => resp.json())
  .then(
    data =>
    {
      if (data && data.info.length > 0)
      {
        let item = data.info[0];
        item.type = type;

        item = transforItemToReadableForm(item);

        Store.dispatch(
          ActionCreators.addItem(item, id)
        );

        AsyncStorage.setItem('@timetable:item:' + id, JSON.stringify(item));
        return item;
      }
      return null;
    }
  )
  .catch(err =>
  {
    console.error(err);
  });
}

/**
 * add refresh timestamp
 * convert event into an array
 * populate empty parts
 */
function transforItemToReadableForm(_item)
{
  let item = Object.assign({}, _item);
  item.refresh = Date.now();
  let evName = _item.type + 'Events';
  let days = [];
  for (let day = 1; day < 7; day++)
  {
    let _temp = {
      day: config.DAYS[day - 1],
      _count: 0,
      events: []
    };
    for (let bell of config.BELLS)
    {
      let lessons = item[evName][day + '|' + bell.short];
      let event = {
        bell,
        lessons,
        open: false
      };
      _temp.events.push(event);
      if (lessons)
      {
        _temp._count++;
      }
    }
    days.push(_temp);
  }
  item.days = days;
  delete item[evName];

  return item;
}



// init

getAPIKey()
.then(checkConnection)
.then(loadLocal);
getListsFromStorage();
getSearchHistory();


// helpers
function parseAsync(smth)
{
  let out;
  try
  {
    out = JSON.parse(smth);
  }
  catch (err)
  {
    out = null;
  }
  return out;
}