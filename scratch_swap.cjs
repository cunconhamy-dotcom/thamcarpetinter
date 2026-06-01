const fs = require('fs');
const file = 'src/PublicApp.tsx';
const code = fs.readFileSync(file, 'utf8');

const newsStart = code.indexOf('{/* NEWS SECTION');
const newsEnd = code.indexOf('</section>', newsStart) + '</section>'.length;
const newsSection = code.substring(newsStart, newsEnd);

const valueStart = code.indexOf('{/* VALUE & SPEC');
const valueEnd = code.indexOf('</section>', valueStart) + '</section>'.length;
const valueSection = code.substring(valueStart, valueEnd);

if (newsStart > -1 && valueStart > newsStart) {
  const beforeNews = code.substring(0, newsStart);
  const between = code.substring(newsEnd, valueStart);
  const afterValue = code.substring(valueEnd);

  const newCode = beforeNews + valueSection + between + newsSection + afterValue;
  fs.writeFileSync(file, newCode);
  console.log('Swapped successfully');
} else {
  console.log('Error finding sections or already swapped');
}
