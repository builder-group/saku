import React from 'react';
import { type TPageContext } from '../lib';

export const PageTracking: React.FC<TPageTrackingProps> = ({ cx }) => {
	const { ga4MeasurementId, metaPixelId } = cx.integrations.tracking;

	return (
		<>
			{ga4MeasurementId != null && (
				<>
					{/* GA4: async loader + inline queue init. gtag('config') auto-fires page_view.
					    https://developers.google.com/tag-platform/gtagjs/install */}
					<script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`} />
					<script
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};gtag('js',new Date());gtag('config',${JSON.stringify(ga4MeasurementId)});`
						}}
					/>
				</>
			)}
			{metaPixelId != null && (
				<>
					{/* Meta Pixel: standard base code IIFE — bootstraps fbq stub, loads fbevents.js async, fires PageView.
					    https://developers.facebook.com/docs/meta-pixel/get-started */}
					<script
						dangerouslySetInnerHTML={{
							__html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(metaPixelId)});fbq('track','PageView');`
						}}
					/>
				</>
			)}
		</>
	);
};

interface TPageTrackingProps {
	cx: TPageContext;
}
