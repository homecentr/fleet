const glob = require("glob");
const path = require("path");
const { execSync } = require("child_process");

const updateDeps = (chartYamlFilePath) => {
    const chartDir = path.dirname(chartYamlFilePath);

    try
    {
        execSync(`helm dep update ${chartDir}`, {stdio : 'pipe' });
    }
    catch(err) {
        console.error(`Updating dependencies in ${chartDir} has failed:`);
        console.error(err.stdout.toString());
        console.error(err.stderr.toString());
    }
}

glob.sync("**/Chart.yaml").forEach(updateDeps);