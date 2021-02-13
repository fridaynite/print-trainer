import axios from 'axios'

import { apiUrlRu, apiUrlEng } from '../helpers/config'

export const GET_TEXT_REQUEST = 'GET_TEXT_REQUEST'
export const GET_TEXT_SUCCESS = 'GET_TEXT_SUCCESS'
export const GET_TEXT_ERROR = 'GET_TEXT_ERROR'

const getTextRequest = () => {
  return {
    type: GET_TEXT_REQUEST,
  }
}

const getTextSuccess = (data) => {
  return {
    type: GET_TEXT_SUCCESS,
    payload: data,
  }
}

const getTextError = (message) => {
  return {
    type: GET_TEXT_ERROR,
    payload: message,
  }
}

export const getTexts = (lang) => (dispatch) => {
  const request = getTextRequest()
  dispatch(request)

  let url

  if (lang === 'ru') {
    url = `${apiUrlRu}/get?format=json&number=4`
  }

  if (lang === 'eng') {
    url = `${apiUrlEng}/?type=all-meat&sentences=4`
  }

  axios
    .get(url)
    .then((response) => {
      console.log(response.data)
      const success = getTextSuccess(response.data)
      dispatch(success)
    })
    .catch((err) => {
      const error = getTextError(err.message)
      dispatch(error)
    })
}
