import * as React from 'react';
import { View, TouchableOpacity, Text, Dimensions, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Input, Header } from 'react-native-elements';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import Calendar from 'react-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from 'firebase';
import db from '../config';

export default class AddReminder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			reminder: {},
			reminderBrief: '',
			date: new Date(),
			emailId: firebase.auth().currentUser.email,
			docId: '',
		};
	}

	onChange = (event, selectedDate) => {
		const currentDate = selectedDate || this.state.date;
		this.setState({ date: currentDate }, () => {});
	};

	confirmPressed = async () => {
		await db
			.collection('users')
			.where('emailId', '==', this.state.emailId)
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					this.setState({
						docId: doc.id,
						reminder: doc.data().myReminders,
					});
				});
			});

		console.log('final');
		var date = this.state.date.toLocaleDateString('fr-CA');
		var time = this.state.date.toTimeString().substr(0, 8);

		if (!this.state.reminder[date]) {
			this.state.reminder[date] = [];
			this.state.reminder[date].push({
				reminderBrief: this.state.reminderBrief,
				date: date,
				time: time,
			});
			this.postStateChange();
		} else {
			this.state.reminder[date].push({
				reminderBrief: this.state.reminderBrief,
				date: date,
				time: time,
			});
			this.postStateChange();
		}
	};

	postStateChange = async () => {
		var condition = true;
		try {
			await db.collection('users').doc(this.state.docId).update({
				myReminders: this.state.reminder,
			});
		} catch (err) {
			alert(err.message);
			condition = false;
		}

		if (condition) {
			alert('You reminder has been added!');
			this.props.navigation.navigate('Calendar');
		}
	};

	render() {
		return Platform.OS === 'ios' ? (
			<View>
				<Header
					centerComponent={{ text: 'Reminder', style: { color: 'white', fontSize: RFValue(28, 979) } }}
					leftComponent={
						<Icon
							name='arrow-left'
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'flex-start',
								alignItems: 'center',
								color: 'white',
							}}
							size={RFValue(28, 979)}
							onPress={() => {
								this.props.navigation.navigate('Calendar');
							}}
						/>
					}
				/>
				<Input
					onChangeText={(text) => {
						this.setState({
							reminderBrief: text,
						});
					}}
					value={this.state.reminderBrief}
					containerStyle={styles.formInput}
					placeholder='Brief Description about your reminder'
					leftIcon={
						<Icon
							name='bell'
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'flex-start',
								alignItems: 'center',
								color: 'black',
								paddingTop: 2,
							}}
							size={RFValue(18, 979)}
						/>
					}
				/>

				<View style={{ alignSelf: 'center' }}>
					<DateTimePicker
						testID='dateTimePicker'
						value={this.state.date}
						// is24Hour={true}
						display='default'
						onChange={this.onChange}
						mode='datetime'
						style={{ paddingHorizontal: 150, marginLeft: 10 }}
					/>
				</View>
				<TouchableOpacity
					style={[styles.formButton, { marginTop: 20 }]}
					onPress={() => {
						this.confirmPressed();
					}}>
					<Text style={styles.buttonText}>Confirm</Text>
				</TouchableOpacity>
			</View>
		) : (
			<View>
				<Header
					centerComponent={{ text: 'Reminder', style: { color: 'white', fontSize: RFValue(28, 979) } }}
					leftComponent={
						<Icon
							name='arrow-left'
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'flex-start',
								alignItems: 'center',
								color: 'white',
							}}
							size={RFValue(28, 979)}
							onPress={() => {
								this.props.navigation.navigate('Calendar');
							}}
						/>
					}
				/>
				<Input containerStyle={styles.formInput} placeholder='Brief Description about your reminder' />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	formInput: {
		justifyContent: 'center',
		alignSelf: 'center',
		// color: '#e3ac91',
		width: RFValue(400, 1024),
		marginTop: RFValue(20, 768),
	},

	formButton: {
		borderWidth: 2,
		borderColor: 'black',
		backgroundColor: '#006aff',
		padding: 5,
		width: 100,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginHorizontal: 10,
	},

	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
});
