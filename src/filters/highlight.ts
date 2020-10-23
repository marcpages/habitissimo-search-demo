export default function (word: string, query: string) {
  const check = new RegExp(query, 'ig');
  return word.toString()
   .replace(check, function (matchedText) {
     return ('<strong>' + matchedText + '</strong>');
   });
};
