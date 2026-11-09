const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envDir = path.resolve(__dirname, '../env');
function loadEnv() {
if (!fs.existsSync(envDir)) {
throw new Error('[Warning] Env directory not found)');
    
} const files = fs.readdirSync(envDir)
.filter(file => file.startsWith('.env.'))
.sort();

for (const file of files) {
dotenv.config({
path: path.join(envDir, file),
quiet: true,
override: false });

} console.log(`[ENV] ${files.length} files loaded.`);
} module.exports = loadEnv;
