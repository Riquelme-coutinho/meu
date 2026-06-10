const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'screens', 'admin');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // replace <SafeAreaView with <View
  content = content.replace(/<SafeAreaView/g, '<View');
  content = content.replace(/<\/SafeAreaView>/g, '</View>');
  
  // remove import of SafeAreaView
  content = content.replace(/import\s+{\s*SafeAreaView\s*}\s+from\s+'react-native-safe-area-context';?\n?/g, '');
  
  fs.writeFileSync(filePath, content);
  console.log('Processed:', file);
}
