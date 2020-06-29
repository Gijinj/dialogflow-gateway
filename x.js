/**
 * TODO(developer): UPDATE these variables before running the sample.
 */
// export GOOGLE_APPLICATION_CREDENTIALS="C:\Users\alang\Download\personalchatbot-256109-2498b53df657.json"
// $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\alang\Download\personalchatbot-256109-2498b53df657.json"
const config = require("./config.json");
GOOGLE_APPLICATION_CREDENTIALS='./config.json'
process.env["GOOGLE_APPLICATION_CREDENTIALS"]=GOOGLE_APPLICATION_CREDENTIALS
// projectId: ID of the GCP project where Dialogflow agent is deployed
const projectId = config.project_id;

// sessionId: Random number or hashed user identifier
// const sessionId = "123456";
// queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection
const queries = [
  'Hi',
  'Next monday at 3pm for 1 hour, please', // Tell the bot when the meeting is taking place
  'B'  // Rooms are defined on the Dialogflow agent, default options are A, B, or C
]
// languaceCode: Indicates the language Dialogflow agent should use to detect intents
const languageCode = 'en';

// Imports the Dialogflow library
const dialogflow = require('dialogflow').v2beta1;
const pf = require('google-protobuf');

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient();

async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function getAgent() {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
    try {
      const agentClient = new dialogflow.AgentsClient()
      // const formattedParent = agentClient.projectAgentPath(projectId);
      agentData = await agentClient.getAgent({
        parent: 'projects/'+projectId,
        projectId
      });
      console.log('Detected agent');
      return agentData
      // console.log(intentResponse);
    } catch (error) {
      console.log("error", error);
    }
}

async function executeQueries(sessionId,query) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
    try {
      console.log(`Sending Query: ${query}`);
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      console.log('Detected intent');
      // console.log(intentResponse);
      // console.log("hiiiiii", intentResponse.queryResult.fulfillmentMessages[1].payload.fields);
      return intentResponse
    } catch (error) {
      console.log("error", error);
    }
}
// executeQueries(projectId, sessionId, queries, languageCode);

module.exports = {
  executeQueries, 
  getAgent
  }