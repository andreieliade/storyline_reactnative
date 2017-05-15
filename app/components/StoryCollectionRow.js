import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, Navigator, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import StoryCollectionItemCell from './StoryCollectionItemCell'


class StoryCollectionRow extends Component {

	constructor(props) {
		super(props)
		this.renderRow = this.renderRow.bind(this)
		this.renderCellWithFlex = this.renderCellWithFlex.bind(this)
	}

	render() {
		storyCount = this.props.storyGroup.length
		return (
				this.renderRow(storyCount)
		)
  }

	renderRow(storyCount){
		let unitSize = 0.5 * Dimensions.get('window').width  /* Unit Cell Size = ScreenWidth/2 */
		var cellsInLeftColumn = []
		var cellsInRightColumn = []
		let rowHeight

		switch (storyCount) {
			case 1:
					rowHeight = unitSize
					cellsInLeftColumn.push(this.renderCellWithFlex(0, 1))
					break;
			case 2:
					rowHeight = 1.5 * unitSize
					cellsInLeftColumn.push(this.renderCellWithFlex(0, 1.5))
					cellsInRightColumn.push(this.renderCellWithFlex(1, 1.5))
					break;
			case 3:
					rowHeight = 2 * unitSize
					cellsInLeftColumn.push(this.renderCellWithFlex(0, 2))
					cellsInRightColumn.push(this.renderCellWithFlex(1, 1))
					cellsInRightColumn.push(this.renderCellWithFlex(2, 1))
					break;
			case 4:
					rowHeight = 2.5 * unitSize
					cellsInLeftColumn.push(this.renderCellWithFlex(0, 1))
					cellsInLeftColumn.push(this.renderCellWithFlex(2, 1.5))
					cellsInRightColumn.push(this.renderCellWithFlex(1, 1.5))
					cellsInRightColumn.push(this.renderCellWithFlex(3, 1))
					break;
			case 5:
					rowHeight = 4 * unitSize
					cellsInLeftColumn.push(this.renderCellWithFlex(0, 2))
					cellsInLeftColumn.push(this.renderCellWithFlex(2, 2))
					cellsInRightColumn.push(this.renderCellWithFlex(1, 1.5))
					cellsInRightColumn.push(this.renderCellWithFlex(3, 1.5))
					cellsInRightColumn.push(this.renderCellWithFlex(4, 1))
					break;
			case 6:
					rowHeight = 4.5 * unitSize;
					cellsInLeftColumn.push(this.renderCellWithFlex(0, 1))
					cellsInLeftColumn.push(this.renderCellWithFlex(2, 1.5))
					cellsInLeftColumn.push(this.renderCellWithFlex(4, 2))
					cellsInRightColumn.push(this.renderCellWithFlex(1, 2))
					cellsInRightColumn.push(this.renderCellWithFlex(3, 1.5))
					cellsInRightColumn.push(this.renderCellWithFlex(5, 1))
					break;
			default:
		}

		return (
      <View style={[styles.groupContainer, {height: rowHeight}]}>
        <View style={styles.columnContainerLeft}>
					{cellsInLeftColumn}
        </View>
        <View style={styles.columnContainerRight}>
					{cellsInRightColumn}
        </View>
      </View>
    )
	}

  renderCellWithFlex(itemIndex, flexValue){ /* flexValue : Weight of cellHeight in Row */
		var story = this.props.storyGroup[itemIndex];
		const cellProps = {
			...this.props,
			story: story,
			flex: flexValue,
			key: story.id,
		}
		return (
			<StoryCollectionItemCell {...cellProps}/>
    )
  }
}

const styles = StyleSheet.create({
	groupContainer:{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'stretch',
	},
  columnContainerLeft:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
		paddingRight: 0.5,
  },
	columnContainerRight:{
		flex: 1,
		flexDirection: 'column',
		alignItems: 'stretch',
		paddingLeft: 0.5,
	},
})

export default StoryCollectionRow
