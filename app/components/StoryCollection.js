import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, Navigator, ListView, RefreshControl, TouchableOpacity, Modal, TouchableHighlight } from 'react-native'

import StoryCollectionRow from './StoryCollectionRow'
import Conversation from '../model/Conversation'
import Filter from './Filter'
import Utils from '../utils/Utils'
var config = require('../config')

var API_URL = config.apiHost
var PARAMS = 'store_response.json'
var REQUEST_URL = API_URL + PARAMS

class StoryCollection extends Component {

  constructor(props) {
    super(props)
    this.featureText = 'FEATURED' /* FEATURE button text */
    dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      loaded: false,        /* JSON Stories from server is not loaded */
      filterVisible: false,  /* Filter Modal View is hidden */
    }

    this.fetchData = this.fetchData.bind(this)
    this.showFilter = this.showFilter.bind(this)
    this.renderStory = this.renderStory.bind(this)
    this.renderFilterModal = this.renderFilterModal.bind(this)
    this.updateDataSource = this.updateDataSource.bind(this)
    this.closeFilter = this.closeFilter.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData () {
    this.setState({refreshing: true})
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.allStories = responseData
        this.updateDataSource(this.allStories)
      })
    .catch((error) => {
      console.log(error)
    })
    .done()
  }

  updateDataSource(stories){  /* Update and reload the Datasource of listView */
    let items = Utils.createConversationsFromStories(stories)
    let groups = Utils.groupItems(items)
    this.setState({
      dataSource: dataSource.cloneWithRows(groups),
      loaded: true,
      refreshing: false,
    })
  }

  showFilter(){   /* Show Filter & Search Modal View */
    this.setState({filterVisible: true})
  }

  closeFilter(result){  /* Close Filter & Search Modal View with returned result of searching or filtering  */
    if (result !== undefined && result.constructor.name === 'String') { /* Filter result is tag string */
      this.featureText = result.toUpperCase()
      var filterResult = []
      if (result === 'featured') {
        filterResult = this.allStories
      } else {
        this.allStories.forEach(function(story){
          if(story.tags.includes(result)){
            filterResult.push(story)
          }
        })
      }
      this.updateDataSource(filterResult)
    } else if (result !== undefined && result.constructor.name === 'Conversation'){ /* Search result is Conversation */
      this.props.onSelectStory(result)
    }
    this.setState({filterVisible: false})
  }

  render() {
    if (!this.state.loaded) {    /* if Stories JSON from server is not loaded yet... */
      return this.renderLoadingView()
    }
    return (
      <View style={{flex: 1}}>
        {this.renderFilterModal()}
        {this.renderStoryThumbCollection()}
        {this.renderFeatureButton()}
      </View>
    )
  }

  renderLoadingView() {      /* Loading View */
    return (
      <View style={styles.container}>
          <Text>
            Loading Stories...
          </Text>
      </View>
    )
  }

  renderStoryThumbCollection() {  /* Render Symmetric Story CollectionView */
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderStory}
        style={styles.listView}
        enableEmptySections={true}
        refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.fetchData} /> }
      />
    )
  }

  renderStory(storyGroup) {  /* Render Story Collection Row */
    const rowProps = {
      ...this.props,
      storyGroup: storyGroup,
    }
    return (
      <StoryCollectionRow {...rowProps} />
    )
  }

  renderFeatureButton() { /* Render feature button at the bottom */
    return (
      <TouchableOpacity  style={styles.featureButton} onPress={this.showFilter}>
        <Text style={styles.featureText}>
          {this.featureText}
        </Text>
      </TouchableOpacity>
    )
  }

  renderFilterModal(){  /* Render Filter & Search Modal View */
    const filterProps = {
      ...this.props,
      visible: this.state.filterVisible,
      allStories: this.allStories,
      onClose: this.closeFilter,
    }
    return (
      <Filter {...filterProps} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
  featureText:{
    flex: 1,
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
  },
  featureButton: {
    position: 'absolute',
    left: -2,
    bottom: -2,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#9B2FAE',
    borderTopRightRadius:7,
  },
  searchModalContainer:{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
  },
})

export default StoryCollection
