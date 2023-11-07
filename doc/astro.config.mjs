import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	base: '/docs',
	integrations: [
		starlight({
			title: 'SNM-I',
			editLink: {
				baseUrl: 'https://github.com/csse-uoft/SNM-I/edit/master/doc',
			},
			social: {
				github: 'https://github.com/csse-uoft/SNM-I',
			},
			sidebar: [
				{
					label: 'Start here',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Introduction', link: '/introduction' },
						{ label: 'Project setup', link: '/project-setup' },
						{ label: 'External dependencies', link: '/external-dependencies' },
						{ label: 'Project structure', link: '/project-structure' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'API', link: '/guides/api' },
						{ label: 'GraphDB utils', link: '/guides/graphdb-utils' },
						{ label: 'Data model', link: '/guides/data-model' },
						{ label: 'Troubleshooting', link: '/guides/troubleshooting' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],

	// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
	image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
