'use strict';

const Actions =
{
  LOAD_SEARCH_LISTS: 1,
  LOAD_SEARCH_HISTORY: 2
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
  }
};

module.exports = { Actions, ActionCreators };