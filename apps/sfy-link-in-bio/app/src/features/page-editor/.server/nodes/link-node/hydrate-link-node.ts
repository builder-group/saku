import { TLinkNode } from '@repo/editor';
import { resolveLinkNode } from '../../../nodes';
import { TResolvedLinkNode, TResolvedPromisedNode } from '../../../types';
import { TNodeHydrateContext } from '../../lib';

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

			// const result = await coreApiClient.get('/v1/url/metadata', {
			// 	queryParams: { url: content.url },
			// 	requestMiddlewares: [accessSecretMiddleware]
			// });
			// if (result.isErr()) {
			// 	return resolveLinkNode(node, cx);
			// }

			// const urlMetadata = result.value.data;
			// const faviconHash =
			// 	urlMetadata.icons?.favicon != null
			// 		? (editor.registerImage(urlMetadata.icons.favicon, 'favicon') ?? undefined)
			// 		: undefined;

			return resolveLinkNode(
				{
					content,
					...rest
				},
				cx
			);
		})()
	};
}
