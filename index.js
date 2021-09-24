const startTime = new Date();

class MetranslatorInitializationError extends Error {
    constructor(message) {
        super(message);
    }
}

switch (process.argv[2]) {
    case "debug":
        debug = true
        api = false
        break;
    case "release":
        debug = false
        api = false
        break;
    case "api":
        debug = false
        api = true
        break;
    default:
        throw new MetranslatorInitializationError("Debugging level not defined or invalid")
}

switch (process.argv[3]) {
    case "en":
        toMetroz = false
        break;
    case "mt":
        toMetroz = true
        break;
    default:
        throw new MetranslatorInitializationError("Target language not defined or invalid")
}

if (typeof process.argv[4] !== "string") {
    throw new MetranslatorInitializationError("String to translate not defined")
}

if (debug) console.log("Loading database");
const db = require('./database.json');
let output = {
    system: {
        name: db._name,
        version: db._version,
        length: db.phrases.length
    },
    facts: [],
    duration: null,
    output: null
}

let query = " " + process.argv[4].toLowerCase().replaceAll("!", " !").replaceAll("?", " ?").replaceAll(",", " ,").replaceAll(".", " .") + " ";

if (toMetroz) {
    if (debug) console.log("Target language is Metroz, source MUST be English");

    for (phrase of db.phrases) {
        if (debug) console.log("\nTrying to match '" + phrase.en.trim() + "'...");
        matches = (query.match(new RegExp(phrase.en, "gmi")) || []).length;
        if (debug) console.log(matches + " match(es)")
    
        if (matches > 0 && typeof phrase.fact === "string" && phrase.fact.trim() !== "") {
            output.facts.push(phrase.fact)
        }
    
        query = query.replaceAll(phrase.en, phrase.mt);
    }
} else {
    if (debug) console.log("Target language is English, source MUST be Metroz");

    for (phrase of db.phrases) {
        if (debug) console.log("\nTrying to match '" + phrase.mt.trim() + "'...");
        matches = (query.match(new RegExp(phrase.mt, "gmi")) || []).length;
        if (debug) console.log(matches + " match(es)")
    
        if (matches > 0 && typeof phrase.fact === "string" && phrase.fact.trim() !== "") {
            output.facts.push(phrase.fact)
        }
    
        query = query.replaceAll(phrase.mt, phrase.en);
    }
}

output.output = query.trim().replaceAll(" !", "!").replaceAll(" ?", "?").replaceAll(" ,", ",").replaceAll(" .", ".").replaceAll("[{[", "").replaceAll("]}]", "");

const endTime = new Date();
const diffTime = (endTime - startTime).toFixed(2);

output.duration = endTime - startTime;

if (debug) {
    console.log("")
    console.dir(output);
} else if (api) {
    console.log(JSON.stringify(output).trim());
} else {
    console.log("")
    console.log("*")
    console.log("| "+JSON.stringify(db._name).replaceAll('"',''))
    console.log("| Database version: " + JSON.stringify(db._version).replaceAll('"',''))
    console.log("| Made by Jamez and Minteck!")
    console.log("| Source: https://minteck.ro.lt/git/minteck/metranslator-api")
    console.log("*")
    console.log("")
    console.log("Done in " + diffTime + " ms");
    console.log("Fun Facts:\n - " + output['facts'].join("\n - "))
    console.log("")
    console.log("Output: " + output['output'])
}