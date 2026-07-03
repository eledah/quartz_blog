export { _ as BasesBody } from '../BasesBody-B4CEJjEp.js';
import { ComponentChild } from 'preact';
import { BasesView } from '../types.js';
import '@quartz-community/types';

interface ViewSelectorProps {
    views: BasesView[];
    activeIndex: number;
    locale: string;
}
declare function ViewSelector({ views, activeIndex }: ViewSelectorProps): ComponentChild;

export { ViewSelector };
