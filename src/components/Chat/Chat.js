import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from '../InfoBar.js/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;

const Chat = ({ location }) => {
	const ENDPOINT = 'https://chat-app-socket-io-react.herokuapp.com/';
	// || 'localhost:5000';
	const [ name, setName ] = useState('');
	const [ room, setRoom ] = useState('');
	const [ users, setUsers ] = useState('');
	const [ message, setMessage ] = useState('');
	const [ messages, setMessages ] = useState([]);

	useEffect(
		() => {
			const { name, room } = queryString.parse(location.search);

			socket = io(ENDPOINT);

			setRoom(room);
			setName(name);
			socket.emit('join', { name, room }, () => {});
			return () => {
				socket.emit('disconnect');

				socket.off();
			};
		},
		[ ENDPOINT, location.search ],
	);

	useEffect(
		() => {
			socket.on('message', (message) => {
				setMessages([ ...messages, message ]);
			});
		},
		[ messages ],
	);

	// function for sending messages

	const sendMessage = (e) => {
		e.preventDefault();
		if (message) {
			socket.emit('sendMessage', message, () => setMessage(''));
		}
	};

	console.log(message, messages);
	return (
		<div className='outerContainer'>
			<div className='container'>
				<InfoBar room={room} />
				<Messages messages={messages} name={name} />
				<Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
			</div>
			{/* <TextContainer users={users} /> */}
		</div>
	);
};

export default Chat;
