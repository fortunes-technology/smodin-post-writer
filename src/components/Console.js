import React, { Component } from 'react'
import ParameterList from './ParameterList'
import SocialPostList from './SocialPostList'
import IndustryList from './IndustryList'
import ParameterAndPostSearch from './ParameterAndPostSearch'

class Console extends Component {
    constructor(props) {
        super(props)
        const primaryIndustryId = 'cj97jd2670t6501027go4pm46'
        const primaryIndustry = 'Generic'
        const defaultSearchText = ''
        const defaultTab = 'parameters'
        this.state = {
            selectedIndustryId: primaryIndustryId,
            selectedIndustry: primaryIndustry,
            searchText: defaultSearchText,
            tab: defaultTab,
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextState.selectedIndustryId === !this.state.selectedIndustryId) {}
        if (nextState.searchText === !this.state.searchText) {}
        if (nextState.tab === !this.state.tab) {}
        else return
    }
    render() {
        return (
            <div className='flexbox-parent-console'>
                <div className='pt1 pr2 pl1 w235p bg-black-10'>
                    <IndustryList
                            defaultIndustryId={this.state.selectedIndustryId}
                            defaultIndustry={this.state.selectedIndustry}
                            receiveIndustry={this._passIndustry}/>
                </div>
                <div className='flex-1 fill-area-content fill-area-col'>
                    <div className='bg-gray pt2 pb2'>
                        <ParameterAndPostSearch
                            defaultSearchText={this.state.searchText}
                            defaultTab={this.state.tab}
                            receiveSearchText={this._passSearch}
                            receiveTab={this._passTab}/>
                    </div>
                    <div className='flex-1 fill-area-content pl3'>
                        {(this.state.tab === 'parameters')?
                        <ParameterList
                            selectedIndustry={this.state.selectedIndustry}
                            selectedIndustryId={this.state.selectedIndustryId}
                            searchText={this.state.searchText}/> : null }
                        {(this.state.tab === 'posts')?
                        <SocialPostList
                            selectedIndustry={this.state.selectedIndustry}
                            selectedIndustryId={this.state.selectedIndustryId}
                            searchText={this.state.searchText}/> : null }
                    </div>
                </div>
            </div>
        )
    }
    _passIndustry = (industryId, industry) => {
        this.setState({ selectedIndustryId: industryId, selectedIndustry: industry })
    }
    _passSearch = (searchText) => {
        this.setState({ searchText: searchText })
    }
    _passTab = (tab) => {
        this.setState({ tab: tab })
    }
}

export default Console