import { Pika } from 'pika-id';

export const pika = new Pika([
	{
		prefix: 'node',
		description: 'Nodes'
	},
	{
		prefix: 'asset',
		description: 'Assets (images, files, etc.)'
	}
]);

export function createId<GPrefix extends TIdPrefix>(prefix: GPrefix): TId<GPrefix> {
	return pika.gen(prefix);
}

export type TIdPrefix = typeof pika extends Pika<infer P> ? P : never;

export type TId<GPrefix extends TIdPrefix> = `${GPrefix}_${string}`;
