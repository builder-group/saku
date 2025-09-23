import { deepCopy } from '@blgc/utils';
import { isTokenRef, mapTokenRef, TFillStyleMixin, TTokenRef, TUnreferenceTop } from '@repo/editor';
import { Button, Text } from '@shopify/polaris';
import { useCompute } from 'feature-react';
import { TState } from 'feature-state';
import React from 'react';
import { unwrapOrUndefined } from 'tuple-result';
import { Badge, LinkIcon, LinkOffIcon, PolarisMinusIcon, PolarisPlusIcon } from '@/components';
import { useMapState } from '@/hooks';
import { TokenActionOverlay, TokenPaintInput, TTokenPaintInputPaintType } from '../../components';
import { resolveTokenRef, TPageEditor } from '../../lib';

export const FillStyleMixinEditor = (props: TFillStyleMixinEditorProps) => {
	const { state, ref, disabledTokenLink = false, editor, allowedPaintTypes } = props;

	const isLinked = useCompute(state, ({ value }) => isTokenRef(value), []);
	const isSet = useCompute(
		state,
		({ value }) =>
			unwrapOrUndefined(resolveTokenRef(value, { tokenMap: editor.tokenMap._v })) != null,
		[editor]
	);

	const paintState = useMapState(state, {
		map(baseValue) {
			if (isTokenRef(baseValue)) {
				return mapTokenRef(baseValue, 'paint');
			}
			return baseValue?.paint;
		},
		sync(baseState, mappedValue, notifyOptions) {
			if (
				baseState._v != null &&
				!isTokenRef(baseState._v) &&
				mappedValue != null &&
				!isTokenRef(mappedValue)
			) {
				baseState._v.paint = mappedValue;
				baseState._notify(notifyOptions);
			}
		}
	});

	// =========================================================================
	// Events
	// =========================================================================

	const handleAddFill = React.useCallback(() => {
		const [isResolvedTokenOk, , resolvedToken] = resolveTokenRef(state._v, {
			tokenMap: editor.tokenMap._v
		});
		if (isResolvedTokenOk) {
			state._v =
				resolvedToken != null
					? deepCopy(resolvedToken)
					: {
							paint: {
								type: 'solid',
								color: { r: 255, g: 255, b: 255, a: 1 }
							},
							opacity: 1
						};
			state._notify();
		}
	}, [editor, state]);

	const handleRemoveFill = React.useCallback(() => {
		state._v = null;
		state._notify();
	}, [state]);

	const handleToggleTokenLink = React.useCallback(() => {
		if (isLinked) {
			const [isResolvedTokenOk, , resolvedToken] = resolveTokenRef(state._v, {
				tokenMap: editor.tokenMap._v
			});
			if (isResolvedTokenOk) {
				state._v = deepCopy(resolvedToken);
				state._notify();
			}
		} else {
			state._v = ref;
			state._notify();
		}
	}, [isLinked, state, editor, ref]);

	const handleNavigateToToken = React.useCallback(() => {
		editor.switchView('settings');
	}, [editor]);

	// =========================================================================
	// UI
	// =========================================================================

	return (
		<div className="space-y-3 px-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{/* Mixin-level inheritance button */}
					{!disabledTokenLink && (
						<button
							type="button"
							onClick={handleToggleTokenLink}
							className="flex cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100"
							title={isLinked ? 'Unlink' : 'Link'}
						>
							{isLinked ? (
								<LinkOffIcon className="h-3.5 w-3.5" />
							) : (
								<LinkIcon className="h-3.5 w-3.5" />
							)}
						</button>
					)}

					<div className="flex items-center gap-2">
						<Text as="span" variant="headingXs" tone="subdued">
							Fill
						</Text>
						{isLinked && (
							<Badge className="group relative hover:w-32">
								Linked
								<TokenActionOverlay
									variant={'full-overlay'}
									onUnlink={handleToggleTokenLink}
									onNavigateToToken={handleNavigateToToken}
								/>
							</Badge>
						)}
					</div>
				</div>

				{/* Add/Remove fill buttons */}
				{isSet ? (
					<Button icon={PolarisMinusIcon} onClick={handleRemoveFill} variant="plain" size="micro" />
				) : (
					<Button icon={PolarisPlusIcon} onClick={handleAddFill} variant="plain" size="micro" />
				)}
			</div>

			{isSet && (
				<TokenPaintInput
					label="Paint"
					state={paintState}
					tokenMap={editor.tokenMap}
					onLinkToken={() => {
						handleToggleTokenLink();
						return { preventDefault: true };
					}}
					onUnlinkToken={() => {
						handleToggleTokenLink();
						return { preventDefault: true };
					}}
					onNavigateToToken={handleNavigateToToken}
					disabledTokenLink={disabledTokenLink}
					editor={editor}
					allowedPaintTypes={allowedPaintTypes}
				/>
			)}
		</div>
	);
};

interface TFillStyleMixinEditorProps {
	state: TState<TFillStyleMixin['value'], any>;
	ref: TTokenRef<TUnreferenceTop<TFillStyleMixin['value']>>;
	disabledTokenLink?: boolean;
	editor: TPageEditor;
	allowedPaintTypes?: TTokenPaintInputPaintType[];
}
