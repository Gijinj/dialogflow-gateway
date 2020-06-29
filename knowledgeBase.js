const dialogflow = require('@google-cloud/dialogflow').v2beta1;
const config = require("./config.json");
const GOOGLE_APPLICATION_CREDENTIALS = './config.json';
process.env["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_APPLICATION_CREDENTIALS;


async function getKnowledgeBases() {
    let client = new dialogflow.KnowledgeBasesClient();

    let documents = await client.listKnowledgeBases({
        parent: 'projects/' + config.project_id,
        pageSize: 100
    });

    return JSON.stringify(documents);

};

async function getDocuments() {
    let client = new dialogflow.DocumentsClient();

    let response = await client.listDocuments({
        parent: 'projects/' + config.project_id + '/agent/knowledgeBases/' + config.knowledge_base_name,
        pageSize: 100
    });

    return response[0];
}

async function getDocument() {
    let documents = await getDocuments();

    let customDoc = documents.find((document) => { return document.displayName.toLowerCase() == 'custom' });

    if (customDoc != null) {
        let csv = new Buffer.from(customDoc.rawContent).toString();
        let kb = new Array();
        csv.split('\n').forEach((line) => {
            // simple parsing of csv, not dealing with nested , and " characters
            let question=line.split(',')[0];
            let answer=line.split(',')[1];

            kb.push({
                question: question.substr(1, question.length-2),
                answer: answer.substr(1, answer.length-2),
            })
        });

        return kb;
    }
    else {
        return [];
    }
}

async function createDocument(knowledgeCollection) {
    let documents = await getDocuments();

    let customDoc = documents.find((document) => { return document.displayName.toLowerCase() == 'custom' });

    if (customDoc != null) {

        console.log('document exsists');
        await deleteDocument(customDoc);
    }

    customDoc = {
        knowledgeTypes: ['FAQ'],
        displayName: 'Custom',
        mimeType: 'text/csv',
        enableAutoReload: false
    };


    customDoc.rawContent = getRawContent(knowledgeCollection);

    const request = {
        parent: 'projects/' + config.project_id + '/agent/knowledgeBases/' + config.knowledge_base_name,
        document: customDoc,
    };

    let client = new dialogflow.DocumentsClient();

    const [operation] = await client.createDocument(request);
    const [response] = await operation.promise();

    console.log('Document created');
    console.log(`Content URI...${response.contentUri}`);
    console.log(`displayName...${response.displayName}`);
    console.log(`mimeType...${response.mimeType}`);
    console.log(`name...${response.name}`);
    console.log(`source...${response.source}`);

    return response;
}

function getRawContent(knowledgeCollection) {
    let csv = knowledgeCollection.map((item) => {
        return '"' + item.question + '","' + item.answer + '"';
    }).join('\n');

    return new Buffer.from(csv).toString('base64');

}

async function deleteDocument(document) {
    let client = new dialogflow.DocumentsClient();

    return client.deleteDocument({
        name: document.name,
    })
}

module.exports = {
    getKnowledgeBases,
    getDocuments,
    getDocument,
    createDocument
}
//}

