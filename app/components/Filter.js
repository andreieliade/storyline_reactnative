import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, Navigator, ListView, Modal, TouchableOpacity } from 'react-native'
import realm from './realm'
import StoryCollectionItemCell from './StoryCollectionItemCell'
import StorySearchResultCell from './StorySearchResultCell'
import SearchBar from 'react-native-material-design-searchbar'
import Utils from '../utils/Utils'

class Filter extends Component {

	constructor(props) {
		super(props)

		this.searching = false            /* Filtering */

		availableTags = ['featured']
		props.allStories.forEach(function(story) {  /* Get tags' list from stories */
			var tags = story.tags
			tags.forEach(function(tag){
				if (!availableTags.includes(tag)) {
					availableTags.push(tag)
				}
			})
		})

		dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		this.state = {
      visible: props.visible,
			dataSourceTags: dataSource.cloneWithRows(availableTags),
		}

    this.close = this.close.bind(this)
		this.renderRow = this.renderRow.bind(this)
		this.onSearchTextChanged = this.onSearchTextChanged.bind(this)
		this.getDataSource = this.getDataSource.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.searching = false
    this.setState({visible: nextProps.visible})
	}

  close(){
    this.props.onClose()
  }

	onSelectItem(rowData){          /* When select search or filter item, close it with returning result */
		this.props.onClose(rowData)
	}

	onSearchTextChanged(searchText){
		this.searching = true
		let lowercaseKeyword = searchText.toLowerCase()
		var searchResult = []
		this.props.allStories.forEach(function(story){
			let lowcaseTitle = story.title.toLowerCase()
			if (lowcaseTitle.includes(lowercaseKeyword)) {
				searchResult.push(story)
				return
			}
			if (story.author != undefined) {
				let lowcaseAuthorName = story.author.name.toLowerCase()
				if (lowcaseAuthorName.includes(lowercaseKeyword)) {
					searchResult.push(story)
					return
				}
			}
		})
		this.setState({
			dataSourceSearchResult: dataSource.cloneWithRows(searchResult)
		})
	}

	getDataSource(){
		if (this.searching) {
			return this.state.dataSourceSearchResult
		} else {
			return this.state.dataSourceTags
		}
	}

	render() {
		return (
      <Modal
	       animationType={"slide"}
	       transparent={false}
	       visible={this.state.visible}
				 onRequestClose={() => {}}>
	       <View style={styles.container}>
	         <View style={styles.topContainer}>
	           	<TouchableOpacity style = {styles.close} onPress={this.close}>
								<Image source={require('../images/close.png')}/>
	           	</TouchableOpacity>
							<View style={styles.searchBar}>
								<SearchBar
						        onSearchChange={this.onSearchTextChanged}
						        height={40}
						        onFocus={() => console.log('On Focus')}
						        onBlur={() => console.log('On Blur')}
						        placeholder={'Search...'}
						        autoCorrect={false}
						        padding={0}
						        returnKeyType={'search'}
						      />
							</View>
	         </View>
	         <Text style={styles.title}>
					 	{this.searching ? 'Result' : 'Tags'}
					</Text>
					<ListView
						dataSource= {this.getDataSource()}
						renderRow={this.renderRow}
						style={styles.listView}
						enableEmptySections={true}
						renderSeparator={this.renderSeparator}
					/>
	       </View>
       </Modal>
		)
	}


	renderRow(rowData){
		if (this.searching) { /* Row data is story json */
			const cellProps = {
				...this.props,
				story: rowData,
				key: rowData.id,
			}
			return (
				<TouchableOpacity onPress={()=>this.onSelectItem(Utils.createConversationFromStory(rowData))}>
					<StorySearchResultCell {...cellProps}/>
				</TouchableOpacity>

			)
		} else { /* rowData is Tag string */
			return (
				<TouchableOpacity onPress={()=>this.onSelectItem(rowData)}>
					<Text style={styles.tags}> {rowData.toUpperCase()} </Text>
				</TouchableOpacity>
			)
		}

	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		 return (
			 <View
			 	key={`${sectionID}-${rowID}`}
				style={styles.separator}
			/>
		)
	}

}

const styles = StyleSheet.create({
  container: {
  	flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
		backgroundColor: 'white'
  },
  topContainer:{
    marginTop: 5,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
	title:{
		fontSize: 14,
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 10,
		color: 'black',
	},
	tags:{
		fontSize: 17,
		paddingTop: 7,
		paddingBottom: 7,
		marginLeft: 10,
		color: 'black',
	},
	close:{
		marginLeft: 5,
	},
	separator:{
		height: 0.5,
		backgroundColor: 'rgb(182, 182, 182)',
	},
	searchBar:{
		flex:1,
		height:50,
		marginLeft:10,
		marginRight:10,
	}
})

export default Filter
