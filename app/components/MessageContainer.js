import React from 'react'
import { StyleSheet,  ListView,  View } from 'react-native'

import shallowequal from 'shallowequal'
import Message from './Message'


export default class MessageContainer extends React.Component {

  constructor(props) {
    super(props)

    this.renderRow = this.renderRow.bind(this)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const messageData = this.prepareMessages(this.props.messages)
    this.state = {
      dataSource: dataSource.cloneWithRows(messageData)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return
    }
    const messageData = this.prepareMessages(nextProps.messages)
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(messageData)
    })
  }

  componentDidUpdate(){
    if ("listHeight" in this.state && "contentHeight" in this.state) { /* after get the updated size info of listview, scroll to bottom */
      var scrollDistance = this.state.contentHeight - this.state.listHeight
      if (scrollDistance > 0) {
        this._listViewRef.getScrollResponder().scrollTo({x:0, y:scrollDistance, animated:true})
      }
    }
  }

  prepareMessages(messages) {
    return (
        messages.reduce((o, m, i) => {
          const previousMessage = messages[i - 1]
          const nextMessage = messages[i + 1]
          o[i] = {
          ...m,
          previousMessage,
          nextMessage,
          }
          return o
        }, {})
    )
  }
  
  render() {
    return (
      <View style={{flex:1, backgroundColor:'white'}} >
        <ListView
          ref={component => this._listViewRef = component}
          enableEmptySections={true}
          renderHeader={this.renderHeader}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          onContentSizeChange={(w,h)=>{
             if ("listHeight" in this.state) { /* after get the updated size info of listview, scroll to bottom */
                var scrollDistance = h - this.state.listHeight
                if (scrollDistance > 0) {
                  requestAnimationFrame(() => {
                    this._listViewRef.getScrollResponder().scrollTo({x:0, y:scrollDistance, animated:true})
                  })
                }
            }
          }}
          onLayout={(event)=>{
            let layout = event.nativeEvent.layout
            this.setState({listHeight:layout.height})
          }}
        />
      </View>
    )
  }

  renderRow(message, sectionId, rowId){
    const messageProps = {
      ...this.props,
      key: 'rowId',
      message: message,
      position: message.sender_id === this.props.localUser.id ? 'right' : 'left',
      senderName: message.sender_id === 'sender_1' ? this.props.user1.name : this.props.user2.name,
    }
    if (message.battery) {
      return null
    } else {
      return <Message {...messageProps}/>
    }
  }

  renderHeader(){
    return (
      <View style={styles.headerSpace}>
      </View>
    )
  }

  renderFooter(){
    return (
      <View style={styles.footerSpace}>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  headerSpace: {
		flex: 1,
    height: 70,
	},
  footerSpace: {
    flex: 1,
    height: 100,
  },
})
