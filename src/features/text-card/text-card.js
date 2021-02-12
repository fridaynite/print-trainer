import React, { Component } from 'react'
import { connect } from 'react-redux'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { getTexts } from './actions'

class TextCard extends Component {
  state = {
    printedText: '',
    mistakes: 0,
    printSpeed: 0,
    secondsAfterStart: 0,
    isMistake: false,
  }

  calculatePrintSpeed = () => {
    const { printedText, secondsAfterStart } = this.state
    console.log(printedText.length, secondsAfterStart)
    this.setState({
      printSpeed: (printedText.length / secondsAfterStart) * 60,
      secondsAfterStart: secondsAfterStart + 1,
    })
  }

  handleKeyPress = (event) => {
    const [texts] = this.props.text.texts
    const { printedText } = this.state
    const nextString = `${printedText}${event.key}`
    console.log(nextString)
    if (texts.slice(0, printedText.length + 1) === nextString) {
      this.setState({ printedText: nextString, isMistake: false })

      console.log(true)
    } else {
      this.setState({ mistakes: this.state.mistakes + 1, isMistake: true })
    }

    if (!this.intervalId) {
      this.intervalId = setInterval(this.calculatePrintSpeed, 1000)
    }
  }

  componentDidMount() {
    this.props.getTexts()

    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)

    clearInterval(this.intervalId)
  }

  render() {
    const [texts] = this.props.text.texts
    const unprintedText = texts && texts.slice(this.state.printedText.length)
    return (
      <React.Fragment>
        <Card>
          <Card.Body>
            <span style={{ color: this.state.isMistake ? 'red' : 'green' }}>
              {this.state.printedText}
            </span>
            {unprintedText}
          </Card.Body>
          <Card.Body>
            <span>Скорость симв./мин: {this.state.printSpeed}</span>
          </Card.Body>
          <Card.Body>
            <span>Ошибок: {this.state.mistakes}</span>
          </Card.Body>
        </Card>
        <Button onClick={this.props.getTexts}>Другой текст</Button>
        <Button
          onClick={() =>
            this.setState({
              printedText: '',
              mistakes: 0,
              printSpeed: 0,
              secondsAfterStart: 0,
              isMistake: false,
            })
          }
        >
          Заново
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
