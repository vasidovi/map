const routes = {
    map: "/map"
}

function saveMap() {
    const data = {
        mountainRanges,
        rivers
    }

    const serializedData = serialize(data)

    $.ajax({
        url: routes.map,
        type: "POST",
        data: serializedData,
        contentType: 'application/json',
        success: function (response, s) {
            console.log(response)
        },
        error: function (_, status) {
            console.log(status)
            console.log("Failed to save map.");
        }
    });
}

function loadMap() {

    $.ajax({
        url: routes.map + '?_='+ $.now(),
        type: "GET",
        success: function (response) {
            const string = JSON.stringify(response);

            var parsed = deserialize(string)

            rivers = parsed.rivers || [];
            mountainRanges = parsed.mountainRanges || [];
            redraw();
        },
        error: function (_, status) {
            console.log(status)
            console.log("Failed to get map.");
        }
    });
}
loadMap()

const types = {
    River,
    RiverPart,
    MountainRange,
    Mountain
}

// https://stackoverflow.com/questions/21704318/javascript-nested-typed-object-to-json-and-back
function serialize(data) {
    return JSON.stringify(data, function replacer(key, value) {
        //warning this change the object. maybe use $.extend or xtend, or a deep clone library
        value.__type = value.constructor.name
        return value;
    });
}

function deserialize(string) {
    return JSON.parse(string, function reviver(key, value) {
        const type = types[value.__type];
        if (type) {
            var p = new type(value.name);
            Object.getOwnPropertyNames(value).forEach(function (k) {
                p[k] = value[k];
            });
            return p;
        }
        return value;
    });
}
