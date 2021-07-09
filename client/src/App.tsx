import axios from 'axios';
import React, { useEffect, useState } from 'react';

function App() {
	const [data, setData] = useState(null);
	const [search, setSearch] = useState('');
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {}, [search]);

	function getData() {
		setLoading(true);
		axios.get(`/api/get-products?search=${search}`).then((reply) => {
			setData(reply.data);
			setLoading(false);
		});
	}

	return (
		<div>
			<input
				readOnly={isLoading}
				type='text'
				onChange={(e) => setSearch(e.target.value)}
				value={search}
			/>
			<button disabled={isLoading} onClick={() => getData()}>
				Search
			</button>

			<div style={{ display: 'flex' }}>
				<div>
					<h2>Emag Data</h2>
					<table>
						<thead>
							<th>Image</th>
							<th>Title</th>
							<th>Price Old</th>
							<th>Price New</th>
						</thead>
						<tbody>
							{data?.emag.map?.((item, index) => (
								<tr key={index}>
									<td>
										<img width='100' src={`${item.image}`} alt='' />{' '}
									</td>
									<td>{item.title}</td>
									<td>{item.price.old || '-'}</td>
									<td>{item.price.new || '-'}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div>
					<h2>Altex Data</h2>
					<table>
						<thead>
							<th>Image</th>
							<th>Title</th>
							<th>Price Old</th>
							<th>Price New</th>
						</thead>
						<tbody>
							{data?.altex.map?.((item, index) => (
								<tr key={index}>
									<td>
										<img width='100' src={`https://cdna.altex.ro${item.image}`} alt='' />{' '}
									</td>
									<td>{item.title}</td>
									<td>{item.price.old || '-'}</td>
									<td>{item.price.new || '-'}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default App;
