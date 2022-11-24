// # TODO: Lint helm charts
// # TODO: Validate fleet.yml/yaml against a json schema
const glob = require("glob");
const fs = require("fs");
const yaml = require("js-yaml");
const { Validator } = require("jsonschema");

const fleetSchema =  yaml.load(fs.readFileSync(`${__dirname}/fleet-schema.yml`, "utf8")) //require(`${__dirname}/fleet-schema.json`);
const schemaValidator = new Validator();

const validateFleetFile = (fleetFilePath) => {
    const fleetConfig = yaml.load(fs.readFileSync(fleetFilePath, "utf8"));

    const validation = schemaValidator.validate(fleetConfig, fleetSchema);

    if(validation.errors.length) {
        console.log(`❌ ${fleetFilePath} does not match fleet schema`);

        validation.errors.forEach(err => { 
            console.log(`    - /${err.path} ${err.message}`);
        });
    }
    else {
        console.log(`✔️ ${fleetFilePath} is valid`);
    }
}

glob.sync("**/fleet.yml").forEach(validateFleetFile);