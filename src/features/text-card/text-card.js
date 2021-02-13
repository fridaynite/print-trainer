import React, { Component } from 'react'
import { connect } from 'react-redux'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { getTexts } from './actions'

class TextCard extends Component {
  state = {
    lang: 'ru',
    printedText: '',
    mistakes: 0,
    percentAccuracy: 100,
    printSpeed: 0,
    secondsAfterStart: 1,
    isMistake: false,
  }

  calculatePrintSpeed = () => {
    const { printedText, secondsAfterStart } = this.state

    this.setState({
      printSpeed: ((printedText.length / secondsAfterStart) * 60).toFixed(0),
      secondsAfterStart: secondsAfterStart + 1,
    })
  }

  handleKeyPress = (event) => {
    const keyCodes = [9, 20] // 9 -Tab, 20 - Caps Lock
    if (
      event.shiftKey ||
      event.altKey ||
      event.ctrlKey ||
      keyCodes.includes(event.keyCode)
    ) {
      return null
    }

    const [texts] = this.props.text.texts
    const { printedText } = this.state
    const nextString = `${printedText}${event.key}`

    if (texts.slice(0, printedText.length + 1) === nextString) {
      this.setState({ printedText: nextString, isMistake: false })

      if (nextString.length === texts.length) {
        this.stopTraining()
      }
    } else {
      const mistakes = this.state.mistakes + 1
      this.setState({
        mistakes,
        isMistake: true,
        percentAccuracy: (100 - (mistakes / texts.length) * 100).toFixed(1),
      })
    }

    if (!this.intervalId) {
      this.intervalId = setInterval(this.calculatePrintSpeed, 1000)
    }
  }

  stopTraining = () => {
    clearInterval(this.intervalId)
  }

  handleChangeText = () => {
    this.handleRestart()
    this.props.getTexts(this.state.lang)
  }

  handleChangeLang = (lang) => {
    this.setState({ lang })

    this.props.getTexts(lang)
    this.handleRestart()
  }

  handleRestart = () => {
    this.setState({
      printedText: '',
      mistakes: 0,
      percentAccuracy: 100,
      printSpeed: 0,
      secondsAfterStart: 1,
      isMistake: false,
    })
  }

  componentDidMount() {
    this.props.getTexts(this.state.lang)

    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)

    clearInterval(this.intervalId)
  }

  render() {
    const [texts] = this.props.text.texts
    const actualWord =
      texts &&
      texts.slice(
        this.state.printedText.length,
        this.state.printedText.length + 1,
      )
    const unprintedText =
      texts && texts.slice(this.state.printedText.length + 1)
    return (
      <React.Fragment>
        <Card>
          <Card.Body>
            <span style={{ color: 'green' }}>{this.state.printedText}</span>
            <span
              style={{
                backgroundColor: this.state.isMistake ? 'red' : 'green',
                color: 'white',
              }}
            >
              {actualWord}
            </span>
            {unprintedText}
          </Card.Body>
          <Card.Body>
            <span>Скорость симв./мин: {this.state.printSpeed}</span>
          </Card.Body>
          <Card.Body>
            <span>Ошибок: {this.state.mistakes}</span>
          </Card.Body>
          <Card.Body>
            <span>Точность: {this.state.percentAccuracy}%</span>
          </Card.Body>
        </Card>
        <Button onClick={this.handleChangeText}>Другой текст</Button>
        <Button onClick={this.handleRestart}>Заново</Button>
        <Button onClick={() => this.handleChangeLang('ru')}>
          Русская раскладка
        </Button>
        <Button onClick={() => this.handleChangeLang('eng')}>
          Английская раскладка
        </Button>
      </React.Fragment>
    )
  }
}

const mdtp = { getTexts }

const mstp = (state) => {
  return {
    text: state.text,
  }
}

export default connect(mstp, mdtp)(TextCard)
