import * as React from 'react';
import { View, TouchableOpacity, Text, Dimensions, StyleSheet, Shape } from 'react-native';
import { Header } from 'react-native-elements';
import { Agenda } from 'react-native-calendars';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import db from '../config';

export default class CalendarScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			today: '',
			items: {},
			emailId: firebase.auth().currentUser.email,
			docId: '',
		};
	}

	formatKey = () => {
		const newItems = {};
		Object.keys(this.state.items).forEach((key) => {
			newItems[key] = this.state.items[key];
		});
		this.setState({
			items: newItems,
		});
	};

	getData = async () => {
		db.collection('users')
			.where('emailId', '==', this.state.emailId)
			.onSnapshot((snapshot) => {
				snapshot.docs.map((doc) => {
					console.log(Dimensions.get('window').height + ' + ' + Dimensions.get('window').width);

					var myReminders = doc.data().myReminders;
					this.setState({
						items: myReminders,
						docId: doc.id,
					});
				});
			});
	};

	//Function to add items to this.state.items to display
	loadItems = (day) => {
		setInterval(() => {
			for (let i = 0; i <= 7; i++) {
				//i = Amount of days prior to or subsequent to the day selected
				var time = day.timestamp + i * 24 * 60 * 60 * 1000;

				//Changes {time} variable into yyyy-mm-dd format
				var strTime = new Date(time).toISOString().split('T')[0];
				if (!this.state.items[strTime]) {
					this.state.items[strTime] = [];
				}
			}

			const newItems = {};
			Object.keys(this.state.items).forEach((key) => {
				newItems[key] = this.state.items[key];
			});
			this.setState({
				items: newItems,
			});
		}, 1000);
	};

	componentDidMount() {
		this.getData();
	}

	renderItem = (item) => {
		return (
			<Card style={{ marginTop: 10, marginRight: 17 }}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<View>
						<Title style={{ marginLeft: 10, fontWeight: 'bold' }}>{item.reminderBrief}</Title>

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginTop: 2,
							}}>
							<Card style={{ paddingHorizontal: 5, marginLeft: 10 }}>
								<Paragraph style={{ marginHorizontal: 5, fontSize: 12 }}>{item.date}</Paragraph>
							</Card>

							<Card style={{ paddingHorizontal: 5, marginLeft: 10 }}>
								<Paragraph style={{ marginHorizontal: 5, fontSize: 12 }}>{item.time}</Paragraph>
							</Card>
						</View>
					</View>

					<Avatar.Text label='J' style={{ marginVertical: 10, marginRight: 5 }} />
				</View>
			</Card>
		);
	};

	emptyDay = () => (
		<View style={{ marginTop: RFValue(17, 979), justifyContent: 'center' }}>
			<Card style={{ marginRight: 17, paddingVertical: 15 }}>
				<View>
					<View>
						<Title style={{ marginLeft: 10, fontWeight: 'bold' }}>Nothing planned for today!</Title>
					</View>
				</View>
			</Card>
		</View>
	);

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Header
					backgroundColor='#dc4d3f'
					centerComponent={{ text: 'Calendar', style: { color: 'white', fontSize: RFValue(28, 979) } }}
					leftComponent={
						<Icon
							name='bars'
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'flex-start',
								alignItems: 'center',
								color: 'white',
							}}
							size={RFValue(28, 979)}
							onPress={() => {
								this.props.navigation.toggleDrawer();
							}}
						/>
					}
					rightComponent={
						<Icon
							name='plus'
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'flex-end',
								alignItems: 'center',
								color: 'white',
							}}
							size={RFValue(28, 979)}
							onPress={() => {
								this.props.navigation.navigate('Reminder');
							}}
						/>
					}
				/>
				<Agenda
					testID='agenda'
					items={this.state.items}
					loadItemsForMonth={this.loadItems}
					renderItem={this.renderItem}
					renderEmptyDate={this.emptyDay}
					theme={{
						agendaTodayColor: 'red',
						agendaKnobColor: 'black',
						selectedDayBackgroundColor: '#2ac9c9',
						selectedDayTextColor: 'black',
						textDayHeaderFontSize: 14,
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonStyle: {
		marginVertical: 10,
		paddingVertical: 5,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		textAlignVertical: 'center',
		width: Dimensions.get('window').width - 10,
		flexDirection: 'row',
	},
});
