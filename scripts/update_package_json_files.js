const fs = require('fs')
const execa = require('execa')

function bumpVersionInVSCodeRepo({ version, name, displayName, preview }) {
  const vscodePackageJsonPath = './packages/vscode/package.json'
  let content = fs.readFileSync(vscodePackageJsonPath, { encoding: "utf-8" })
  content['version'] = version
  content['name'] = name
  content['displayName'] = displayName
  content['preview'] = preview
  fs.writeFileSync(vscodePackageJsonPath, content)
}

function bumpLSPVersionInExtension({version}) {
  const vscodePackageJsonPath = './packages/vscode/package.json'
  let content = fs.readFileSync(vscodePackageJsonPath, { encoding: "utf-8" })
  content['dependencies']['test-philodendron-language-server'] = version
  fs.writeFileSync(vscodePackageJsonPath, content)
}

function bumpVersionsInRepo({ channel, newExtensionVersion, newPrismaVersion = '' }) {
  const languageServerPackageJsonPath = './packages/vscode/package.json'
  const rootPackageJsonPath = './package.json'

  // update version in packages/vscode folder
  if (channel === 'dev' || channel === 'patch-dev') {
    // change name, displayName, description and preview flag to Insider extension
    bumpVersionInVSCodeRepo({
      version: newExtensionVersion,
      name: "philodendron-insider",
      displayName: "Philodendron - Insider",
      preview: true
    })
  } else {
    bumpVersionInVSCodeRepo({
      version: newExtensionVersion,
      name: "philodendron",
      displayName: "Philodendron",
      preview: false
    })
  }

  // update Prisma CLI version in packages/language-server folder
  if (newPrismaVersion !== '') {
    (async () => {
      const { stdout } = await execa('npx', ['-q', `@prisma/cli@2.6.0`, 'version', '--json']);
      let json = JSON.parse(stdout)
      let sha = json["format-binary"].split(/\s+/).slice(1)[0]
      let languageServerPackageJson = fs.readFileSync(
        languageServerPackageJsonPath, { encoding: "utf-8" }
      );
      languageServerPackageJson['prisma']['version'] = sha
      languageServerPackageJson['dependencies']['@prisma/get-platform'] = newPrismaVersion
      fs.writeFileSync(languageServerPackageJsonPath, languageServerPackageJson)
    })();
  }

  // update version in root package.json 
  let rootPackageJson = fs.readFileSync(rootPackageJson, { encoding: "utf-8" })
  rootPackageJson['version'] = newExtensionVersion
  fs.writeFileSync(rootPackageJsonPath, rootPackageJson)
}

module.exports = { bumpVersionsInRepo }

if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.length === 3) {
    bumpVersionsInRepo({
      channel: args[0],
      newExtensionVersion: args[1],
      newPrismaVersion: args[2]
    })
  } else if (args.length === 2) {
    bumpVersionsInRepo({
      channel: args[0],
      newExtensionVersion: args[1]
    })
  } else if (args.length === 1) {
    // only bump LSP version in extension
    bumpLSPVersionInExtension({
      nextLSPVersion: args[0]
    })
  } else {
    throw new Error(`Expected 1, 2 or 3 arguments, but received ${args.length}.`)
  }
}