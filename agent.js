const languageCode = 'en';

// Imports the Dialogflow library
const dialogflow = require('dialogflow').v2beta1;
const dialogflow = require('@google-cloud/dialogflow');
 
function getEntities()
{

}

async function listSessionEntityTypes(projectId, sessionId) {
    // Imports the Dialogflow library
  
    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient ();
    const sessionPath = sessionEntityTypesClient.projectAgentSessionPath(
      projectId,
      sessionId
    );
  
    const request = {
      parent: sessionPath,
    };
  
    // Send the request for retrieving the sessionEntityType.
    const [response] = await sessionEntityTypesClient.listSessionEntityTypes(
      request
    );
    response.forEach(sessionEntityType => {
      console.log(`Session entity type name: ${sessionEntityType.name}`);
      console.log(`Number of entities: ${sessionEntityType.entities.length}\n`);
    });
  }