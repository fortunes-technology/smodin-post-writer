import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import { GC_USER_ID } from '../constants'
import Parameter from './Parameter'

class ParameterList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newParameter: '',
            newResponse: '',
        }
    }
    componentWillUpdate(nextProps, nextState){
        if (nextProps.selectedIndustryId === this.props.selectedIndustryId) return
        if (nextProps.searchText === this.props.searchText) return
    }
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        if (!userId){
            return(
                <div>
                    <h1 className="tc">Oops! You're not logged in!</h1>
                    <button onClick={() => {
                        this.props.history.push('/login')
                    }}>Login
                    </button>
                </div>
            )
        }
        if (this.props.allParametersQuery && this.props.allParametersQuery.loading) {
            return (
                <div>
                    Loading...
                </div>
            )
        }
        if (this.props.allParametersQuery && this.props.allParametersQuery.error) {
            return (
                <div>
                    {this.props.allParametersQuery.error}
                </div>
            )
        }
        return (
            <div>
                <table className='mt2 center' id='parameterstable'>
                    <thead>
                        <tr>
                            <th id='parameterstable-th-td'>Number</th>
                            <th id='parameterstable-th-td'>Parameter</th>
                            <th id='parameterstable-th-td'>Response</th>
                            <th id='parameterstable-th-td'>Options</th>
                        </tr>
                    </thead>
                    {this.props.allParametersQuery.allParameters.map((parameter, index) => (
                            <Parameter
                                key={parameter.id}
                                parameter={parameter}
                                index={index}
                                deleteParameter={this._handleDeleteParameter}/>
                    ))}
                    <tbody id='parameterstable-tr'>
                        <tr>
                            <td id='parameterstable-th-td'>#</td>
                            <td id='parameterstable-th-td'>
                                <span className='parameterinputsidetext nowrap mr5'>
                                    <span>{'{{'}</span>
                                        <input
                                            className='parameterinput b--solid-ns b--black-10'
                                            onChange={(e) => this.setState({ newParameter: e.target.value })}
                                            value={this.state.newParameter}
                                            placeholder='Your New Parameter...'
                                            type='text'/>
                                    <span>{'}}'}</span>
                                </span>
                            </td>
                            <td id='parameterstable-th-td'>
                                <input
                                    className='pa1 br3 b--solid-ns b--black-40'
                                    onChange={(e) => this.setState({ newResponse: e.target.value })}
                                    value={this.state.newResponse}
                                    placeholder='Your New Response...'
                                    type='text'/>
                            </td>
                            <td id='parameterstable-th-td'>
                                <button
                                    className='bg-green b--dark-green br3 pr2 pl2 pb1 pt1 white-90 fw8'
                                    onClick={() => {this._handleNewParameter()}}>Submit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
    _handleDeleteParameter =  (id) => {
        console.log('deleting parameter ID: ' + id)
        this.props.deletedParameterMutation({
            variables: {
                id: id
            },
            update: (store) => {
                const userId = localStorage.getItem(GC_USER_ID)
                const data = store.readQuery({query: ALL_PARAMETERS_QUERY, variables: { id: userId }})
                const deletedParameterIndex = data.allParameters.findIndex((parameter) => (parameter.id === id))
                data.allParameters.splice(deletedParameterIndex, 1)
                store.writeQuery({query: ALL_PARAMETERS_QUERY, data, variables: { id: userId }})
            }
        })
    }
    _handleNewParameter = async () => {
        const { newParameter, newResponse } = this.state
        let id = localStorage.getItem(GC_USER_ID)
        console.log('param: ' + newParameter + ', response: ' + newResponse)
        await this.props.addParameterMutation({
            variables: {
                param: newParameter,
                response: newResponse,
                id: id
            },
            update: (store, {data: {createParameter} }) => {
                const userId = localStorage.getItem(GC_USER_ID)
                const data = store.readQuery({
                    query: ALL_PARAMETERS_QUERY,
                    variables: { id: userId }
                })
                data.allParameters.push(createParameter)
                store.writeQuery({
                    query: ALL_PARAMETERS_QUERY,
                    data,
                    variables: { id: userId }
                })
            }
        })
        this.setState({ newParameter: '', newResponse: ''})
    }
}

// export this query to be reached in SocialPostList.js
export const ALL_PARAMETERS_QUERY = gql`
  query AllParametersQuery ($id: ID!, $industryId: ID!) {
    allParameters (orderBy: default_DESC, filter: {AND: [{
        user: {
            id: $id
            }
        },{
        industries_some: {
            id: $industryId
            }
        }]}){
          id
          default
          param
          response
          industries {id}
        }}`
const ADD_PARAMETER_MUTATION = gql`
    mutation AddParameterMutation( $id: ID!, $param: String!, $response: String!){
        createParameter( userId: $id, param: $param, response: $response){
            param
            response
            id
            default
    }}`
const DELETE_PARAMETER_MUTATION = gql`
  mutation DeleteParameterMutation($id: ID!) {
    deleteParameter(id: $id) {
      id
    }
  }
`
export default compose(
    graphql(ALL_PARAMETERS_QUERY, {
        name: 'allParametersQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            const industryId = ownProps.selectedIndustryId
            return {
                variables: { id: userId, industryId: industryId }
        }}}),
    graphql(ADD_PARAMETER_MUTATION, {name: 'addParameterMutation'}),
    graphql(DELETE_PARAMETER_MUTATION, {name: 'deletedParameterMutation'})
)(ParameterList)

//left off trying to find how to  utomatically update parameters

