import { Banner, BannerProps } from '@shopify/polaris';
import { useFeatureState, withLocalStorage } from 'feature-react';
import { createState } from 'feature-state';
import React from 'react';
import { appConfig } from '@/environment';

export const PersistableBanner: React.FC<TPersistableBannerProps> = (props) => {
	const { storageKey, children, className, ...bannerProps } = props;

	const bannerState = React.useMemo(
		() => withLocalStorage(createState(true), appConfig.localStorageKey(storageKey)),
		[storageKey]
	);
	const isVisible = useFeatureState(bannerState);

	React.useEffect(() => {
		bannerState.persist();
	}, [bannerState]);

	if (!isVisible) {
		return null;
	}

	return (
		<div className={className}>
			<Banner {...bannerProps} onDismiss={() => bannerState.set(false)}>
				{children}
			</Banner>
		</div>
	);
};

interface TPersistableBannerProps extends BannerProps {
	storageKey: string;
	className?: string;
}
