import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, Button, Row, Col } from 'react-bootstrap'

import {
  Speedometer,
  XCircle,
  Vinyl,
  ArrowRightCircle,
  ArrowRepeat,
} from 'react-bootstrap-icons'

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
    isTrainingFinished: false,
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
    if (event.altKey || event.ctrlKey || keyCodes.includes(event.keyCode)) {
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
      if (event.shiftKey) return null

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

    this.setState({ isTrainingFinished: true })
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
      isTrainingFinished: false,
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
        <Card className="main-card">
          <Row>
            <Col md={10}>
              <Button
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => this.handleChangeLang('ru')}
                variant="light"
                className="lang-button"
              >
                Ru
              </Button>
              <Button
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => this.handleChangeLang('eng')}
                variant="light"
                className="lang-button"
              >
                Eng
              </Button>
              <Card.Body>
                <Card.Text className="text-block">
                  <span style={{ color: 'green' }}>
                    {this.state.printedText}
                  </span>
                  <span
                    style={{
                      backgroundColor: this.state.isMistake ? 'red' : 'green',
                      color: 'white',
                    }}
                  >
                    {actualWord}
                  </span>
                  {unprintedText}
                </Card.Text>
              </Card.Body>
              <div className="bottom-buttons">
                <Button
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={this.handleChangeText}
                  variant="light"
                >
                  <ArrowRightCircle className="icon" color="royalblue" />
                  Другой текст
                </Button>
                <Button
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={this.handleRestart}
                  variant="light"
                >
                  <ArrowRepeat className="icon" color="royalblue" />
                  Заново
                </Button>
              </div>
            </Col>
            <Col md={2}>
              <Card className="info-card">
                <Card.Header>
                  <span>
                    <Speedometer className="icon" color="royalblue" /> Скорость
                  </span>
                </Card.Header>
                <span className="print-result">
                  {this.state.printSpeed} зн./мин
                </span>
                <Card.Header>
                  <span>
                    <XCircle className="icon" color="royalblue" /> Ошибок
                  </span>
                </Card.Header>
                <span className="print-result">{this.state.mistakes}</span>
                <Card.Header>
                  <span>
                    <Vinyl className="icon" color="royalblue" /> Точность
                  </span>
                </Card.Header>
                <span className="print-result">
                  {this.state.percentAccuracy}%
                </span>
              </Card>
            </Col>
          </Row>
        </Card>
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
