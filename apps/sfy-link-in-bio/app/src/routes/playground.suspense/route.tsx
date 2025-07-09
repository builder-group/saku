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

export const loader: TLoaderFunction<{ nodes: TNode[] }> = async () => {
	const textNode: TTextNode = {
		id: '1',
		type: 'text',
		content: 'This is a text node'
	};
	const productNode: TProductNode = {
		id: '2',
		type: 'product',
		name: 'Sample Product',
		price: 99.99
	};

	const promisedTextNode: TPromisedNode = {
		id: '3',
		type: 'promise',
		cached: textNode,
		next: fetchUpdatedNode(textNode)
	};
	const promisedProductNode: TPromisedNode = {
		id: '4',
		type: 'promise',
		cached: productNode,
		next: fetchUpdatedNode(productNode)
	};

	return {
		nodes: [textNode, productNode, promisedTextNode, promisedProductNode]
	};
};

async function fetchUpdatedNode(node: TTextNode | TProductNode): Promise<TTextNode | TProductNode> {
	await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000));

	switch (node.type) {
		case 'product':
			return {
				...node,
				price: Math.floor(Math.random() * 10000) / 100
			};

		case 'text':
			return {
				...node,
				content: `${node.content} (Updated at ${new Date().toLocaleTimeString()})`
			};
	}
}

interface TBaseNode {
	id: string;
	type: string;
}

interface TTextNode extends TBaseNode {
	type: 'text';
	content: string;
}

interface TProductNode extends TBaseNode {
	type: 'product';
	name: string;
	price: number;
}

interface TPromisedNode extends TBaseNode {
	type: 'promise';
	cached: TTextNode | TProductNode;
	next: Promise<TTextNode | TProductNode>;
}

type TNode = TTextNode | TProductNode | TPromisedNode;
