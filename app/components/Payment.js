import React, { Component } from 'react'
import { AppRegistry, View, Platform, StyleSheet, Image, Text, Navigator, ListView, Modal, TouchableHighlight, TouchableOpacity } from 'react-native'
import realm from './realm'
import Utils from '../utils/Utils'
const timer = require('react-native-timer')
const InAppBilling = require("react-native-billing")

class Payment extends Component {

	constructor(props) {
		super(props)
		this.state = {
			visible: props.visible,
		}
		this.close = this.close.bind(this)
		this.completePurchase = this.completePurchase.bind(this)
		this.alreadyIn = this.alreadyIn.bind(this)
	}

	completePurchase(item) {
		var self = this
		InAppBilling.open()
			.then(() => {
				InAppBilling.isSubscribed(item)
					.then((result) => {
						if (result) {
							self.props.onPayment()
							return InAppBilling.close()
						}
						else {
							InAppBilling.subscribe(item)
								.then((details) => {
									Utils.updateSubscriptionStatusFromTransactionDetails(details)
									self.props.onPayment()
									return InAppBilling.close()
								})
						}
					})
			})

			.catch(function (error) {
				alert(error)
				return InAppBilling.close()
			});

	}
	componentWillReceiveProps(nextProps) {
		this.setState({ visible: nextProps.visible })
	}

	componentWillUnmount() {
		timer.clearInterval(this);
	}

	componentDidMount() {

	}

	close() {
		this.props.onClose()
	}

	render() {
		var productDetails = Utils.getProductDetails();
		console.log("Rendering Product Details: ", productDetails);

		if (this.state.visible) {
			return (
				<View style={styles.wrapper}>
					<View style={styles.contentContainer}>
						<Text style={styles.text1}>
							Join the Storyline Club!
					 </Text>
						<Text style={styles.text2}>
							Read unlimited stories with no waiting!
					 </Text>
					</View>
					{
						productDetails &&
						<View style={styles.bottomContainer}>
							<TouchableHighlight style={styles.optionButton1} onPress={() => this.completePurchase('storyline_7day')} underlayColor={"#e0e0e0"}>
								<View style={styles.buttonView}>
									<Image source={require('../images/batterysale2.png')} style={styles.buttonImage} />
									<View style={styles.buttonTextLayout}>
										<Text style={styles.text3}>
											7 Days Free
										</Text>
										<Text style={styles.text4}>
											{ `then ${productDetails['storyline_7day'].priceText}/week` }
										</Text>
									</View>
								</View>
							</TouchableHighlight>
							<TouchableHighlight style={styles.optionButton1} onPress={() => this.completePurchase('storyline_1month')} underlayColor={"#e0e0e0"}>
								<View style={styles.buttonView}>
									<Image source={require('../images/batterysale3.png')} style={styles.buttonImage} />
									<Text style={styles.text3}>
										{ `1 month for ${productDetails['storyline_1month'].priceText}` }
							</Text>
								</View>
							</TouchableHighlight>
							<TouchableHighlight style={styles.optionButton1} onPress={() => this.completePurchase('storyline_1year')} underlayColor={"#e0e0e0"}>
								<View style={styles.buttonView}>
									<Image source={require('../images/batterysale4.png')} style={styles.buttonImage} />
									<Text style={styles.text3}>
										{ `1 year for ${productDetails['storyline_1year'].priceText}` }
							</Text>
								</View>
							</TouchableHighlight>
							<TouchableHighlight style={styles.optionButton2} onPress={this.alreadyIn} underlayColor={"transparent"}>
								<Text style={styles.text2}>
									{ `I'm already in Storyline Club` }
						</Text>
							</TouchableHighlight>
						</View>
					}
				</View>
			)
		}
		else {
			return (<View></View>)
		}
	}

	renderRow(rowData) {
		if (this.searching) { /* Row data is story json */
			const cellProps = {
				...this.props,
				story: rowData,
				key: rowData.id,
			}
			return (
				<TouchableOpacity onPress={() => this.onSelectItem(Utils.createConversationFromStory(rowData))}>
					<StorySearchResultCell {...cellProps} />
				</TouchableOpacity>
			)
		} else { /* rowData is Tag string */
			return (
				<TouchableOpacity onPress={() => this.onSelectItem(rowData)}>
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

	alreadyIn() {
		var self = this
		InAppBilling.open()
			.then(() => InAppBilling.updateSubscription(['storyline_7day', 'storyline_1month', 'storyline_1year'])
				.then((details) => {
					self.completePurchase()
					return InAppBilling.close()
				})
				.catch(function (error) {
					alert(error)
					return InAppBilling.close()
				}))
			.catch(function (error) {
				alert(error)
				return InAppBilling.close()
			});
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'column',
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		backgroundColor: 'transparent',
	},

	container: {
		flexDirection: 'column',
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		backgroundColor: 'rgba(0, 0, 0, 0.9)'
	},

	topContainer: {
		marginTop: 5,
		marginLeft: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},

	bottomContainer: {
		flex: 3,
		marginTop: 0,
		flexDirection: 'column',
		backgroundColor: 'transparent',
	},
	contentContainer: {
		flex: 1,
		backgroundColor: 'transparent',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonImage: {
		width: 25,
		height: 25,
		marginRight: 20,
	},
	buttonView: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	optionButton1: {
		height: 55,
		marginBottom: 5,
		marginLeft: 26,
		marginRight: 26,
		marginTop: 5,
		backgroundColor: '#B049B9',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
	},
	optionButton2: {
		height: 45,
		marginBottom: 5,
		marginLeft: 26,
		marginRight: 26,
		marginTop: 0,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text1: {
		fontSize: 24,
		color: 'white',
		textAlign: 'center'
	},
	text2: {
		fontSize: 17,
		marginTop: 20,
		color: 'white',
		textAlign: 'center'
	},
	text3: {
		fontSize: 14,
		color: 'white',

	},
	text4: {
		fontSize: 10,
		color: 'white',
	},

	buttonTextLayout: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},

	close: {
		marginLeft: 5,
	},
})

export default Payment
AppRegistry.registerComponent('Payment', () => Payment);
