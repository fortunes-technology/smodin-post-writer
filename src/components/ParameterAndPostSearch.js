import React, { Component } from 'react'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText: this.props.defaultSearchText,
            tab: this.props.defaultTab
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextState.tab === !this.state.tab) {}
        else return
    }
    render() {
        return (
            <div className='flex items-center justify-between'>
                <div className='pt2 pb2'>
                    {(this.state.tab === 'parameters') ?
                        <a className='tab-on smodin-red ml1 pb3'>Parameters</a>
                        :
                        <a
                            className='tab-off ml1 pb3 fw6 white'
                            onClick={() => {this._sendTabToParent('parameters')}}>Parameters</a>}
                    {(this.state.tab === 'posts') ?
                        <a className='tab-on smodin-red ml1 pb3'>Posts</a>
                        :
                        <a
                            className='tab-off ml1 pb3 fw6 white'
                            onClick={() => {this._sendTabToParent('posts')}}>Posts</a>}
                </div>
                {(this.state.tab === 'posts')?
                <div className='flex items-center mr3'>
                    <i className="fa fa-search fa-lg mr2 white " aria-hidden="true"></i>
                    <input
                        className='br4 pa1 mr3 gray b--solid-ns b--black-40'
                        type='text'
                        placeholder='Search...'
                        onChange={(e) => this.setState({searchText: e.target.value})}
                    />
                    <button
                        className='br4 pa1 b--smodin-red bg-smodin-red fw6'
                        onClick={this._sendSearchTextToParent}>
                        Search
                    </button>
                </div>
                : null }
            </div>
        )
    }
    _sendSearchTextToParent = () => {
        this.props.receiveSearchText(this.state.searchText)
    }
    _sendTabToParent = async (tab) => {
        await this.setState({ tab: tab })
        this.props.receiveTab(tab)
    }
}

/*
const ALL_LINKS_SEARCH_QUERY = gql`
  query AllLinksSearchQuery($searchText: String!) {
    allLinks(filter: {
      OR: [{
        url_contains: $searchText
      }, {
        description_contains: $searchText
      }]
    }) {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`
*/
export default Search
