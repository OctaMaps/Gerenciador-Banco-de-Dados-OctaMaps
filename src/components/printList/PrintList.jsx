import React, { Component } from 'react'
import Main from '../templates/Main'
import API from '../../services/API'

const api = API('http://localhost:3001/get-list')

const headerProps = {
  icon: 'print',
  title: 'Imprimir Lista de Salas',
  subtitle: ''
}

export default class PrintList extends Component{
  getList = async () => {
    await api.getList(api.baseUrl)
  }

  render(){
    return(
      <Main { ...headerProps}>
        <button className="btn btn-danger ml-2" onClick={() => this.getList()}>
          Teste
        </button>
      </Main>
    )
  }
}