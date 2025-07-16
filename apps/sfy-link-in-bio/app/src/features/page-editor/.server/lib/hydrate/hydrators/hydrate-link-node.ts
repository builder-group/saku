import { TLinkNode } from '@repo/editor';
import { resolveLinkNode } from '../../../../lib';
import { TResolvedLinkNode, TResolvedPromisedNode } from '../../../../types';
import { TNodeHydrateContext } from '../types';

export function hydrateLinkNode(
	node: TLinkNode,
	cx: TNodeHydrateContext
): TResolvedPromisedNode<TResolvedLinkNode> {
	return {
		type: 'promised',
		id: node.id,
		cached: resolveLinkNode(node, cx),
		next: (async () => {
			const { content, ...rest } = node;
			await new Promise((resolve) => setTimeout(resolve, 3000));

			// TODO: Refetch link metadata

			return resolveLinkNode(
				{
					content: {
						...content,
						userMetadata: {
							...content.userMetadata,
							title:
								content.userMetadata != null
									? `${content.userMetadata.title} (resolved at ${new Date().toISOString()})`
									: undefined
						}
					},
					...rest
				},
				cx
			);
		})()
	};
}
