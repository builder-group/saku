import { Await, useLoaderData } from '@remix-run/react';
import { Text } from '@shopify/polaris';
import React from 'react';
import { TLoaderFunction } from '@/types';

// https://reactrouter.com/how-to/suspense

const Page: React.FC = () => {
	const { nodes } = useLoaderData<typeof loader>();

	return (
		<div className="p-4">
			<Text as="h1" variant="headingXl" alignment="center">
				Node System Demo
			</Text>

			<div className="mt-8 space-y-4">
				{nodes.map((node) => (
					<Node key={node.id} node={node as TNode} />
				))}
			</div>
		</div>
	);
};

export default Page;

const Node: React.FC<{
	node: TNode;
	isCached?: boolean;
}> = (props) => {
	const { node, isCached = false } = props;

	switch (node.type) {
		case 'text':
			return (
				<div className="rounded-md border p-4">
					<div className="flex items-center justify-between">
						<Text as="p">{node.content}</Text>
						{isCached && (
							<Text as="span" tone="subdued">
								(Cached)
							</Text>
						)}
					</div>
				</div>
			);

		case 'weather':
			return (
				<div className="rounded-md border p-4">
					<div className="flex items-center justify-between">
						<div>
							<Text as="p" variant="headingMd">
								{node.location}
							</Text>
							<Text as="p" variant="headingLg">
								{node.temperature}°C - {node.condition}
							</Text>
						</div>
						{isCached && (
							<Text as="span" tone="subdued">
								(Cached)
							</Text>
						)}
					</div>
				</div>
			);

		case 'product':
			return (
				<div className="rounded-md border p-4">
					<div className="flex items-center justify-between">
						<div>
							<Text as="p" variant="headingMd">
								{node.name}
							</Text>
							<Text as="p" variant="headingLg">
								${node.price.toFixed(2)}
							</Text>
						</div>
						{isCached && (
							<Text as="span" tone="subdued">
								(Cached)
							</Text>
						)}
					</div>
				</div>
			);

		case 'promise':
			return (
				<React.Suspense fallback={<Node node={node.cached} isCached />}>
					<Await
						resolve={node.next}
						errorElement={
							<Text as="p" tone="critical">
								Error loading node {node.id}
							</Text>
						}
					>
						{(resolvedNode) => <Node node={resolvedNode} />}
					</Await>
				</React.Suspense>
			);
	}
};

const nodeLoaders: {
	weather: TNodeLoader<TWeatherNode>;
	product: TNodeLoader<TProductNode>;
} = {
	weather: async (node: TWeatherNode) => {
		await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000));
		const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Stormy'];
		const randomIndex = Math.floor(Math.random() * conditions.length);

		return {
			...node,
			temperature: Math.floor(Math.random() * 30) + 10, // Random temp between 10-40°C
			condition: conditions[randomIndex] as string
		};
	},
	product: async (node: TProductNode) => {
		await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000));
		return {
			...node,
			price: Math.floor(Math.random() * 10000) / 100
		};
	}
};

const initialNodes: TNode[] = [
	{
		id: '1',
		type: 'text',
		content: 'This is a static text node (no loader)'
	},
	{
		id: '2',
		type: 'weather',
		location: 'Tokyo',
		temperature: 25,
		condition: 'Sunny'
	},
	{
		id: '3',
		type: 'product',
		name: 'Sample Product',
		price: 99.99
	},
	{
		id: '4',
		type: 'text',
		content: 'Another static text node'
	},
	{
		id: '5',
		type: 'weather',
		location: 'London',
		temperature: 18,
		condition: 'Rainy'
	}
];

export const loader: TLoaderFunction<{ nodes: TNode[] }> = async () => {
	return {
		nodes: initialNodes.map((node) => {
			switch (node.type) {
				case 'weather':
					return {
						id: node.id,
						type: 'promise',
						cached: node,
						next: nodeLoaders.weather(node)
					};
				case 'product':
					return {
						id: node.id,
						type: 'promise',
						cached: node,
						next: nodeLoaders.product(node)
					};
				default:
					return node;
			}
		})
	};
};

interface TBaseNode {
	id: string;
	type: string;
}

interface TTextNode extends TBaseNode {
	type: 'text';
	content: string;
}

interface TWeatherNode extends TBaseNode {
	type: 'weather';
	location: string;
	temperature: number;
	condition: string;
}

interface TProductNode extends TBaseNode {
	type: 'product';
	name: string;
	price: number;
}

interface TPromisedNode extends TBaseNode {
	type: 'promise';
	cached: TTextNode | TWeatherNode | TProductNode;
	next: Promise<TTextNode | TWeatherNode | TProductNode>;
}

type TNode = TTextNode | TWeatherNode | TProductNode | TPromisedNode;

type TNodeLoader<T extends TWeatherNode | TProductNode> = (node: T) => Promise<T>;
