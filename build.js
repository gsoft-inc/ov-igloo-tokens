import fs from 'fs';
import path from 'path';
import StyleDictionary from 'style-dictionary';

const dirname = path.dirname('');

function copyFontFace() {
  const sourceFile = path.join(dirname, 'assets/fonts/', 'fonts.css');
  const outputFile = path.join(dirname, 'dist', 'fonts.css');

  fs.copyFile(sourceFile, outputFile, function (err) {
    if (err) {
      throw err;
    } else {
      console.log('🎉 Success! fonts copied\n');
    }
  });
}

console.log('\nBuild started...');

// REGISTER THE CUSTOM TRANFORMS

StyleDictionary.registerTransform({
  name: 'pxToRem',
  type: 'value',
  matcher: function (token) {
    return (
      token.attributes.type === 'size' ||
      token.attributes.category === 'space' ||
      token.attributes.category === 'border-radius'
    );
  },
  transformer: function (token) {
    if (parseInt(token.original.value) === 0) {
      return token.original.value;
    }

    const base = 10;
    return `${parseInt(token.value) / base}rem`;
  },
});

// REGISTER THE CUSTOM TRANFORM GROUPS

StyleDictionary.registerTransformGroup({
  name: 'custom/scss',
  transforms: StyleDictionary.transformGroup['scss'].concat(['pxToRem']),
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: StyleDictionary.transformGroup['css'].concat(['pxToRem']),
});

// APPLY THE CONFIGURATION

const StyleDictionaryExtended = StyleDictionary.extend(
  `${dirname}/config.json`
);

// FINALLY, BUILD ALL THE PLATFORMS

StyleDictionaryExtended.buildAllPlatforms();

console.log('\n🚀 Build completed!\n');

copyFontFace();
