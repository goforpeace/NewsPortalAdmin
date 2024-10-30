// const production = 'production'
// const development = 'development'

// const mode = production
// let base_url = ''

// if (mode === production) {
//     base_url = "https://news-portal-admin.vercel.app/"
// } else {
//     base_url = 'http://localhost:5000'
// }

// export { base_url }

const production = 'production';
const development = 'development';

// Set to 'production' for deployed environment
const mode = production;  // Change this to 'production' for live deployment

let base_url = '';

if (mode === production) {
    base_url = "https://news-portal-admin.vercel.app";  // Use production server URL
} else {
    base_url = 'http://localhost:5000';  // Use local server URL for development
}

export { base_url };

