let cheerio = require('cheerio'),
	request = require('request');

const util = require('util');

let sureList = [];

collectSureNames = function(url, callback) {
	request({
		uri: url,
		method: "GET",
		timeout: 10000,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
		}
	}, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			$ = cheerio.load(body);

			$('nobr > a').each((i, elem) => {

				let sureName = $(elem).text().split(' ')[1];
				let sureUrl = $(elem).attr('href');

				sureList.push({
					sureName,
					sureUrl
				})
			});

			callback(sureList);

		} else {
			console.log(err);
			callback(null);
		}
	});
}

collectSureContent = function(url, callback) {
	request({
		uri: url,
		method: "GET",
		timeout: 10000,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
		}
	}, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			$ = cheerio.load(body);

			let info = $('div.alert.alert-silver.text-justify.hyphenate.small').text().trim();
			let ayetList = [];

			$('span.nc-verse-container').children((i, elem) => {
				let ayetMeal = '';
				let arContentUrl = '';

				if ($(elem).attr('class') === "nc-verse") {
					ayetMeal = $(elem).text().split('\n')[2];
				}
				if (($(elem).attr('class') === "btn btn-default btn-xs") && ($(elem).text() == "Sayfada Göster")) {
					arContentUrl = $(elem).attr('href');
				}

				ayetList.push({
					ayetMeal,
					arContentUrl
				})
			});

			callback({
				info,
				ayetList
			})

		} else {
			console.log(err);
			callback(null);
		}
	});
}

fetchArabicContent = function(url, callback) {
	request({
		uri: url,
		method: "GET",
		timeout: 10000,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'
		}
	}, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			$ = cheerio.load(body);

			let arContent = $('mark > a').text().trim();
			if (arContent && arContent.length > 0) {
				callback(arContent);
			} else {
				callback(null);
			}
		} else {
			console.log(err);
			callback(null)
		}
	});
}

//collectSureNames('http://www.kuranayetleri.net/');
collectSureContent('http://www.kuranayetleri.net/fatiha-suresi', (sureContent) => {
	console.log(JSON.stringify(sureContent))
});