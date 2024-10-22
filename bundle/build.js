const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');
const postcssUrl = require('postcss-url');
const fs = require('fs');
const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const path = require('path');
const copy = require('rollup-plugin-copy');
const cheerio = require('cheerio');
const crypto = require('crypto');
const textToSVG = require('text-to-svg');
const minify = require('html-minifier').minify;

// Function to strip out inline style elements from <style> to </style>
function stripInlineStyles(htmlContent) {
  return htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
}

// Function to inline SVGs into HTML files
function inlineSVGs(htmlContent, svgDir) {
  const svgFiles = fs.readdirSync(svgDir).filter(file => path.extname(file) === '.svg');
  svgFiles.forEach(svgFile => {
    const svgContent = stripInlineStyles(fs.readFileSync(path.join(svgDir, svgFile), 'utf8'));
    const placeholder = `<!-- inline-svg:${svgFile} -->`;
    htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), svgContent);
  });
  return htmlContent;
}

// Function to optimize SVGs
function optimizeSVGs(svgDir) {
  const svgFiles = fs.readdirSync(svgDir).filter(file => path.extname(file) === '.svg');
  svgFiles.forEach(svgFile => {
    const filePath = path.join(svgDir, svgFile);
    // Run SVGO on each SVG file
    require('child_process').execSync(`svgo ${filePath} --config=svgo.config.js`);
  });
}

// Compile Sass and combine CSS files
async function buildCSS() {
  const sassResult = sass.compile('src/custom.scss', {
    outputStyle: 'compressed'
  });

  const combinedCSS = sassResult.css;
  const cssHash = generateHash(combinedCSS);
  const cssFilename = `bundle-${cssHash}.css`;

  // Get all HTML files in the build directory and its subdirectories
  function getAllHtmlAndSvgFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      
      if (stat && stat.isDirectory()) {
        // Recurse into subdirectory
        results = results.concat(getAllHtmlAndSvgFiles(file));
      } else if (['.html', '.svg'].includes(path.extname(file))) {
        results.push(file);
      }
    });
    
    return results;
  }

  const htmlAndSvgFiles = getAllHtmlAndSvgFiles('src');
  let content = htmlAndSvgFiles.map(file => fs.readFileSync(file, 'utf8')).join('');

  // Process CSS with PostCSS and remove unused CSS
  const result = await postcss([
    autoprefixer,
    cssnano,
    purgecss({
      content: [{ raw: content, extension: 'html' }],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
      safelist: {
        standard: ['codehilite'],
        deep: [/^codehilite$/]
      }
    })
  ]).process(combinedCSS, { from: undefined });

  if (!fs.existsSync('build/css')) {
    fs.mkdirSync('build/css', { recursive: true });
  }
  fs.writeFileSync(`build/css/${cssFilename}`, result.css);
  if (result.map) {
    fs.writeFileSync(`build/css/${cssFilename}.map`, result.map.toString());
  }

  return cssFilename;
}

// Bundle and minify JavaScript
async function buildJS() {
  const bundle = await rollup.rollup({
    input: 'src/custom.js',
    plugins: [
      nodeResolve(),
      commonjs(),
      terser(),
      copy({
        targets: [
          { src: 'src/fonts/*', dest: 'build/css/fonts' }, // Adjust paths as necessary
        ]
      })
    ]
  });

  const { output } = await bundle.generate({
    format: 'iife',
    sourcemap: true
  });

  const jsContent = output[0].code;
  const jsHash = generateHash(jsContent);
  const jsFilename = `bundle-${jsHash}.js`;

  if (!fs.existsSync('build/js')) {
    fs.mkdirSync('build/js', { recursive: true });
  }

  await bundle.write({
    file: `build/js/${jsFilename}`,
    format: 'iife',
    sourcemap: true
  });

  return jsFilename;
}

// Ensure build directory exists
if (!fs.existsSync('build')) {
  fs.mkdirSync('build');
}

// Process HTML to inline SVGs and copy to output directory
async function processHTML(cssFilename, jsFilename) {
  const htmlContent = fs.readFileSync('src/index.html', 'utf8');
  const htmlWithImages = inlineSVGs(htmlContent, 'src/img'); // Assuming SVGs are in 'src/img' directory

  // Replace placeholders with actual filenames
  const updatedHtmlContent = htmlWithImages
    .replace('<!-- CSS_PLACEHOLDER -->', `<link rel="stylesheet" href="css/${cssFilename}">`)
    .replace('<!-- JS_PLACEHOLDER -->', `<script src="js/${jsFilename}"></script>`);

  const inlinedHtmlContent = await generateInlineSVGText(updatedHtmlContent, 'src/fonts/Congenial Regular.ttf');
  fs.writeFileSync('build/index.html', inlinedHtmlContent);
}

// Generate favicon.ico using ImageMagick
async function generateFavicon() {
  const { exec } = require('child_process');
  return new Promise((resolve, reject) => {
    exec('convert ../assets/favicon/*.png build/favicon.ico', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating favicon: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Error: ${stderr}`);
        return reject(new Error(stderr));
      }
      console.log(`Favicon generated: ${stdout}`);
      resolve();
    });
  });
}

const generateInlineSVGText = async (htmlContent, fontPath) => {
  const $ = cheerio.load(htmlContent);
  const svgElements = $('span.inline-svg');

  for (let i = 0; i < svgElements.length; i++) {
    const element = svgElements[i];

    const textToSVGInstance = textToSVG.loadSync(fontPath);
    const text = $(element).text();
    const attributes = { fill: 'currentColor' };
    const options = { x: 0, y: 0, fontSize: 16, anchor: 'top', attributes: attributes };

    const svgTextContent = textToSVGInstance.getSVG(text, options);

    $(element).replaceWith(svgTextContent);
  }

  return $.html();
};


async function copyImages() {
  const imageFiles = fs.readdirSync('../assets/images');
  if (!fs.existsSync('build/img')) {
    fs.mkdirSync('build/img');
  }
  imageFiles.forEach(file => {
    fs.copyFileSync(`../assets/images/${file}`, `build/img/${file}`);
  });
}

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(file => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath); 
      }
    });
  }
}


// Run build processes
async function build() {
  deleteFolderRecursive('build');
  const cssFilename = await buildCSS();
  const jsFilename = await buildJS();
  await processHTML(cssFilename, jsFilename);
  await generateFavicon();
  await copyImages();
  console.log('Build complete.');
}

build();

// Function to generate a short SHA-256 hash
function generateHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
}
