import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { createMessage } from './graphql/mutations';
import { listMessages } from './graphql/queries';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

let owner = Auth.currentAuthenticatedUser();
const initialState = { owner, message: '' };

function App() {
  const [formState, setFormState] = useState(initialState);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);
  // @ts-ignore: Unreachable code error
  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchMessages() {
    try {
      const messageData = await API.graphql(graphqlOperation(listMessages));
      // @ts-ignore: Unreachable code error
      const messages = messageData?.data?.listMessages.items;
      setMessages(messages);
    } catch (err) {
      console.log('error fetching messages');
    }
  }

  async function addMessage() {
    try {
      if (!formState.message) return;
      const message = { ...formState };
      // @ts-ignore: Unreachable code error
      setMessages([...messages, message]);
      setFormState(initialState);
      await API.graphql(
        graphqlOperation(createMessage, {
          owner: owner,
          message,
        })
      );
    } catch (err) {
      console.log('error creating message:', err);
    }
  }
  return (
    // <div style={styles.container}>
    <div className="App">
      <AmplifySignOut />
      <h1>This is our app</h1>
      <h2>Amplify Messages</h2>
      <input
        onChange={(event) => setInput('message', event.target.value)}
        // style={styles.input}
        value={formState.message}
        placeholder="Type Message Here..."
      />
      <button
        // style={styles.button}
        onClick={addMessage}
      >
        Send
      </button>
      {messages.map((message, index) => (
        // @ts-ignore: Unreachable code error
        <div key={message.id ? message.id : index}>
          {/* @ts-ignore: Unreachable code error*/}
          <p>{message.owner}</p> <p>{message.message}</p>
        </div>
      ))}
    </div>
  );
}

export default withAuthenticator(App);
