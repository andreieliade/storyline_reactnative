import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, ListView, Modal, TouchableOpacity, TouchableHighlight,BackAndroid } from 'react-native'
const timer = require('react-native-timer')
//var config = require('../config')

let BUTTON_INACTIVE_DELAY = 450;
let NEXT_BUTTON_TIMER_ID = "NextButton";


class NextButton extends Component {
    _enableInteractions;

	constructor(props) {
		super(props)
        this._enableInteractions = true;
        this.state = {interactive: this._enableInteractions }
        this.onButtonPress = this.onButtonPress.bind(this);
    }

    onButtonPress() {
        if (this._enableInteractions) {
            this._enableInteractions = false;
            requestAnimationFrame(() => {
                this.setState({interactive: this._enableInteractions}, () => {
                    timer.setTimeout(this, NEXT_BUTTON_TIMER_ID, () => {
                        this._enableInteractions = true;
                        this.setState({interactive: this._enableInteractions});
                    }, BUTTON_INACTIVE_DELAY);
                    this.props.onPress();
                });
            })
        }
    }

	componentWillReceiveProps(nextProps) {

	}

	componentWillUnmount() {
    }

	componentDidMount(){

	}

	render() {
        const text = 'Next';
        return(
            <TouchableOpacity 
                disabled={!this.state.interactive} 
                style={styles.touchableArea}
                onPress={this.onButtonPress}>
                
                <View style={[styles.nextButton]} >
                    <Text style={[styles.text, {opacity: 1}, !this.state.interactive && {opacity: 0.5}]}>
                        { text }
				    </Text>
                </View>
            </TouchableOpacity>
        );
	}
}

const styles = StyleSheet.create({
    touchableArea: {
        position: 'absolute',
        bottom: 20,
        marginTop: 30,
        left: 26,
        right: 26,
        height: 45,
    },
    nextButton: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#9B2FAE',
		backgroundColor: 'transparent',
		justifyContent: 'center',
	},
    text: {
        color:'#9B2FAE',
        textAlign: 'center',
        fontSize: 20,
        },
})

export default NextButton;