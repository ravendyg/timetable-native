'use strict';

const Actions =
{
  LOAD_SEARCH_LISTS: 1,
  LOAD_SEARCH_HISTORY: 2,
  CONNECTION_CHANGE: 3,
  SYNC_STATUS_CHANGE: 4,
  ADD_ITEM: 5,
  REMOVE_ITEM: 6,
};

const ActionCreators = {
  loadSearchList(list)
  {
    return {
      type: Actions.LOAD_SEARCH_LISTS,
      payload: list
    };
  },

  loadSearchHistory(history)
  {
    return {
      type: Actions.LOAD_SEARCH_HISTORY,
      payload: history
    };
  },

  changeConnectionStatus(connected)
  {
    return {
      type: Actions.CONNECTION_CHANGE,
      payload: connected
    }
  },

  changeSyncStatus(status)
  {
    return {
      type: Actions.SYNC_STATUS_CHANGE,
      payload: status
    }
  },

  addItem(item, id)
  {
    return {
      type: Actions.ADD_ITEM,
      payload: {item, id}
    }
  },

  removeItem(id)
  {
    return {
      type: Actions.REMOVE_ITEM,
      payload: id
    }
  },
};

module.exports = { Actions, ActionCreators };