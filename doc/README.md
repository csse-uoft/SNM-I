# SNM-I Documentation

## Contributing
- All pages are under `src/content/docs/`
- The url of the page should be similar to the path of the file
- When using internal hyperlinks, end the url with `/`
- If you are adding new pages, remember to edit `astro.config.mjs`
  to add the new page to the side bar.
  You don't have to do this if you are adding a reference page

## Preview documentation
All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `yarn install`            | Installs dependencies                            |
| `yarn dev`                | Starts local dev server at `localhost:3000`      |
| `yarn build`              | Build your production site to `./dist/`          |
| `yarn preview`            | Preview your build locally, before deploying     |
| `yarn astro ...`          | Run CLI commands like `astro add`, `astro check` |
| `yarn astro -- --help`    | Get help using the Astro CLI                     |
