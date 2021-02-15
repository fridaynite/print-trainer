import React from 'react'

import { Modal, Button, Row, Col } from 'react-bootstrap'

import { Speedometer, XCircle, Vinyl } from 'react-bootstrap-icons'

function FinishModal(props) {
  return (
    <Modal onHide={props.hide} show={props.show} className="test-modal">
      <Modal.Header closeButton>
        <Modal.Title>Итоги теста</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={4}>
            <Speedometer className="icon-finish" color="royalblue" size={100} />{' '}
            <span className="test-title">Скорость</span>
            <p className="finish-result">{props.printSpeed}</p>
          </Col>
          <Col md={4}>
            <XCircle className="icon-finish" color="royalblue" size={100} />{' '}
            <span className="test-title"> Ошибок</span>
            <p className="finish-result">{props.mistakes}</p>
          </Col>
          <Col md={4}>
            <Vinyl className="icon-finish" color="royalblue" size={100} />{' '}
            <span className="test-title">Точность</span>
            <p className="finish-result">{props.percentAccuracy}%</p>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.hide} variant="primary">
          Отлично!
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FinishModal
