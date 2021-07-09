import axios from 'axios';

const url = 'https://fenrir.altex.ro/catalog/search';

async function getProducts(search: string) {
	const { data } = await axios({
		method: 'GET',
		url: `${url}/${search.replaceAll(' ', '%20')}`,
		params: {
			filter: 'cat:283-telefoane',
		},
		headers: {
			'Accept-Encoding': 'gzip',
		},
	});

	return {
		altex: data.products.map((item) => ({
			title: item.name,
			price: {
				old: item.regular_price,
				new: item.price,
			},
			image: item.thumbnail,
		})),
	};
}

export default getProducts;

interface ScrapperData {
	title: string;
	price: {
		old: string;
		new: string;
	};
}
