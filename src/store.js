'use strict';

import {combineReducers, createStore} from 'redux';
import { Actions } from './action-creators';

const app =
  combineReducers({
    searchList, searchHistory, connection, syncStatus
  });

const Store = createStore(app);



// reducers
function searchList(state = null, action)
{
  switch (action.type)
  {
    case Actions.LOAD_SEARCH_LISTS:
      return action.payload;
    default:
      return state;
  }
}

function searchHistory(state = null, action)
{
  switch (action.type)
  {
    case Actions.LOAD_SEARCH_HISTORY:
      return action.payload;
    default:
      return state;
  }
}

function connection(state = false, action)
{
  switch (action.type)
  {
    case Actions.CONNECTION_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

function syncStatus(state = 'in progress', action)
{
  switch (action.type)
  {
    case Actions.SYNC_STATUS_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

module.exports =
{
  Store
};