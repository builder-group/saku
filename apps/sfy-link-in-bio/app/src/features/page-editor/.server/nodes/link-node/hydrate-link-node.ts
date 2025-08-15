import { Err, Ok, TResult } from '@blgc/utils';
import { TLinkNode } from '@repo/editor';
import { AppError } from '@/lib';
import { resolveLinkNode, TResolvedLinkNode, TResolvedPromisedNode } from '../../../nodes';
import { TNodeHydrateContext } from '../../lib';

export function hydrateLinkNode(
	node: TLinkNode,
	cx: TNodeHydrateContext
): TResult<TResolvedPromisedNode<TResolvedLinkNode>, AppError> {
	const resolveLinkNodeResult = resolveLinkNode(node, cx);
	if (resolveLinkNodeResult.isErr()) {
		return Err(AppError.wrap(resolveLinkNodeResult.error, '#ERR_RESOLVE_LINK_NODE'));
	}

	return Ok({
		type: 'promised',
		id: node.id,
		cached: resolveLinkNodeResult.value,
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
			).unwrap();
		})()
	});
}
