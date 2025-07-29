import { TResolvedAboutNode, TResolvedNode, TResolvedSite } from '@/features/page-editor';

export function extractSiteMetadata(site: TResolvedSite): { title: string; description: string } {
	let title = 'Link in Bio - Saku';
	let description = 'Check out this link in bio page created with Saku';

	const aboutNode = findAboutNode(site.root);
	if (aboutNode != null) {
		title = aboutNode.content.name;
		if (aboutNode.content.bio != null) {
			description = aboutNode.content.bio;
		}
	}

	return { title, description };
}

function findAboutNode(node: TResolvedNode): TResolvedAboutNode | null {
	if (node.type === 'about') {
		return node as TResolvedAboutNode;
	}

	if (node.type === 'page') {
		for (const child of node.children) {
			const aboutNode = findAboutNode(child);
			if (aboutNode != null) {
				return aboutNode;
			}
		}
	}

	return null;
}
