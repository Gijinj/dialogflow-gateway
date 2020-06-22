var coursesData = require("./courses.json")

function getResponse(request) {

    // return JSON.stringify(request);

    var intent = request.queryResult.intent.name;
    var params = request.queryResult.parameters;

    let responseMessage;

    switch (intent) {
        case 'projects/acl-xhatmt/agent/intents/03272597-3cf6-41a6-ae5b-d4ce96847496': //Get specific degree courses
            responseMessage = getDegreeCourses(params.degreetype.toLowerCase());
            break;

        case 'projects/acl-xhatmt/agent/intents/d411bdfa-61fa-4902-ab37-615f076ad200': //Get specific program courses
            responseMessage = getCoursesByProgram(params.programtype.toLowerCase());
            break;

        case 'projects/acl-xhatmt/agent/intents/febeef3b-0a44-446c-a171-70b5de8bb306': //Get courses
            responseMessage = getCourses(params.degreetype.toLowerCase(), params.programtype.toLowerCase());
            break;
    }

    return createResponse(responseMessage);


}

function formatResponse(courses) {

    if (courses.length == 0) {
        return 'No courses found.'
    }

    var message = courses.map((item) => {
        return '<p>' + item + '</p>'
    }).join('');

    return message;
}

function getDegreeCourses(degree) {
    var courses = coursesData.filter(function (item) {
        return item.degree == degree;
    });

    var coursesNames = courses.map((item) => {
        return item.name
    })

    return coursesNames;

}

function getCoursesByProgram(programType) {
    var courses = coursesData.filter(function (item) {
        return item.programType == programType;
    });

    var coursesNames = courses.map((item) => {
        return item.name
    })

    return coursesNames;

}

function getCourses(degree, programType) {
    var courses = coursesData.filter(function (item) {
        return item.degree == degree && item.programType == programType;
    });

    var coursesNames = courses.map((item) => {
        return item.name
    })

    return coursesNames;

}


function createResponse(responseMessage) {
    return {
        fulfillmentMessages: [
            {
                text: {
                    text: [
                        formatResponse(responseMessage)
                    ]
                }
            }
        ]
    }
}

module.exports = {
    getResponse,
}