const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'screens', 'admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the <View style={styles.header}> block
  // We'll use a regex that matches from <View style={styles.header}> until its matching </View>
  // Since regex for matching nested tags is hard, we can assume the header block ends with </View> right before the main content scrollview or flatlist, but wait!
  // In DashboardScreen:
  //      <View style={styles.header}>
  //        ...
  //      </View>
  //      <ScrollView ...>
  
  // Let's replace the block using a simpler regex.
  // Match <View style={styles.header}> ... </View> that is immediately followed by <ScrollView, <FlatList, or <View style={styles.content}>
  
  // Actually, we can use a simpler approach. Just read lines, and when we see `<View style={styles.header}>`, we skip lines until we see the matching `</View>` at the same indentation level.
  const lines = content.split('\n');
  let newLines = [];
  let skipMode = false;
  let skipIndent = 0;
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!skipMode) {
      if (line.includes('<View style={styles.header}>')) {
        skipMode = true;
        skipIndent = line.indexOf('<');
        modified = true;
        continue;
      }
      newLines.push(line);
    } else {
      // check if it's the matching </View>
      if (line.trim() === '</View>' && line.indexOf('<') === skipIndent) {
        skipMode = false;
        continue; // skip the </View>
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log('Modified:', file);
  } else {
    console.log('No header found:', file);
  }
}
