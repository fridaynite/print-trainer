import { GET_TEXT_REQUEST, GET_TEXT_SUCCESS, GET_TEXT_ERROR } from './actions'

const initialState = {
  loading: false,
  loaded: false,
  texts: [],
  error: '',
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEXT_REQUEST:
      return { ...state, loading: true, loaded: false }
    case GET_TEXT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        texts: Array.isArray(action.payload)
          ? action.payload
          : [action.payload.text],
      }
    case GET_TEXT_ERROR:
      return { ...state, loading: false, loaded: false, error: action.payload }

    default:
      return state
  }
}
