var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import https from 'https';
import mustache from 'mustache';
import path from 'path';
const NUM_PAGES = 10;
// Function to fetch activity data from the API
function fetchActivityData() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            https.get('https://www.boredapi.com/api/activity', (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    try {
                        const activityData = JSON.parse(data);
                        resolve(activityData);
                    }
                    catch (error) {
                        console.error('Error parsing activity data:', error.message);
                        resolve(null);
                    }
                });
            }).on('error', (error) => {
                console.error('Error fetching activity data:', error.message);
                resolve(null);
            });
        });
    });
}
// Function to generate the pages
function generatePages() {
    return __awaiter(this, void 0, void 0, function* () {
        const templateSource = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
        if (!fs.existsSync(path.join(__dirname, '..', 'pages'))) {
            fs.mkdirSync(path.join(__dirname, '..', 'pages'));
        }
        for (let i = 1; i <= NUM_PAGES; i++) {
            const activityData = yield fetchActivityData();
            if (activityData) {
                const renderedContent = mustache.render(templateSource, { id: i, activity: activityData.activity });
                fs.writeFileSync(path.join(__dirname, '..', `pages/page${i}.html`), renderedContent);
            }
        }
        console.log('Pages generated successfully!');
    });
}
generatePages();
