const glob = require("glob");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const { Validator } = require("jsonschema");
const { execSync } = require("child_process");

const fleetSchema =  yaml.load(fs.readFileSync(`${__dirname}/fleet-schema.yml`, "utf8")); //require(`${__dirname}/fleet-schema.json`);
const schemaValidator = new Validator();

let success = true;

const validateFleetFile = (fleetFilePath) => {
    const fleetConfig = yaml.load(fs.readFileSync(fleetFilePath, "utf8"));

    const validation = schemaValidator.validate(fleetConfig, fleetSchema);

    if(validation.errors.length) {
        success = false;
        console.log(`❌  /${fleetFilePath} does not match fleet schema`);

        validation.errors.forEach(err => { 
            console.log(`    - /${err.path} ${err.message}`);
        });
    }
    else {
        console.log(`✔️  /${fleetFilePath} is valid`);
    }
}

const validateHelmDependencies = (chartDir) => {
    const depErrors = [];
    const stdout = execSync(`helm dep list ${chartDir}`, {stdio : 'pipe' });
    const outputLines = stdout.toString().split('\n');

    outputLines.slice(1).forEach(line => {
        if(!line || line === "") {
            return;
        }

        var segments = line.split('\t');
        var status = segments[segments.length - 1];

        if(status !== "ok") {
            depErrors.push(segments[0])
        }
    });

    return depErrors;
}

const lintHelmChart = (chartDir) => {
    const lintErrors = [];

    try
    {
        execSync(`helm lint --strict ${chartDir}`, {stdio : 'pipe' });
    }
    catch(err) {
        const lines = err.stdout.toString().split('\n')
        lines.forEach(line => lintErrors.push(line));
    }
    
    return lintErrors;
}

const validateHelmChart = (chartYamlFilePath) => {
    const chartDir = path.dirname(chartYamlFilePath);
    
    const lintErrors = lintHelmChart(chartDir)
    const depErrors = validateHelmDependencies(chartDir);

    if(depErrors.length || lintErrors.length) {
        success = false;

        console.log(`❌ Chart /${chartDir} is invalid:`);
        lintErrors.forEach(err => console.log(`   - ${err}`));
        depErrors.forEach(dep => console.log(`    - Invalid dependency ${dep}`));
    }
    else {
        console.log(`✔️  Chart /${chartDir} is valid`);
    }
};

glob.sync("**/fleet.yml").forEach(validateFleetFile);
glob.sync("**/Chart.yaml").forEach(validateHelmChart);

if(!success) {
    process.exit(1);
}