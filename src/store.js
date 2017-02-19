'use strict';

import {combineReducers, createStore} from 'redux';
import { Actions } from './action-creators';

const app =
  combineReducers({
    searchList, searchHistory
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


module.exports =
{
  Store
};