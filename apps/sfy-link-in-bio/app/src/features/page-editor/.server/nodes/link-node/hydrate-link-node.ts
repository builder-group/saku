import { TLinkNode } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError } from '@/lib';
import { resolveLinkNode, TResolvedLinkNode, TResolvedPromisedNode } from '../../../nodes';
import { TNodeHydrateContext } from '../../lib';

export function hydrateLinkNode(
	node: TLinkNode,
	cx: TNodeHydrateContext
): TResult<TResolvedPromisedNode<TResolvedLinkNode>, AppError> {
	const [isResolvedLinkNodeOk, resolvedLinkNodeErr, resolvedLinkNode] = resolveLinkNode(node, cx);
	if (!isResolvedLinkNodeOk) {
		return Err(resolvedLinkNodeErr.wrapWith('#ERR_RESOLVE_LINK_NODE'));
	}

	return Ok({
		type: 'promised',
		composition: 'default',
		id: node.id,
		cached: resolvedLinkNode,
		next: (async () => {
			const { content, ...rest } = node;

			// TODO: Refetch link data

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
				} as TLinkNode,
				cx
			).unwrap();
		})()
	});
}
