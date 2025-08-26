import { TBaseMixin } from '@repo/editor';
import { TResolvedNode } from '../../types';

export type TResolvedChildrenMixin = TBaseMixin<'children', TResolvedNode[]>;
