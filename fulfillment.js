var coursesData = require("./courses.json")

var courseSelected = null;
var outputContexts = null;

function getResponse(request) {

    // return JSON.stringify(request);

    var intent = request.queryResult.intent.name;
    var params = request.queryResult.parameters;
    outputContexts = request.queryResult.outputContexts;

    let filteredObjects;
    let formatType = "course";
    let responseMessage;

    switch (intent) {
        case 'projects/acl-xhatmt/agent/intents/03272597-3cf6-41a6-ae5b-d4ce96847496': //Get specific degree courses
            filteredObjects = getDegreeCourses(params.degreetype.toLowerCase());
            responseMessage = formatCourses(filteredObjects);
            break;

        case 'projects/acl-xhatmt/agent/intents/d411bdfa-61fa-4902-ab37-615f076ad200': //Get specific program courses
            filteredObjects = getCoursesByProgram(params.programtype.toLowerCase());
            responseMessage = formatCourses(filteredObjects);
            break;

        case 'projects/acl-xhatmt/agent/intents/febeef3b-0a44-446c-a171-70b5de8bb306': //Get courses
            filteredObjects = getCourses(params.degreetype.toLowerCase(), params.programtype.toLowerCase());
            responseMessage = formatCourses(filteredObjects);
            break;

        case 'projects/acl-xhatmt/agent/intents/4e610f80-0529-4258-835f-a2e7cae8d8d5': //Get all programs
            filteredObjects = getPrograms();
            responseMessage = formatPrograms(filteredObjects);
            break;

        case 'projects/acl-xhatmt/agent/intents/3bd6fcd4-df61-4265-bda3-65109a0dc0c6': //Get Degrees
            filteredObjects = getDegrees();
            responseMessage = formatPrograms(filteredObjects);
            break;

        case 'projects/acl-xhatmt/agent/intents/84597cf9-9620-4c2c-81f8-e800929240ef': //get fees
            filteredObjects = getFees(params.courseId);
            responseMessage = formatFees(filteredObjects);
            break;
    }

    return createResponse(responseMessage);
}

function formatCourses(courses) {

    if (courses.length == 0) {
        return 'No courses found.'
    }

    if (courses.length == 1) {
        return formatCourse(courses[0]);
    }

    /*var coursesNames = courses.map((item) => {
        return item.name
    })*/

    var message = courses.map((course) => {
        return '<p>' + course.name + '<br/>More details are <a href="' + course.link + '" target="_blank">here</a>' + '</p>';
    }).join('');

    return '<p>' + courses.length + ' courses found: </p>' + message;
}

function formatCourse(course) {
    var message = '<p>' + 'The course details:' + '</p>' +
        '<p><b>' + course.name + '</b><br/>' + course.description + '</p>' +
        'More details are <a href="' + course.link + '" target="_blank">here</a>' + '</p>';


    return message;
}

function formatPrograms(values) {

    if (values.length == 0) {
        return 'No items found.'
    }

    var message = values.map((value) => {
        return '<br/>' + value;
    }).join('');

    return 'We have programs in ' + message;
}

function formatFees(course) {
    var message = 'The course fee is:' + course.fees

    return message;
}

function getDegreeCourses(degree) {
    var courses = coursesData.filter(function (item) {
        return equals(item.degree, degree);
    });

    setCourseContext(courses);
    return courses;

}

function getCoursesByProgram(programType) {
    var courses = coursesData.filter(function (item) {
        return equals(item.programType, programType);
    });

    setCourseContext(courses);
    return courses;

}

function getCourses(degree, programType) {
    var courses = coursesData.filter(function (item) {
        return equals(item.degree, degree) && equals(item.programType, programType);
    });

    setCourseContext(courses);

    return courses;

}

function setCourseContext(courses) {
    if (courses.length == 1) {
        courseSelected = courses[0];
    }
}

function getPrograms() {
    var programs = coursesData.map((item) => {
        return item.programType
    });

    return distinctOf(programs);
}

function getDegrees() {
    var degrees = coursesData.map((item) => {
        return item.degree
    });

    return distinctOf(degrees);
}

function getFees(courseId) {
    var courses = coursesData.filter(function (item) {
        return item.id == courseId;
    });

    return courses[0];
}

function distinctOf(values) {
    return values.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
}

function equals(value1, value2) {
    return value1.toString().toLowerCase() == value2.toString().toLowerCase()
}


function createResponse(responseMessage) {
    let response = {
        fulfillmentMessages: [
            {
                text: {
                    text: [
                        responseMessage
                    ]
                }
            },

        ],

        outputContexts: outputContexts
    }


    if (courseSelected != null && outputContexts.length > 0) {

        let contextName = "projects/acl-xhatmt/agent/sessions/b03bcff5-b06f-9253-ef18-9f85537918d3/contexts/course-selected";
        let courseSelectedContext = outputContexts.find((context) => {
            context.name == contextName
        });

        if (courseSelectedContext == null) {
            courseSelectedContext = {
                name: contextName,
                parameters: {
                }
            }

            outputContexts.push(courseSelectedContext);

        }

        courseSelectedContext.parameters.courseId = courseSelected.id;
        courseSelectedContext.lifespanCount = 2;
    }

    return response;
}

module.exports = {
    getResponse,
}