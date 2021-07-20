import fs from 'fs';
import path from 'path';
import StyleDictionary from 'style-dictionary';

const dirname = path.dirname('');

const copyFontFace = () => {
  const sourceFile = path.join(dirname, 'assets/fonts/', 'fonts.css');
  const outputFile = path.join(dirname, 'dist', 'fonts.css');

  fs.copyFile(sourceFile, outputFile, function (err) {
    if (err) {
      throw err;
    } else {
      console.log('🎉 Success! fonts copied\n');
    }
  });
};

const handleGroups = (datas) => {
  if (!datas) {
    return;
  }

  const groups = datas.map((token) => token.group);
  const filtredGroups = groups.filter((group) => group !== undefined);
  const uniqueGroups = [...new Set(filtredGroups)];

  return uniqueGroups;
};

console.log('\nBuild started...');

// REGISTER THE CUSTOM FORMAT

StyleDictionary.registerFormat({
  name: 'json',
  formatter: function ({ dictionary }) {
    const groups = handleGroups(dictionary.allTokens);

    const formatTokens = (tokens, group) => {
      const formatedTokens = tokens.map((token) => {
        const result = {};
        result[token.name] = token.value;

        return result;
      });

      return { [group]: formatedTokens };
    };

    const datas = groups.map((group) => {
      const data = dictionary.allTokens.filter((token) => {
        return token.group === group;
      });

      return formatTokens(data, group);
    });

    return JSON.stringify(datas, null, 2);
  },
});

StyleDictionary.registerFormat({
  name: 'custom/doc',
  formatter: function ({ dictionary }) {
    const groups = handleGroups(dictionary.allTokens);

    const datas = groups.map((group) => {
      const formatedGroup = group.charAt(0).toUpperCase() + group.slice(1);
      let header = `\n/**\n * @tokens ${formatedGroup}\n * @presenter ${formatedGroup} \n */\n`;
      const data = dictionary.allTokens.filter((token) => {
        return token.group === group;
      });

      if (group === 'mediaQuery' || group === 'shadow' || group === 'zIndex') {
        header = `\n/**\n * @tokens ${formatedGroup} \n */\n`;
      }

      return {
        header,
        data,
      };
    });

    const storybookDocs = datas
      .map(function (tokens) {
        return (
          tokens.header +
          tokens.data
            .map((props) => `$${props.name}: ${props.value};`)
            .join('\n')
        );
      })
      .join('\n');

    return storybookDocs;
  },
});

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
