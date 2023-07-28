import fs from 'fs';
import mustache from 'mustache';
import path from 'path';

const NUM_PAGES = 10;

// Function to fetch activity data from the API
async function fetchActivityData() {
    try {
        const response = await fetch("https://www.boredapi.com/api/activity");
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Error fetching activity data:', error.message);
        return null;
    }
}

// Function to generate the pages
async function generatePages() {
    const templateSource = fs.readFileSync(path.join(__dirname, '../template.html'), 'utf8');

    for (let i = 1; i <= NUM_PAGES; i++) {
        const activityData = await fetchActivityData();
        if (activityData) {
            const activity = activityData.activity;
            const type = activityData.type;
            const price = activityData.price;
            const accessibility = activityData.accessibility;
            const key = activityData.key;

            const renderedContent = mustache.render(templateSource, {
                activity: activity,
                type: type,
                key: key,
                price: price,
                accessibility: accessibility,
            });
            fs.writeFileSync(path.join(__dirname, '..', `page${i}.html`),
                renderedContent);
        }
    }
}

generatePages();

// npx ts-node src/generatePages.ts