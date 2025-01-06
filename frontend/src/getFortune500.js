// src/getFortune500.js
const axios = require('axios');
const cheerio = require('cheerio');

const getFortune500Companies = async () => {
  try {
    const { data } = await axios.get('https://fortune.com/ranking/global500/search/');
    const $ = cheerio.load(data);

    const companies = [];

// Here we need to identify the HTML structure of the page and extract data from it.
// Adjust selectors based on the page to get company names and other data.
    $('.company-list-item').each((i, element) => {
      if (i < 20) { // Prvih 20 podjetij
        const company = $(element).find('.company-title').text().trim();
        const revenue = $(element).find('.company-revenue').text().trim();
        const profit = $(element).find('.company-profit').text().trim();
        const rank = i + 1;

        companies.push({ rank, company, revenue, profit });
      }
    });

    return companies;
  } catch (error) {
    console.error('Error fetching Fortune 500 companies:', error);
    return [];
  }
};

module.exports = getFortune500Companies;