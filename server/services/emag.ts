import puppeteer from 'puppeteer';
import $ from 'cheerio';

const url = 'https://www.emag.ro/search/telefoane-mobile/';

async function getProducts(search: string) {
	const data: ScrapperData[] = [];
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(`${url}${search}`);
	const html = await page.content();

	browser.close();

	const products = $('.js-product-data', html);

	products.each(function () {
		const title = $('h2.product-title-zone', $(this).html()).text().trim();
		const priceOld = $('.product-old-price', $(this).html()).text().trim();
		const priceNew = $('.product-new-price', $(this).html()).text().trim();
		const thumb = $('.thumbnail img', $(this).html()).attr('src')?.trim?.();

		data.push({
			title,
			price: {
				old: priceOld,
				new: priceNew,
			},
			image: thumb,
		});
	});

	return { emag: data };
}

export default getProducts;

interface ScrapperData {
	title: string;
	price: {
		old: string;
		new: string;
	};
	image: 'string';
}
