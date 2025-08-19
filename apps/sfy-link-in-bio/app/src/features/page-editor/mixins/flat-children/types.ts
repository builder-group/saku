import { TMixin } from '@repo/editor';
import { TResolvedNode } from '../../types';

export type TResolvedChildrenMixin = TMixin<'children', TResolvedNode[]>;
