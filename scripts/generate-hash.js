// Run this once to generate a hash for your admin password:
//   node scripts/generate-hash.js "YourRealPasswordHere"
//
// Copy the printed hash into your .env file as ADMIN_PASSWORD_HASH.
// Then delete this file's password from your terminal history if you're
// worried about it, and never commit .env to git.

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Usage: node scripts/generate-hash.js "YourPassword"');
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log('\nAdd this line to your .env file:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
});
