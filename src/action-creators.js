'use strict';

const Actions =
{
  LOAD_SEARCH_LISTS: 1,
  LOAD_SEARCH_HISTORY: 2,
  CONNECTION_CHANGE: 3,
  SYNC_STATUS_CHANGE: 4,
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
  }
};

module.exports = { Actions, ActionCreators };