import { TClassicProductNodeBundle } from '@repo/editor';
import { Err, Ok, TResult } from 'tuple-result';
import { AppError, computeInnerBorderRadius } from '@/lib';
import { TNodeResolveContext } from '../../../../lib';
import {
	resolveAppearanceStyleMixin,
	resolveAutoLayoutStyleMixin,
	resolveBadgeStyleMixin,
	resolveButtonStyleMixin,
	resolveFillStyleMixin,
	resolveImageStyleMixin,
	resolveProductDetailsStyleMixin,
	resolveShadowStyleMixin,
	resolveSingleProductNodeContentMixin,
	resolveStrokeStyleMixin,
	resolveTextStyleMixin
} from '../../../../mixins';
import { TResolvedClassicProductNodeBundle } from '../../types';

export function resolveClassicBundle(
	node: TClassicProductNodeBundle,
	cx: TNodeResolveContext
): TResult<TResolvedClassicProductNodeBundle, AppError> {
	const {
		content,
		autoLayout,
		appearance,
		fill,
		stroke,
		shadow,
		textBody,
		buttonPrimary,
		badgeSecondary,
		badgeNeutral,
		image,
		productDetails,
		...rest
	} = node;

	// Resolve content
	const [isResolvedContentOk, resolvedContentErr, resolvedContent] =
		resolveSingleProductNodeContentMixin(content, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedContentOk) {
		return Err(resolvedContentErr.wrapWith('#ERR_RESOLVE_SINGLE_PRODUCT_NODE_CONTENT'));
	}

	// Resolve styles
	const [isResolvedAutoLayoutOk, resolvedAutoLayoutErr, resolvedAutoLayout] =
		resolveAutoLayoutStyleMixin(autoLayout, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedAutoLayoutOk) {
		return Err(resolvedAutoLayoutErr.wrapWith('#ERR_RESOLVE_AUTO_LAYOUT_STYLE'));
	}
	const [isResolvedAppearanceOk, resolvedAppearanceErr, resolvedAppearance] =
		resolveAppearanceStyleMixin(appearance, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedAppearanceOk) {
		return Err(resolvedAppearanceErr.wrapWith('#ERR_RESOLVE_APPEARANCE_STYLE'));
	}
	const [isResolvedFillOk, resolvedFillErr, resolvedFill] = resolveFillStyleMixin(fill, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedFillOk) {
		return Err(resolvedFillErr.wrapWith('#ERR_RESOLVE_FILL_STYLE'));
	}
	const [isResolvedStrokeOk, resolvedStrokeErr, resolvedStroke] = resolveStrokeStyleMixin(stroke, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedStrokeOk) {
		return Err(resolvedStrokeErr.wrapWith('#ERR_RESOLVE_STROKE_STYLE'));
	}
	const [isResolvedShadowOk, resolvedShadowErr, resolvedShadow] = resolveShadowStyleMixin(shadow, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedShadowOk) {
		return Err(resolvedShadowErr.wrapWith('#ERR_RESOLVE_SHADOW_STYLE'));
	}
	const [isResolvedTextBodyOk, resolvedTextBodyErr, resolvedTextBody] = resolveTextStyleMixin(
		textBody,
		{
			node: cx,
			tokenMap: cx.site.getTokenMap()
		}
	);
	if (!isResolvedTextBodyOk) {
		return Err(resolvedTextBodyErr.wrapWith('#ERR_RESOLVE_TEXT_BODY_STYLE'));
	}
	const [isResolvedButtonPrimaryOk, resolvedButtonPrimaryErr, resolvedButtonPrimary] =
		resolveButtonStyleMixin(buttonPrimary, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedButtonPrimaryOk) {
		return Err(resolvedButtonPrimaryErr.wrapWith('#ERR_RESOLVE_BUTTON_PRIMARY_STYLE'));
	}
	const [isResolvedBadgeSecondaryOk, resolvedBadgeSecondaryErr, resolvedBadgeSecondary] =
		resolveBadgeStyleMixin(badgeSecondary, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedBadgeSecondaryOk) {
		return Err(resolvedBadgeSecondaryErr.wrapWith('#ERR_RESOLVE_BADGE_SECONDARY_STYLE'));
	}
	const [isResolvedBadgeNeutralOk, resolvedBadgeNeutralErr, resolvedBadgeNeutral] =
		resolveBadgeStyleMixin(badgeNeutral, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedBadgeNeutralOk) {
		return Err(resolvedBadgeNeutralErr.wrapWith('#ERR_RESOLVE_BADGE_NEUTRAL_STYLE'));
	}
	const [isResolvedImageOk, resolvedImageErr, resolvedImage] = resolveImageStyleMixin(image, {
		node: cx,
		tokenMap: cx.site.getTokenMap()
	});
	if (!isResolvedImageOk) {
		return Err(resolvedImageErr.wrapWith('#ERR_RESOLVE_IMAGE_STYLE'));
	}
	const [isResolvedProductDetailsOk, resolvedProductDetailsErr, resolvedProductDetails] =
		resolveProductDetailsStyleMixin(productDetails, {
			node: cx,
			tokenMap: cx.site.getTokenMap()
		});
	if (!isResolvedProductDetailsOk) {
		return Err(resolvedProductDetailsErr.wrapWith('#ERR_RESOLVE_PRODUCT_DETAILS_STYLE'));
	}

	const imageBorderRadius =
		resolvedImage.appearance.borderRadius ??
		computeInnerBorderRadius(
			resolvedAppearance.borderRadius ?? 0,
			Math.max(
				resolvedAutoLayout.paddingTop ?? 0,
				resolvedAutoLayout.paddingRight ?? 0,
				resolvedAutoLayout.paddingBottom ?? 0,
				resolvedAutoLayout.paddingLeft ?? 0
			)
		);

	return Ok({
		...rest,
		content: resolvedContent,
		autoLayout: resolvedAutoLayout,
		appearance: resolvedAppearance,
		fill: resolvedFill,
		stroke: resolvedStroke,
		shadow: resolvedShadow,
		textBody: resolvedTextBody,
		buttonPrimary: resolvedButtonPrimary,
		badgeSecondary: resolvedBadgeSecondary,
		badgeNeutral: resolvedBadgeNeutral,
		image: {
			...resolvedImage,
			appearance: {
				...resolvedImage.appearance,
				borderRadius: imageBorderRadius,
				styles: {
					...resolvedImage.appearance.styles,
					borderRadius: `${imageBorderRadius}px`
				}
			},
			styles: {
				...resolvedImage.appearance.styles,
				borderRadius: `${imageBorderRadius}px`
			}
		},
		productDetails: resolvedProductDetails
	});
}
