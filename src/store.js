'use strict';

import {combineReducers, createStore} from 'redux';
import { Actions } from './action-creators';

const app =
  combineReducers({
    searchList, searchHistory, connection, syncStatus, data, page
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

function data(state = {}, action)
{
  switch (action.type)
  {
    case Actions.ADD_ITEM:
      let temp1 = {};
      temp1[action.payload.id] = action.payload.item;
      return Object.assign({}, state, temp1);

    case Actions.REMOVE_ITEM:
      if (state[action.payload.id])
      {
        let temp2 = Object.assign({}, state);
        delete temp2[action.payload.id];
        return temp2;
      }
      else
      {
        return state;
      }

    default:
      return state;
  }
}

function page(state = 0, action)
{
  switch (action.type)
  {
    case Actions.NAVIGATION:
      return action.payload;
    default:
      return state
  }
}

module.exports =
{
  Store
};