const tests = [];

function describe(name, fn) {
  console.log(`\n${name}\n`);
  fn();
}

function it(name, fn) {
  tests.push({ name, fn });
  run(name, fn);
}

function run(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(e.stack);
  }
}

const files = process.argv.slice(2);

global.it = it;
global.describe = describe;

files.forEach((file) => {
  require(file);
});
