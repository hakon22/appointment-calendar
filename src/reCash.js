const { exec } = require('child_process');
const fs = require('fs');

const reCash = () => {
  fs.unlink('../frontend/build/200.html', (error) => {
    if (error) throw error;
    console.log('Файл успешно удалён');
 });
  exec('make re-cash', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
};

setInterval(reCash, 86400000);