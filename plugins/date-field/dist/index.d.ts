import { QuartzTransformerPlugin } from '@quartz-community/types';

/**
 * Blog posts use `date:` in frontmatter, but CreatedModifiedDate only reads
 * created/modified/published. Copy date → modified before that plugin runs.
 */
declare const DateField: QuartzTransformerPlugin;

export { DateField };
